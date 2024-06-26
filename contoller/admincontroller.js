const Admin = require('../model/admin');
const Vendor=require('../model/vendor');
const User=require('../model/user');
const Service=require('../model/service');
const BookedService=require('../model/bookedservice');
const Address=require('../model/address');
const Kyc=require('../model/kyc');
const Catergory=require('../model/catergory');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'aaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccccccccccccc';
const SALT_ROUNDS = 10;


const path = require('path');
const multer = require('multer');

// Configure multer to store files on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    //   cb(null, '../uploads/'); //this line is not working on server(linux-ubuntu) but works on local(windows)
    cb(null, path.join(__dirname, '../uploads/')); //this line is working on server and local both.
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });


//create Vendor
exports.createVendor=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
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
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
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
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
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
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
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
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
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
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
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
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
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
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Vendor id is required, please pass it in url path',status:400});
        }

        const isDel=await Vendor.findByIdAndDelete(id);
        if(!isDel){
            return res.status(400).json({message:'Vendor not found, may be vendor id is invalid',status:400});
        }

        return res.status(200).json({message:'Vendor deleted successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to delete vendor, may be vendor-Id is invalid',status:500});
    }
};

//delete user by id
exports.deleteUserById=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'User id is required, please pass it in url path',status:400});
        }

        const isDel=await User.findByIdAndDelete(id);
        if(!isDel){
            return res.status(400).json({message:'User not found, may be user id is invalid',status:400});
        }

        return res.status(200).json({message:'User deleted successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to delete user, may be user-Id is invalid',status:500});
    }
};

//get all kycs
exports.fetchAllKycs=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
        const listOfkycs=await Kyc.find();
        return res.status(200).json({kycs:listOfkycs,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch kycs',status:500});
    }
};

//get Kyc by vendor id
exports.fetchKycByVendorId=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
        const {id}=req.params;
        const kyc=await Kyc.findOne({vendor:id});
        if(!kyc){
            return res.status(400).json({message:'Kyc not found, may be kyc id is not valid',status:400});
        }
        return res.status(200).json({kyc:kyc,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch kyc, may be vendor-Id is invalid',status:500});
    }
};

//get vendor by id
exports.fetchVendorById=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Vendor id is required, please pass it in url path',status:400});
        }
        const vendor=await Vendor.findById(id);
        if(!vendor){
            return res.status(400).json({message:'Vendor not found, may be vendor id is not valid',status:400});
        }

        const vendorAddress=await Address.find({vendor:id});
        return res.status(200).json({vendor:vendor, vendorAddress,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch vendor, may be vendor-Id is invalid',status:500});
    }
};

//get user by id
exports.fetchUserById=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'User id is required, please pass it in url path',status:400});
        }
        const user=await User.findById(id);
        if(!user){
            return res.status(400).json({message:'User not found, may be user id is not valid',status:400});
        }
        const userAddress=await Address.find({user:id});
        return res.status(200).json({user:user, userAddress,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch user, may be user-Id is invalid',status:500});
    }
};

//get kyc by vendor id
exports.fetchKycByVendorId=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Vendor id is required, please pass it in url path',status:400});
        }

        const kyc=await Kyc.findOne({vendorid:id});
        if(!kyc){
            return res.status(400).json({message:'Kyc not found, may be kyc id is not valid',status:400});
        }

        return res.status(200).json({kyc:kyc,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch kyc, may be vendor-Id is invalid',status:500});
    }
};

//get service by id
exports.fetchServiceById=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Service id is required, please pass it in url path',status:400});
        }

        const service=await Service.findById(id);
        if(!service){
            return res.status(400).json({message:'Service not found, may be service id is not valid',status:400});
        }

        return res.status(200).json({service:service,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch service, may be service-Id is invalid',status:500});
    }
};

//get all services by vendor email
exports.fetchAllServicesByVendorEmail=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }
        
        const {email}=req.params;
        if(!email){
            return res.status(400).json({message:'Vendor email is required, please pass it in url path',status:400});
        }

        const vendor=await Vendor.findOne({email:email});
        if(!vendor){
            return res.status(400).json({message:'Vendor not found, may be vendor email is not valid',status:400});
        }

        const services=await Service.find({vendoremail:email});
        return res.status(200).json({services:services,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch services, may be vendor-Email is invalid',status:500});
    }
};

