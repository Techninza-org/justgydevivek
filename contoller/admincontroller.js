const Admin = require('../model/admin');
const Vendor=require('../model/vendor');
const User=require('../model/user');
const Service=require('../model/service');
const BookedService=require('../model/bookedservice');
const Address=require('../model/address');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'aaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccccccccccccc';
const SALT_ROUNDS = 10;

//create Vendor
exports.createVendor=async(req,res)=>{
    try {
        const {email,password,name,mobile}=req.body;
        const isAlreadyExist=await Vendor.findOne({ email });
        const isAlreadyExistByMobile=await Vendor.findOne({ mobile });

        if(isAlreadyExist){
            return res.status(400).json({message:'Vendor already exists',status:400});
        }
        if(isAlreadyExistByMobile){
            return res.status(400).json({message:'Mobile number already exists',status:400});
        }

        bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: "Unable to create vendor" });
            }
            const vendor = new Vendor({ name, mobile, email, password: hashedPassword, usercreationdate: new Date()});
            await vendor.save();

            delete vendor.password;
            const token = jwt.sign({ email: vendor.email, role: vendor.role }, SECRET_KEY, { expiresIn: "7d" });
            return res.status(200).send({vendor: vendor, token: token, status: 200});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to create vendor',status:500});
    }
};

//create User
exports.createUser=async(req,res)=>{
    try {
        const {email,password,name,mobile}=req.body;
        const isAlreadyExist=await User.findOne({ email });
        const isAlreadyExistByMobile=await User.findOne({ mobile });

        if(isAlreadyExist){
            return res.status(400).json({message:'User already exists',status:400});
        }
        if(isAlreadyExistByMobile){
            return res.status(400).json({message:'Mobile number already exists',status:400});
        }

        bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(401).send({ message: "Unable to create user" });
            }
            const user = new User({ name, mobile, email, password: hashedPassword, usercreationdate: new Date()});
            await user.save();

            delete user.password;
            const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });
            return res.status(200).send({user: user, token: token, status: 200});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to create user',status:500});
    }
};

//fetch all vendors
exports.fetchAllVendors=async(req,res)=>{
    try {
        const vendors=await Vendor.find();
        return res.status(200).json({vendors:vendors,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch vendors',status:500});
    }
};

//fetch all users
exports.fetchAllUsers=async(req,res)=>{
    try {
        const users=await User.find();
        return res.status(200).json({users:users,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch users',status:500});
    }
};

//fetch all services
exports.fetchAllServices=async(req,res)=>{
    try {
        const services=await Service.find();
        return res.status(200).json({services:services,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch services',status:500});
    }
};

//fetch all booked services
exports.fetchAllBookedServices=async(req,res)=>{
    try {
        const bookedServices=await BookedService.find();
        return res.status(200).json({bookedServices:bookedServices,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch booked services',status:500});
    }
};

//fetch all addresses
exports.fetchAllAddresses=async(req,res)=>{
    try {
        const addresses=await Address.find();
        return res.status(200).json({addresses:addresses,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch addresses',status:500});
    }
};

//delete vendor by id
exports.deleteVendorById=async(req,res)=>{
    try {
        const {id}=req.params;
        await Vendor.findByIdAndDelete(id);
        return res.status(200).json({message:'Vendor deleted successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to delete vendor, may be vendor-Id is invalid',status:500});
    }
};


