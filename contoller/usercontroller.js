const User=require('../model/user');
const Address=require('../model/address');
const Service=require('../model/service');
const Vendor=require('../model/vendor');
const Rating=require('../model/rating');
const Cart=require('../model/cart');
const Bookedservice=require('../model/bookedservice');
const bcrypt = require('bcrypt');

const path = require('path');
const multer = require('multer');
const { stat } = require('fs');

const SALT_ROUND=10;

// Configure multer to store files on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });

//get all details of current user
exports.getAll=async (req,res)=>{
    try {
        const email=req.email;
        const currentuserdetails=await User.findOne({email:email});
        if(currentuserdetails){
            return res.status(200).send({currentuserdetails, status: 200});
        }else{
            return res.status(404).send({message:"vendor not found", status: 404});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}

//delete current user

exports.deleteuser=async (req,res)=>{
    try {
        const currentvendoremail=req.email;
        await User.deleteOne({email:currentvendoremail});
        return res.status(200).send({message:"deleted successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "inside catch user not deleted", status: 500});
    }
}

// update user password
exports.updateuser=async(req,res)=>{
    try {
        const {password}=req.body;
        const currentuseremail=req.email;
        const user=await User.findOne({email:currentuseremail});

        if (!password) {
            return res.status(400).send({message:"password variable is null", status: 400});
        }

        bcrypt.hash(password, SALT_ROUND, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Unable to update password" });
            }

            // Update the user's password and name if provided
            user.password = hashedPassword;

            // Save the updated user
            await user.save();
            user.password = undefined; // Remove password from response

            return res.status(200).send({ message: "Vendor updated successfully", user, status: 200});
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//get all offered services of vendor
exports.getallservices=async(req,res)=>{
    try {
        const {catergory}=req.body;
        const listOfServices=await Service.find({catergory: catergory});
        return res.status(200).send({listOfServices, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});      
    }
};

//book service by user
exports.bookservice=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const serv=req.body;
        
        //get vendor by vendoremail (it is available in service model).
        const vendorbyvendoremail=await Vendor.findOne({email:serv.vendoremail});
        const userbyuseremail=await User.findOne({email:currentuseremail});

        const serviceid=serv._id;
        const vendorid=vendorbyvendoremail._id;
        //const vendorid=serv.vendorid;
        const userid=userbyuseremail._id;

        if (serviceid==null || vendorid==null || userid==null) {
            return res.status(400).send({message:"serviceid or vendorid or userid is null", status: 400});  
        }
        
        const newbookeservice=new Bookedservice({serviceid,userid,vendorid, date: new Date()});
        console.log(serv._id);
        console.log(serv.vendoremail);
        newbookeservice.servicestatus="payment is done waiting for vendor to accept the service";
        newbookeservice.catergory=serv.catergory;//+++++++
        newbookeservice.quantity=serv.quantity;//+++++++
        await newbookeservice.save();
        return res.status(200).send({newbookeservice, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//all booked services by user
exports.myorders= async (req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        const userid=userbyuseremail?._id;  //changed '?'
        const listofallordersbyuserid=await Bookedservice.find({userid:userid});
        return res.status(200).send({listofallordersbyuserid, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};

//update user's name
exports.setname=async(req,res)=>{
    try {
        currentuseremail=req.email;
        const {name}=req.body;
        if (!name) {
            return res.status(400).send({message:"name variable is null", status: 400});
        }
        const userbyuseremail=await User.findOne({email:currentuseremail});
        userbyuseremail.name=name;
        await userbyuseremail.save();
        return res.status(200).send({userbyuseremail, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};


//user home
exports.userhome=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        const userid=userbyuseremail._id;
        const addressbyuserid=await Address.find({userid:userid});
        return res.status(200).send({userbyuseremail, addressbyuserid, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//add address
exports.addaddress=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        const userid=userbyuseremail._id;
        const address=req.body;
        const newaddress=new Address({userid:userid, houseno:address.houseno, lineone:address.lineone, linetwo:address.linetwo, linethree:address.linethree, landmark:address.landmark, pincode:address.pincode});
        await newaddress.save();
        const addressbyuserid=await Address.find({userid:userid});
        return res.status(200).send({newaddress, addressbyuserid, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//get by catergory
exports.getbycatergory=async(req,res)=>{
    try {
        const {catergory}=req.body;
        const listofservices=await Service.find({catergory:catergory});
        return res.status(200).send({listofservices, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//provide rating to vendor
exports.provideRating=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        const userid=userbyuseremail._id
        const {rating , vendoremail}=req.body;

        if (rating>5 || rating<0) {
            return res.status(400).send({message:"rating should be between 0 and 5", status: 400});
        }

        const vendorbyvendoremail=await Vendor.findOne({email:vendoremail});
        const vendorid=vendorbyvendoremail._id;
        const newrating=new Rating({rating:rating, vendorid:vendorid, userid:userid});
        await newrating.save();
        return res.status(200).send({newrating, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//get all services of vendor without catergory
exports.getall=async(req,res)=>{
    try {
        // const currenUserEmail=req.email;
        const listofservices=await Service.find({});
        return res.status(200).send({listofservices, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//upload user image
exports.uploadimage=[upload.single('image'),async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        
        const image = { path: req.file.path };
        if (!image) {
            return res.status(400).send({ message: "Image not uploaded", status: 400});
        }
        userbyuseremail.image = image;
        await userbyuseremail.save();
        return res.status(200).send({ userbyuseremail, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error", status: 500});
    }
}];

//adding service to cart
exports.addtocart=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const {serviceid, quantity}=req.body;
        const user=await User.findOne({email:currentuseremail});
        const service=await Service.findById(serviceid);
        if (!service) {
            return res.status(400).send({message:"service not found please enter a valid serviceid", status: 400});
        }
        const cart=new Cart({serviceid:serviceid, quantity:quantity, userid:user._id, servicename: service.servicename});
        await cart.save();
        return res.status(200).send({cart, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
}

//get all services in cart by current user
exports.getCartServicesFromCurrentUser=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const cartList=await Cart.find({userid:currentuseremail});
        return res.status(200).send({cartList, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//book all services in cart
exports.bookAllServicesInCart=async(req,res)=>{
    try {
        const currentemail=req.email;
        const user=await User.findOne({email:currentemail});
        const cartList=await Cart.find({userid:user._id});
        console.log(cartList);
        for (let i = 0; i < cartList.length; i++) {
            const cart=cartList[i];
            const serviceid=cart.serviceid;
            const userid=user._id;
            const service=await Service.findById(serviceid);
            const vendorid=service.vendorid;
            const newbookeservice=new Bookedservice({serviceid,userid,vendorid, date: new Date()});
            newbookeservice.servicestatus="payment is done waiting for vendor to accept the service";

            newbookeservice.catergory=service.catergory;
            newbookeservice.quantity=cart.quantity;
            console.log(newbookeservice);
            await newbookeservice.save();
        }
        await Cart.deleteMany({userid:user._id});
        return res.status(200).send({message:"All services in cart booked", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//delete from service from cart
exports.detelteServiceFromCart=async(req,res)=>{
    try {
        const {cartid}=req.body;
        await Cart.findByIdAndDelete(cartid);
        return res.status(200).send({message:"Service deleted from cart successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//update quantity of added service in cart
exports.updateQuantityOfServiceInCart=async(req,res)=>{
    try {
        const {cartid, quantity}=req.body;
        const cart=await Cart.findById(cartid);
        cart.quantity=quantity;
        await cart.save();
        return res.status(200).send({cart, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};
