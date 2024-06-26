const User=require('../model/user');
const Address=require('../model/address');
const Service=require('../model/service');
const Vendor=require('../model/vendor');
const Rating=require('../model/rating');
const Wishlist=require('../model/wishlist');
const Cart=require('../model/cart');
const Bookedservice=require('../model/bookedservice');
const Aboutus=require('../model/aboutus');
const bcrypt = require('bcrypt');
const Catergory=require('../model/catergory');
const jwt = require('jsonwebtoken');
const Faq=require('../model/faq');
const Sos=require('../model/sos');

const path = require('path');
const multer = require('multer');
const { stat } = require('fs');
const { log } = require('console');

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
        // const email=req.email;
        const mobile=req.mobile;
        // const currentuserdetails=await User.findOne({email:email});
        const currentuserdetails=await User.findOne({mobile:mobile});
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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        await User.deleteOne({mobile:currentMobile});
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
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const user=await User.findOne({email:currentuseremail});
        const user=await User.findOne({mobile:currentMobile});

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
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const serv=req.body;
        const {quantity, addressid, coinsused}=req.body;
        console.log(req.body);
        if (!quantity || !addressid || (!coinsused && coinsused < 0)) {
            return res.status(400).send({message:"quantity, addressid, coinused is required", status: 400});
        }

        const {serviceid}=req.body;
        if (!serviceid) {
            return res.status(400).send({message:"serviceid is required", status: 400});
        }

        const servicebyId=await Service.findById(serviceid);
        if (!servicebyId) {
            return res.status(404).send({message:"service not found by this id", status: 404});
        }

        // const addressbyId=await Address.findById(addressid);
        // if (!addressbyId) {
        //     return res.status(404).send({message:"address not found by this id", status: 404});
        // }
        
        //get vendor by vendoremail (it is available in service model).
        // const vendorbyvendoremail=await Vendor.findOne({email:servicebyId.vendoremail});
        const vendorbyvendoremail=await Vendor.findOne({mobile:servicebyId.vendoreMobile});




        // const userbyuseremail=await User.findOne({email:currentuseremail});
        const userbyuseremail=await User.findOne({mobile:currentMobile});

        // const serviceid=serv._id;
        const vendorid=vendorbyvendoremail._id;
        //const vendorid=serv.vendorid;
        const userid=userbyuseremail._id;   

        if (serviceid==null || vendorid==null || userid==null) {
            return res.status(400).send({message:"serviceid or vendorid or userid is null", status: 400});  
        }
        
        const newbookeservice=new Bookedservice({serviceid,userid,vendorid:vendorid, date: new Date()});
        
        newbookeservice.servicestatus="PLACED";

        // newbookeservice.catergory=serv.catergory;//+++++++
        // newbookeservice.quantity=serv.quantity;//+++++++
        // newbookeservice.bookedprice=serv.price;//+++++++
        // newbookeservice.addressid=serv.addressid;//+++++++
        // newbookeservice.coinsused=serv.coinsused;//+++++++
        
        newbookeservice.catergory=servicebyId.catergory;
        newbookeservice.quantity=quantity;
        newbookeservice.bookedprice=servicebyId.price;
        newbookeservice.addressid=addressid;
        newbookeservice.coinsused=coinsused;
        
        await newbookeservice.save();
        return res.status(200).send({newbookeservice, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check console to see error", status: 500});
    }
};

