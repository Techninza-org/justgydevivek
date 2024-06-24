const User=require('../model/user');
const Address=require('../model/address');
const Service=require('../model/service');
const Vendor=require('../model/vendor');
const Rating=require('../model/rating');
const Wishlist=require('../model/wishlist');
const Cart=require('../model/cart');
const Bookedservice=require('../model/bookedservice');
const bcrypt = require('bcrypt');
const Catergory=require('../model/catergory');

const path = require('path');
const multer = require('multer');
const { stat } = require('fs');

const SALT_ROUND=10;
const SECRET_KEY = 'aaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccccccccccccc';

// Configure multer to store files on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    //   cb(null, 'uploads/');
    cb(null, path.join(__dirname, '../uploads/'));
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
        newbookeservice.bookedprice=serv.price;//+++++++
        
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

        // const listofallordersbyuserid=await Bookedservice.find({userid:userid});
        //+++++++
        const listofallordersbyuserid=await Bookedservice.find({userid:userid, servicestatus: { $ne: "cancelled by user" }});
        //+++++++

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
        const {latitute, longitude}=req.body;
        const newaddress=new Address({userid:userid, houseno:address.houseno, lineone:address.lineone, linetwo:address.linetwo, linethree:address.linethree, landmark:address.landmark, pincode:address.pincode});
        
        if (latitute) {
            newaddress.latitude=latitute;
        }
        if (longitude) {
            newaddress.longitude=longitude;
        }

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

        //check if serviceid and userid is already in exist cart, if yes then return service already in cart in current user.
        const getcartbyserviceid=await Cart.findOne({serviceid:serviceid, userid:user._id});
        if (getcartbyserviceid) {
            return res.status(400).send({message:"service already is exist in cart of current user", status: 400});
        }

        const cart=new Cart({serviceid:serviceid, quantity:quantity, userid:user._id, servicename: service.servicename});
        
        //+++++++
        cart.servicecatergory=service.catergory;
        cart.serviceprice=service.price;
        //+++++++

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
        const user=await User.findOne({email:currentuseremail});
        const cartList=await Cart.find({userid:user._id});
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