//edit vendor by id
exports.editVendorById=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Vendor id is required, please pass it in url path',status:400});
        }

        const vendor=await Vendor.findById(id);
        if(!vendor){
            return res.status(400).json({message:'Vendor not found, may be vendor id is not valid',status:400});
        }

        const {name,email,mobile}=req.body;
        if(name){
            vendor.name=name;
        }
        if(email){
            const isAlreadyExist=await Vendor.findOne({ email });
            if(isAlreadyExist){
                return res.status(400).json({message:'Vendor email already exists',status:400});
            }
            vendor.email=email;
            const allservices=await Service.find({vendoremail:vendor.email});
            allservices.map(async(service)=>{
                service.vendoremail=email;
                await service.save();
            }); 
        }
        if(mobile){
            const isAlreadyExistByMobile=await Vendor.findOne({ mobile });
            if(isAlreadyExistByMobile){
                return res.status(400).json({message:'Mobile number already exists',status:400});
            }
            vendor.mobile=mobile;
        }

        await vendor.save();
        
        //generate new token
        const tokenOfVendor = jwt.sign({ email: vendor.email, role: vendor.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).json({message:'Vendor updated successfully', tokenOfVendor, status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to update vendor, may be vendor-Id is invalid',status:500});
    }
};

//edit user by id
exports.editUserById=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'User id is required, please pass it in url path',status:400});
        }

        const user=await User.findById(id);
        if(!user){
            return res.status(400).json({message:'User not found, may be user id is not valid',status:400});
        }

        const {name,email,mobile}=req.body;
        if(name){
            user.name=name;
        }
        if(email){
            const isAlreadyExist=await User.findOne({ email });
            if(isAlreadyExist){
                return res.status(400).json({message:'User email already exists',status:400});
            }
            user.email=email;
        }
        if(mobile){
            const isAlreadyExistByMobile=await User.findOne({ mobile });
            if(isAlreadyExistByMobile){
                return res.status(400).json({message:'Mobile number already exists',status:400});
            }
            user.mobile=mobile;
        }

        await user.save();
        
        //generate new token
        const tokenOfUser = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).json({message:'User updated successfully', tokenOfUser, status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to update user, may be user-Id is invalid',status:500});
    }
};

//add catergory to application
exports.addCatergory=[upload.single('icon'),async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {catergorytype, startcolor, endcolor}=req.body;
        const icon={ path:  req.file.path };

        const isAlreadyExist=await Catergory.findOne({ catergorytype: catergorytype });
        if(isAlreadyExist){
            return res.status(400).json({message:'Catergory already exists',status:400});
        }
        // if (startcolor.length !== 7 || endcolor.length !== 7 || !startcolor || !endcolor || !startcolor.startsWith('#') || !endcolor.startsWith('#')){
        //     return res.status(400).json({ message: 'invalid color, color should be start with # and must be length of 7 and color is mandatory to enter', status: 400 });
        // }

        const catergory=new Catergory({ catergorytype: catergorytype, catergoryicon: icon, startcolor: startcolor, endcolor: endcolor});
        await catergory.save();
        return res.status(200).json({message:'Catergory added successfully',status:200, catergory:catergory});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to add catergory',status:500});
    }
}];

//make kyc satues completed by vendor id
exports.approveKycByVendorId=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Vendor id is required, please pass it in url path',status:400});
        }

        const kyc=await Kyc.findOne({vendor:id});
        if(!kyc){
            return res.status(400).json({message:'Kyc not found, may be kyc id is not valid',status:400});
        }

        kyc.status='completed';
        await kyc.save();
        return res.status(200).json({message:'Kyc approved successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to approve kyc, may be vendor-Id is invalid',status:500});
    }
};

//change kyc status rejected by vendor id
exports.rejectKycByVendorId=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Vendor id is required, please pass it in url path',status:400});
        }

        const kyc=await Kyc.findOne({vendor:id});
        if(!kyc){
            return res.status(400).json({message:'Kyc not found, may be kyc id is not valid',status:400});
        }

        kyc.status='rejected';
        await kyc.save();
        return res.status(200).json({message:'Kyc rejected successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to reject kyc, may be vendor-Id is invalid',status:500});
    }
};