//all booked services by user
exports.myorders= async (req,res)=>{
    try {
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const userbyuseremail=await User.findOne({email:currentuseremail});
        const userbyuseremail=await User.findOne({mobile:currentMobile});
        const userid=userbyuseremail?._id;  //changed '?'

        // const listofallordersbyuserid=await Bookedservice.find({userid:userid});
        //+++++++
        const listofallordersbyuserid=await Bookedservice.find({userid:userid /*, servicestatus: { $ne: "cancelled by user" }*/});
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
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        const {name}=req.body;
        if (!name) {
            return res.status(400).send({message:"name variable is null", status: 400});
        }
        const user=await User.findOne({mobile:currentMobile});
        user.name=name;
        await user.save();
        return res.status(200).send({user, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};


//user home
exports.userhome=async(req,res)=>{
    try {
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const userbyuseremail=await User.findOne({email:currentuseremail});
        const userbyuseremail=await User.findOne({mobile:currentMobile});
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

        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const userbyuseremail=await User.findOne({email:currentuseremail});
        const userbyuseremail=await User.findOne({mobile:currentMobile});
        const userid=userbyuseremail._id;
        const address=req.body;
        const {latitute, longitude}=req.body;
        const {addressType}=req.body;

        if(!addressType){
            return res.status(400).send({message:"addressType is required", status: 400});
        }
        
        const validAddressTypes = ["Home", "Work", "Other"];
        if (addressType && !validAddressTypes.includes(addressType)) {
            return res.status(400).send({ message: "addressType should be Home, Work or Other", status: 400 });
        }

        const newaddress=new Address({userid:userid, houseno:address.houseno, lineone:address.lineone, linetwo:address.linetwo, linethree:address.linethree, landmark:address.landmark, pincode:address.pincode, area_street:address.area_street, city: address.city, country: address.country, name: address.name, mobile: address.mobile, sector_area: address.sector_area, state: address.state});
        
        if (latitute) {
            newaddress.latitude=latitute;
        }
        if (longitude) {
            newaddress.longitude=longitude;
        }
        if (addressType) {
            newaddress.addressType=addressType;
        }

        await newaddress.save();
        const addressbyuserid=await Address.find({userid:userid});
        return res.status(200).send({newaddress, addressbyuserid, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//get all services by catergory and with service averageRating and total number of ratings of that service
exports.getbycatergory=async(req,res)=>{
    try {
        const {catergory}=req.body;
        const listofservices=await Service.find({catergory:catergory});

        //list for storing services with average rating and total number of ratings of that service
        const list=[];

        //get all ratings of services of by serviceid
        for (let i=0;i<listofservices.length;i++){
            const serviceid=listofservices[i]._id;
            const allratings=await Rating.find({serviceid:serviceid});
            
            //calculate total rating of each service by serviceid
            let totalrating=0;
            for (let j=0;j<allratings.length;j++){
                totalrating+=allratings[j].rating;
            }
            
            //calculate average rating of each service by serviceid
            let rating=0;
            if (allratings.length>0) {
                rating=totalrating/allratings.length;
            }
            listofservices[i].rating=rating;

            list.push({service: listofservices[i], averageRating: rating, totalRatings: allratings.length});
        }

        return res.status(200).send({list, status: 200});

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//provide rating to vendor
exports.provideRating=async(req,res)=>{
    try {
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const userbyuseremail=await User.findOne({email:currentuseremail});
        const userbyuseremail=await User.findOne({mobile:currentMobile});
        const userid=userbyuseremail._id
        const {rating , vendoremail, serviceid, vendoreMobile}=req.body;
        if (!rating || !vendoreMobile || !serviceid) {
            return res.status(400).send({message:"rating, vendoremail and serviceid is required", status: 400});
        }

        if (rating>5 || rating<0) {
            return res.status(400).send({message:"rating should be between 0 and 5", status: 400});
        }

        // const vendorbyvendoremail=await Vendor.findOne({email:vendoremail});
        const vendorbyvendoremail=await Vendor.findOne({mobile:vendoreMobile});
        const vendorid=vendorbyvendoremail._id;
        const newrating=new Rating({rating:rating, vendorid:vendorid, userid:userid, serviceid:serviceid});
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
        if(!req.role==="User"){
            return res.status(403).send({message:"You are not a User", status: 403});
        }
        if(!req.file){
            return res.status(400).send({message:"Image not uploaded from client side", status: 400});
        }
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const userbyuseremail=await User.findOne({email:currentuseremail});
        const userbyuseremail=await User.findOne({mobile:currentMobile});
        
        // const image = { path: req.file.path };//orignial code for photo path

        // Extract the relative path from 'uploads' directory
        const uploadDirIndex = req.file.path.indexOf('uploads');
        const relativePath = req.file.path.substring(uploadDirIndex);

        const image = { path: relativePath };


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
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        const {serviceid, quantity}=req.body;
        
        if (!serviceid || !quantity) {
            return res.status(400).send({message:"serviceid and quantity is required", status: 400});
        }

        // const user=await User.findOne({email:currentuseremail});
        const user=await User.findOne({mobile:currentMobile});
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
        if(req.role!=="User"){
            return res.status(403).send({message:"You are not a User", status: 403});
        }
        // const currentuseremail=req.email;
        const currentMobile=req.mobile;
        // const user=await User.findOne({email:currentuseremail});
        const user=await User.findOne({mobile:currentMobile});

        //get all services in cart of current user
        const cartList=await Cart.find({userid:user._id});
        let services=[];
        for (let i=0;i<cartList.length;i++){
            const serviceid=cartList[i].serviceid;

            //get service by service's id of current user's cart
            const servicebyid=await Service.findById(serviceid);
            if (!servicebyid) {
                return res.status(400).send({message:"Service not found by this id", status: 400});
            }

            //find vendor of this service by vendoreMobile
            const vendor=await Vendor.findOne({mobile:servicebyid.vendoreMobile});

            //get total number of rating of this service by serviceid and vendorid
            const totalrating=await Rating.find({serviceid:serviceid, vendorid:vendor._id}).countDocuments();


            services.push({servicebyid, quantity : cartList[i].quantity, cartid: cartList[i]._id, totalrating});
        }


        return res.status(200).send({services, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//book all services in cart
exports.bookAllServicesInCart=async(req,res)=>{
    try {
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        const {addressid, usedcoins}=req.body;
        
        // const addressbyid=await Address.findById(addressid);
        // if (!addressbyid) {
        //     return res.status(400).send({message:"Address id not found", status: 400});
        // }

        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});
        const cartList=await Cart.find({userid:user._id});
        console.log(cartList);
        let currentBookedServices=[];
        for (let i = 0; i < cartList.length; i++) {
            const cart=cartList[i];
            const serviceid=cart.serviceid;
            const userid=user._id;
            const service=await Service.findById(serviceid);
            // const vendorByEmail=await Vendor.findOne({email:service.vendoremail});
            const vendorByEmail=await Vendor.findOne({mobile:service.vendoreMobile});

            const vendorid=vendorByEmail._id;
            const newbookeservice=new Bookedservice({serviceid,userid,vendorid, date: new Date()});
            newbookeservice.servicestatus="PLACED";

            newbookeservice.catergory=service.catergory;
            newbookeservice.quantity=cart.quantity;
            newbookeservice.addressid=addressid;
            newbookeservice.bookedprice=cart.serviceprice;
            newbookeservice.servicename=cart.servicename;
            if (usedcoins>0) {
                newbookeservice.coinsused=usedcoins;
            }
            if(!usedcoins){
                newbookeservice.coinsused=0;
            }

            console.log(newbookeservice);
            await newbookeservice.save();
            currentBookedServices.push(newbookeservice);
        }
        await Cart.deleteMany({userid:user._id});
        return res.status(200).send({message:"All services in cart booked", currentBookedServices ,status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//delete from service from cart
exports.detelteServiceFromCart=async(req,res)=>{
    try {
        const {cartid}=req.body;
        const cart=await Cart.findById(cartid);
        if (!cart) {
            return res.status(404).send({message:"Cart not found, cart id is invalid", status: 404});
        }
        await Cart.findByIdAndDelete(cartid);
        return res.status(200).send({message:"Service deleted from cart successfully", deleterCart: cart, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//update quantity of added service in cart
exports.updateQuantityOfServiceInCart=async(req,res)=>{
    try {
        const {cartid, quantity}=req.body;
        if(!cartid || !quantity || quantity<1){
            return res.status(400).send({message:"cartid and quantity is required and quantity should be greater than 0", status: 400});
        }
        const cart=await Cart.findById(cartid);
        if (!cart) {
            return res.status(404).send({message:"Cart not found, cart id is invalid", status: 404});
        }
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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        const {mobile, email}=req.body;
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});

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

        const token = jwt.sign({ email: user.email, role: user.role, mobile: user.mobile }, SECRET_KEY, { expiresIn: "7d" });

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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        const {serviceid}=req.body;
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});
        if(!user){
            return res.status(404).send({message:"User not found by this mobile", status: 404});
        }
        const userid=user._id;
        const service=await Service.findById(serviceid);
        if (!service) {
            return res.status(400).send({message:"Service not found", status: 400});
        }
        //check if serviceid and userid is already in exist wishlist, if yes then return service already in wishlist in current user.
        const getwishlistbyserviceid=await Wishlist.findOne({serviceid:serviceid, userid:userid});
        if (getwishlistbyserviceid) {
            return res.status(400).send({message:"service already is exist in wishlist of current user", status: 400});
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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});

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
        if (!wishlistid) {
            return res.status(400).send({message:"wishlistid is required", status: 400});
        }
        const wishlist=await Wishlist.findById(wishlistid);
        if (!wishlist) {
            return res.status(404).send({message:"Wishlist not found, wishlistId is invalid", status: 404});
        }
        await Wishlist.findByIdAndDelete(wishlistid);
        return res.status(200).send({message:"Service deleted from wishlist successfully", deletedwishlist: wishlist, status: 200});
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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});
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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});
        const ratingList=await Rating.find({userid:user._id});
        return res.status(200).send({ratingList, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get all categories existed in database with total number services of that categories existed in database.
// exports.getAllCategories=async(req,res)=>{
//     try {
//         const listOfServices=await Service.find({});
//         const catergoryList=[];
//         for (let i = 0; i < listOfServices.length; i++) {
//             const service=listOfServices[i];
//             if (!catergoryList.includes(service.catergory)) {
//                 catergoryList.push(service.catergory);
//             }
//         }
//         const catergoryListWithTotalServices=[];
//         for (let i = 0; i < catergoryList.length; i++) {
//             const catergory=catergoryList[i];
//             const totalServices=await Service.find({catergory:catergory}).countDocuments();
//             catergoryListWithTotalServices.push({catergory, totalServices});
//         }
//         return res.status(200).send({catergoryListWithTotalServices, status: 200});
//     }
//     catch (error) {
//         console.log(error);
//         return res.status(500).send({message:"Internal server error", status: 500});
//     }
// };

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

        // const vendor=await Vendor.findOne({email:service.vendoremail});
        const vendor=await Vendor.findOne({mobile:service.vendoreMobile});
        
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

//add coins to user
exports.addCoinsToUser=async(req,res)=>{
    try {
        if(req.role!=="User"){
            return res.status(403).send({message:"your are not a User", status: 403});
        }
        const {coins}=req.body;
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});
        if (coins<0 || !coins) {
            return res.status(400).send({message:"coins should be greater than 0 , or please enter coins", status: 400});
        }
        user.totalCoins+=coins;
        await user.save();
        return res.status(200).send({user, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//update user name, email, mobile, image
exports.updateUser=[upload.single('image'), async(req,res)=>{
    try {
        if(req.role!=="User"){
            return res.status(403).send({message:"your are not a User", status: 403});
        }
        const {name, email, mobile}=req.body;
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});
        
        if (name) {
            user.name=name;
        }
        if (email) {
            const emailExists=await User.findOne({email:email});
            if (emailExists) {
                return res.status(400).send({message:"Email already exists", status: 400});
            }
            user.email=email;
        }
        if (mobile) {
            const mobileExists=await User.findOne({mobile : mobile});
            if (mobileExists) {
                return res.status(400).send({message:"Mobile already exists", status: 400});
            }
            user.mobile=mobile;
        }

        //checking if image/file is uploaded or not by user on browser/postman
        if(req.file){
            image = { path: req.file.path };
            user.image=image;
        }
        
        await user.save();
        
        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
        return res.status(200).send({user, token, status: 200});

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
}];

//get all address of current user
exports.getAllAddress=async(req,res)=>{
    try {
        if(req.role!=="User"){
            return res.status(403).send({message:"your are not a User", status: 403});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const user=await User.findOne({email:currentemail});
        const user=await User.findOne({mobile:currentMobile});
        const addressList=await Address.find({userid:user._id});
        return res.status(200).send({addressList, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get all rating of by serviceid and vendorid
exports.getAllRatingByServiceIdAndVendorId=async(req,res)=>{
    try {
        // const {serviceid, vendoremail}=req.body;
        const {serviceid, vendoreMobile}=req.body;
        // if (!serviceid || !vendoremail) {
        if (!serviceid || !vendoreMobile) {
            return res.status(400).send({message:"serviceid and vendoremail is required", status: 400});
        }
        // const vendor=await Vendor.findOne({email:vendoremail});
        const vendor=await Vendor.findOne({mobile:vendoreMobile});
        const vendorid=vendor._id;
        const ratingList=await Rating.find({serviceid:serviceid, vendorid:vendorid});
        return res.status(200).send({ratingList, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get booked with highest quantity of services from all bookedservices in database
exports.getBookedServiceWithHighestQuantity=async(req,res)=>{
    try {

        //get all booked services from database in a list
        const bookedService=await Bookedservice.find({}).sort({quantity:-1}).limit(1);
        if (!bookedService) {
            return res.status(404).send({message:"Booked service not found", status: 404});
        }

        //quatity to top most booked service
        const quantity=bookedService[0].quantity;

        //get top most service by serviceid of booked service using bookedService list
        const service=await Service.findById(bookedService[0].serviceid);
        return res.status(200).send({service, quantity, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get booked with highest quantity of services from all bookedservices in database in last week.
exports.getBookedServiceWithHighestQuantityInLastWeek=async(req,res)=>{
    try {
        const lastweek = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
        const bookedService=await Bookedservice.find({date:{$gte:lastweek}}).sort({quantity:-1}).limit(1);
        if (!bookedService) {
            return res.status(404).send({message:"Booked service not found", status: 404});
        }
        const quantity=bookedService[0].quantity;
        const service=await Service.findById(bookedService[0].serviceid);
        return res.status(200).send({service, quantity, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get all Faqs
exports.getAllFaqs=async(req,res)=>{
    try {
        const faqList=await Faq.find({});
        return res.status(200).send({faqList, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//show services that can be used by user according to user's location and service's loacation under service's range
exports.getServicesAccordingToUserLocation=async(req,res)=>{
    try {
        const currentMobile=req.mobile;
        const user=await User.findOne({mobile:currentMobile});
        const userAddress=await Address.find({userid:user._id});
        if (!userAddress) {
            return res.status(404).send({message:"User address not found", status: 404});
        }
        const userLocation=userAddress[0];
        const allServices=await Service.find({});
        const services=[];
        for (let i = 0; i < allServices.length; i++) {
            const service=allServices[i];
            const vendor=await Vendor.findOne({mobile:service.vendoreMobile});
            const vendorAddress=await Address.find({userid:vendor._id});
            if (!vendorAddress) {
                return res.status(404).send({message:"Vendor address not found", status: 404});
            }
            const vendorLocation=vendorAddress[0];
            const distance=geolib.getDistance({latitude: userLocation.latitude, longitude: userLocation.longitude}, {latitude: vendorLocation.latitude, longitude: vendorLocation.longitude});
            if (distance<=service.range) {
                services.push(service);
            }
        }
        return res.status(200).send({services, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get top 5 most booked services in last week
exports.getTop5MostBookedServicesInLastWeek = async (req, res) => {
    try {
        const lastweek = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

        // Find all services booked in the last week
        const bookedServices = await Bookedservice.find({ date: { $gte: lastweek } });

        if (bookedServices.length === 0) {
            return res.status(404).send({ message: "No booked services found", status: 404 });
        }

        // Group services by category
        const servicesByCategory = {};

        for (const bookedService of bookedServices) {
            const service = await Service.findById(bookedService.serviceid);

            if (service) {
                const category = service.catergory;
                if (!servicesByCategory[category]) {
                    servicesByCategory[category] = [];
                }

                servicesByCategory[category].push({
                    service,
                    quantity: bookedService.quantity,
                });
            }
        }

        // Get the top services from each category
        const topServices = [];

        for (const category in servicesByCategory) {
            const services = servicesByCategory[category];
            services.sort((a, b) => b.quantity - a.quantity); // Sort services by quantity in descending order
            const topServicesForCategory = services.slice(0, Math.min(5, services.length)); // Get up to top 5 services
            topServicesForCategory.forEach((service) => {
                topServices.push({
                    service: service.service,
                    category,
                    quantity: service.quantity,
                });
            });
        }

        console.log(topServices);

        return res.status(200).send({ services: topServices, status: 200 });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Internal server error", status: 500 });
    }
};

//search services by service name and catergory
exports.searchServicesByServiceNameAndCatergory=async(req,res)=>{
    try {
        const {search}=req.body;
        if (!search) {
            return res.status(400).send({message:"search is required", status: 400});
        }
        const services=await Service.find({$or:[{servicename:{$regex:search, $options:'i'}},{catergory:{$regex:search, $options:'i'}}]});
        return res.status(200).send({services, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get all services by name and catergory within a 50km range of user's location using user's longitude and latitude
exports.getServicesByNameAndCatergoryWithin50kmRange=async(req,res)=>{
    try {
        const {search, latitute, longitude}=req.body;
        if (!search || !latitute || !longitude) {
            return res.status(400).send({message:"search, latitute and longitude is required", status: 400});
        }
        const services=await Service.find({$or:[{servicename:{$regex:search, $options:'i'}},{catergory:{$regex:search, $options:'i'}}]});
        const servicesWithin50kmRange=[];
        for (let i = 0; i < services.length; i++) {
            const service=services[i];
            const vendor=await Vendor.findOne({mobile:service.vendoreMobile});
            const vendorAddress=await Address.find({userid:vendor._id});
            if (!vendorAddress) {
                return res.status(404).send({message:"Vendor address not found", status: 404});
            }
            const vendorLocation=vendorAddress[0];
            const distance=geolib.getDistance({latitude: latitute, longitude: longitude}, {latitude: vendorLocation.latitude, longitude: vendorLocation.longitude});
            if (distance<=50) {
                servicesWithin50kmRange.push(service);
            }
        }
        return res.status(200).send({servicesWithin50kmRange, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
};

//get about us
exports.getAboutUs=async(req,res)=>{
    try {
        const aboutUs=await Aboutus.find({});
        if(!aboutUs){
            return res.status(404).send({message:"abous is not created by admin", status:404})

        }
        return res.status(200).send({aboutUs, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
}

//get sos
exports.getSos=async(req,res)=>{
    try {
        const sos=await Sos.find({});
        if(!sos){
            return res.status(404).send({message:"sos is not created by admin", status:404})
        }
        return res.status(200).send({sos, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
}

//delete user address by address id
exports.deleteUserAddress=async(req,res)=>{
    try {
        if(req.role!=="User"){
            return res.status(403).send({message:"your are not a User", status: 403});
        }

        const {addressid}=req.body;
        if (!addressid) {
            return res.status(400).send({message:"addressid is required", status: 400});
        }

        const user=await User.findOne({mobile:req.mobile});

        const address= await Address.findOne({_id:addressid, userid: user._id})
        if (!address) {
            return res.status(404).send({message:"Address not found, or current user id is not belong to provided address id", status: 404});
        }
        await Address.findByIdAndDelete(addressid);
        return res.status(200).send({message:"Address deleted successfully", address, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"Internal server error", status: 500});
    }
}