//update mobile and email
exports.updateMobileAndEmail=async(req,res)=>{
    try {
        const currentemail=req.email;
        const {mobile, email}=req.body;
        const user=await User.findOne({email:currentemail});

        if(!user){
            return res.status(404).send({message:"User not found", status: 404});
        }

        if (mobile) {
            user.mobile=mobile;
        }
        if (email) {
            user.email=email;
        }

        await user.save();

        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).send({user, token, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error inside catch block", status: 500});
    }
};

//cancel booked service by user
exports.cancelBookedService=async(req,res)=>{
    try {
        const {bookedserviceid}=req.body;
        const bookedservice=await Bookedservice.findById(bookedserviceid);
        bookedservice.servicestatus="cancelled by user";
        await bookedservice.save();
        return res.status(200).send({bookedservice, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//add service to wishlist
exports.addServiceToWishlist=async(req,res)=>{
    try {
        const currentemail=req.email;
        const {serviceid}=req.body;
        const user=await User.findOne({email:currentemail});
        const userid=user._id;
        const service=await Service.findById(serviceid);
        if (!service) {
            return res.status(400).send({message:"Service not found", status: 400});
        }
        const wishlist=new Wishlist({serviceid, userid});
        wishlist.servicecatergory=service.catergory;
        wishlist.serviceprice=service.price;
        await wishlist.save();
        return res.status(200).send({wishlist, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get all services in wishlist of current user
exports.getAllServicesInWishlist=async(req,res)=>{
    try {
        const currentemail=req.email;
        const user=await User.findOne({email:currentemail});
        const wishlistList=await Wishlist.find({userid:user._id});
        return res.status(200).send({wishlistList, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//delete service from wishlist
exports.deleteServiceFromWishlist=async(req,res)=>{
    try {
        const {wishlistid}=req.body;
        await Wishlist.findByIdAndDelete(wishlistid);
        return res.status(200).send({message:"Service deleted from wishlist successfully", status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error inside trycatch may be whishlist id is invalid", status: 500});
    }
};

//move service from wishlist to cart
exports.moveServiceFromWishlistToCart=async(req,res)=>{
    try {
        const {wishlistid}=req.body;
        const wishlist=await Wishlist.findById(wishlistid);

        if (!wishlist) {
            return res.status(400).send({message:"Wishlist not found, wishlistId is invalid", status: 400});
        }
        const currentemail=req.email;
        const user=await User.findOne({email:currentemail});
        const cart=new Cart({serviceid:wishlist.serviceid, quantity:1, userid:user._id, servicename: wishlist.servicename});
        cart.servicecatergory=wishlist.servicecatergory;
        await cart.save();
        await Wishlist.findByIdAndDelete(wishlistid);
        return res.status(200).send({cart, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error inside trycatch may be whishlist id is invalid", status: 500});
    }
};

//get all ratings given by user
exports.getAllRatingsGivenByUser=async(req,res)=>{
    try {
        const currentemail=req.email;
        const user=await User.findOne({email:currentemail});
        const ratingList=await Rating.find({userid:user._id});
        return res.status(200).send({ratingList, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get all categories existed in database with total number services of that categories existed in database.
exports.getAllCategories=async(req,res)=>{
    try {
        const listOfServices=await Service.find({});
        const catergoryList=[];
        for (let i = 0; i < listOfServices.length; i++) {
            const service=listOfServices[i];
            if (!catergoryList.includes(service.catergory)) {
                catergoryList.push(service.catergory);
            }
        }
        const catergoryListWithTotalServices=[];
        for (let i = 0; i < catergoryList.length; i++) {
            const catergory=catergoryList[i];
            const totalServices=await Service.find({catergory:catergory}).countDocuments();
            catergoryListWithTotalServices.push({catergory, totalServices});
        }
        return res.status(200).send({catergoryListWithTotalServices, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get all categories existed in database with Catergory icon of that catergory and with total number services of that categories existed in database.
exports.getAllCategoriesWithIcon=async(req,res)=>{
    try {
        const listOfServices=await Service.find({});
        const catergoryList=[];
        for (let i = 0; i < listOfServices.length; i++) {
            const service=listOfServices[i];
            if (!catergoryList.includes(service.catergory)) {
                catergoryList.push(service.catergory);
            }
        }
        const catergoryListWithTotalServices=[];
        for (let i = 0; i < catergoryList.length; i++) {
            const catergory=catergoryList[i];
            const totalServices=await Service.find({catergory:catergory}).countDocuments();
            const catergoryObj=await Catergory.findOne({catergorytype:catergory});
            // if (!catergoryObj) {
            //     return res.status(404).send({message:"Catergory not found", status: 404});
            // }
            catergoryListWithTotalServices.push({catergory, totalServices, catergoryObj});
        }
        return res.status(200).send({catergoryListWithTotalServices, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get service by serviceid
exports.getServiceByServiceId=async(req,res)=>{
    try {
        if(req.role!=="User"){
            return res.status(403).send({message:"your are not a User", status: 403});
        }
        const {serviceid}=req.body;
        const service=await Service.findById(serviceid);
        if (!service) {
            return res.status(404).send({message:"Service not found", status: 404});
        }

        const vendor=await Vendor.findOne({email:service.vendoremail});
        
        const vendorid=vendor._id;
        const ratingList=await Rating.find({vendorid:vendorid});
        let totalRating=0;
        for (let i = 0; i < ratingList.length; i++) {
            const rating=ratingList[i];
            totalRating+=rating.rating;
        }

        let averageRating=totalRating/ratingList.length;
        if(!averageRating){
            averageRating=0;
        }

        return res.status(200).send({service, averageRating, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};


