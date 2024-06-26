const Admin = require('../model/admin');
const Vendor=require('../model/vendor');
const User=require('../model/user');
const Service=require('../model/service');
const BookedService=require('../model/bookedservice');
const Address=require('../model/address');
const Kyc=require('../model/kyc');
const Catergory=require('../model/catergory');
const Aboutus=require('../model/aboutus');
const Sos=require('../model/sos');
const Faq=require('../model/faq');
const Coupon=require('../model/coupon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'aaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccccccccccccc';
const SALT_ROUNDS = 10;


const path = require('path');
const multer = require('multer');
const { getServiceByServiceId } = require('./usercontroller');

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

        if(!email || !password || !name || !mobile){
            return res.status(400).json({message:'name, passowrd, mobile, email is required and mobile and email should be unique',status:400});
        }

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
            const token = jwt.sign({ email: vendor.email, role: vendor.role, mobile: vendor.mobile }, SECRET_KEY, { expiresIn: "7d" });
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

        if(!email || !password || !name || !mobile){
            return res.status(400).json({message:'name, passowrd, mobile, email is required and mobile and email should be unique',status:400});
        }

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
            const token = jwt.sign({ email: user.email, role: user.role, mobile: user.mobile }, SECRET_KEY, { expiresIn: "7d" });
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
        const kyc=await Kyc.findOne({vendorid:id});
        if(!kyc){
            return res.status(400).json({message:'Kyc not found, may be vendor id is not valid or kyc is not submitted by this vendor',status:400});
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
// exports.fetchKycByVendorId=async(req,res)=>{
//     try {
//         if(req.role!=='Admin'){
//             return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
//         }

//         const {id}=req.params;
//         if(!id){
//             return res.status(400).json({message:'Vendor id is required, please pass it in url path',status:400});
//         }

//         const kyc=await Kyc.findOne({vendorid:id});
//         if(!kyc){
//             return res.status(400).json({message:'Kyc not found, may be kyc id is not valid',status:400});
//         }

//         return res.status(200).json({kyc:kyc,status:200});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:'Unable to fetch kyc, may be vendor-Id is invalid',status:500});
//     }
// };

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
        const tokenOfVendor = jwt.sign({ email: vendor.email, role: vendor.role, mobile: vendor.mobile }, SECRET_KEY, { expiresIn: "7d" });

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
        const tokenOfUser = jwt.sign({ email: user.email, role: user.role, mobile: user.mobile }, SECRET_KEY, { expiresIn: "7d" });

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
        if(!req.file){
            return res.status(400).json({message:'Icon is required, please upload it',status:400});
        }


        const {catergorytype, startcolor, endcolor}=req.body;
        // const icon={ path:  req.file.path }; //original code for icon image

        //++++++++++++++++++++
        const uploadDirIndex = req.file.path.indexOf('uploads');
        const relativePath = req.file.path.substring(uploadDirIndex);

        const icon = { path: relativePath };
        //++++++++++++++++++++

        if(!catergorytype || !startcolor || !endcolor){
            return res.status(400).json({message:'Catergory type, start color and end color is required',status:400});
        }

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

        const kyc=await Kyc.findOne({vendorid:id});
        if(!kyc){
            return res.status(400).json({message:'Kyc not found, may be vendor id is not valid',status:400});
        }

        kyc.status='completed';
        await kyc.save();
        return res.status(200).json({message:'Kyc approved successfully', kyc, status:200});
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

        const kyc=await Kyc.findOne({vendorid:id});
        if(!kyc){
            return res.status(400).json({message:'Kyc not found, may be vendor id is not valid',status:400});
        }

        kyc.status='rejected';
        await kyc.save();
        return res.status(200).json({message:'Kyc rejected successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to reject kyc, may be vendor-Id is invalid',status:500});
    }
};

//create Faq
exports.createFAQ=async(req,res)=>{
    try {
        if(req.role!=='Admin'){
            return res.status(401).json({message:'Unauthorized access you are not an admin',status:401});
        }

        const {question,answer}=req.body;
        if(!question || !answer){
            return res.status(400).json({message:'Question and answer is required',status:400});
        }

        const faq=new Faq({question:question,answer:answer});
        await faq.save();
        return res.status(200).json({message:'FAQ added successfully',status:200, faq:faq});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to add FAQ',status:500});
    }
};

//get all vendors in database in new first oreder
exports.getAllVendors=async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }
        const vendors=await Vendor.find().sort({vendorcreationdate:-1});
        return res.status(200).json({vendors:vendors,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch vendors',status:500});
    }
};

//get all users in database in new first oreder
exports.getAllUsers=async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }
        const users=await User.find().sort({usercreationdate:-1});
        return res.status(200).json({users:users,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch users',status:500});
    }
};

//create about us by using description, title and image
exports.createAboutUs=[upload.single('image'),async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }
        if(!req.file){
            return res.status(400).json({message:'Image is required, please upload it',status:400});
        }

        const {description,title}=req.body;

        if(!description || !title){
            return res.status(400).json({message:'Description and title is required',status:400});
        }

        //++++++++++++++++++++
        const uploadDirIndex = req.file.path.indexOf('uploads');
        const relativePath = req.file.path.substring(uploadDirIndex);

        const image = { path: relativePath };
        //++++++++++++++++++++

        if(!description || !title){
            return res.status(400).json({message:'Description and title is required',status:400});
        }

        //check if about us already exists
        const isAlreadyExist=await Aboutus.findOne({});
        if(isAlreadyExist){
            return res.status(400).json({message:'About us already exists, you can only update it',status:400});
        }

        const aboutus=new Aboutus({ description: description, title: title, image: image});
        await aboutus.save();
        return res.status(200).json({message:'About us added successfully',status:200, aboutus:aboutus});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to add about us',status:500});
    }
}];

//edit about us by using description, title and image
exports.editAboutUs=[upload.single('image'),async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }
        if(!req.file){
            return res.status(400).json({message:'Image is required, please upload it',status:400});
        }

        const {description,title}=req.body;

        if(!description || !title){
            return res.status(400).json({message:'Description and title is required',status:400});
        }

        //++++++++++++++++++++
        const uploadDirIndex = req.file.path.indexOf('uploads');
        const relativePath = req.file.path.substring(uploadDirIndex);

        const image = { path: relativePath };
        //++++++++++++++++++++

        if(!description || !title){
            return res.status(400).json({message:'Description and title is required',status:400});
        }

        //check if about us already exists
        const aboutus=await Aboutus.findOne({});
        if(!aboutus){
            return res.status(400).json({message:'About us not found, you can only add it',status:400});
        }

        aboutus.description=description;
        aboutus.title=title;
        aboutus.image=image;
        await aboutus.save();
        return res.status(200).json({message:'About us updated successfully',status:200, aboutus:aboutus});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to update about us',status:500});
    }
}];

//create SoS
exports.createSoS=async(req,res)=>{
    try {

        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }


        const {number}=req.body;

        if(!number){
            return res.status(400).json({message:'Number is required',status:400});
        }

        //check if sos already exists
        const isAlreadyExist=await Sos.findOne({});
        if(isAlreadyExist){
            return res.status(400).json({message:'SoS already exists, you can only update it',status:400});
        }

        const sos=new Sos({ number: number});
        await sos.save();
        return res.status(200).json({message:'SoS added successfully',status:200, sos:sos});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to add SoS',status:500});
    }
};

//edit sos
exports.editSos=async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }

        const {number}=req.body;

        if(!number){
            return res.status(400).json({message:'Number is required',status:400});
        }

        const sos=await Sos.findOne({});
        if(!sos){
            return res.status(400).json({message:'SoS not found, you can only add it',status:400});
        }

        sos.number=number;
        await sos.save();
        return res.status(200).json({message:'SoS updated successfully',status:200, sos:sos});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to update SoS',status:500});
    }
}

//delete FAQ by id
exports.deleteFAQ=async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'FAQ id is required, please pass it in url path',status:400});
        }

        const isDel=await Faq.findByIdAndDelete(id);
        if(!isDel){
            return res.status(400).json({message:'FAQ not found, may be FAQ id is invalid',status:400});
        }

        return res.status(200).json({message:'FAQ deleted successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to delete FAQ, may be FAQ-Id is invalid',status:500});
    }
};

//edit FAQ by id
exports.editFAQ=async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'FAQ id is required, please pass it in url path',status:400});
        }

        const faq=await Faq.findById(id);
        if(!faq){
            return res.status(400).json({message:'FAQ not found, may be FAQ id is invalid',status:400});
        }

        const {question,answer}=req.body;
        if(question){
            faq.question=question;
        }
        if(answer){
            faq.answer=answer;
        }

        await faq.save();
        return res.status(200).json({message:'FAQ updated successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to update FAQ, may be FAQ-Id is invalid',status:500});
    }
};

//delete catergory by id
exports.deleteCatergory=async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Catergory id is required, please pass it in url path',status:400});
        }

        const isDel=await Catergory.findByIdAndDelete(id);
        if(!isDel){
            return res.status(400).json({message:'Catergory not found, may be Catergory id is invalid',status:400});
        }

        return res.status(200).json({message:'Catergory deleted successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to delete Catergory, may be Catergory-Id is invalid',status:500});
    }
};

//edit catergory by id
exports.editCatergory=[upload.single('icon'),async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }
        if(!req.file){
            return res.status(400).json({message:'Icon is required, please upload it',status:400});
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'Catergory id is required, please pass it in url path',status:400});
        }

        const catergory=await Catergory.findById(id);
        if(!catergory){
            return res.status(400).json({message:'Catergory not found, may be Catergory id is invalid',status:400});
        }

        const {catergorytype,startcolor,endcolor}=req.body;

        //++++++++++++++++++++
        const uploadDirIndex = req.file.path.indexOf('uploads');
        const relativePath = req.file.path.substring(uploadDirIndex);

        const icon = { path: relativePath };
        //++++++++++++++++++++

        if(catergorytype){
            catergory.catergorytype=catergorytype;
        }
        if(startcolor){
            catergory.startcolor=startcolor;
        }
        if(endcolor){
            catergory.endcolor=endcolor;
        }
        if(req.file){
            catergory.catergoryicon=icon;
        }

        await catergory.save();
        return res.status(200).json({message:'Catergory updated successfully',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to update Catergory, may be Catergory-Id is invalid',status:500});
    }
}];

//get all booked services by user id
exports.fetchAllBookedServicesByUserId=async(req,res)=>{
    try {
        if (req.role !== 'Admin') {
            return res.status(401).json({ message: 'Unauthorized access you are not an admin', status: 401 });
        }

        const {id}=req.params;
        if(!id){
            return res.status(400).json({message:'User id is required, please pass it in url path',status:400});
        }

        const bookedServices=await BookedService.find({userid:id});

        let servicesDetailsWithBookedService=[];
        for(let i=0;i<bookedServices.length;i++){
            const serviceBySercieId=await Service.findById(bookedServices[i].serviceid);
            servicesDetailsWithBookedService.push({service:serviceBySercieId, bookedService:bookedServices[i]});
        }

        return res.status(200).json({bookedServices:servicesDetailsWithBookedService,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch booked services, may be user-Id is invalid',status:500});
    }
};

//generate Coupon
exports.gernerateCoupon=async(req,res)=>{
    try {
        if (req.role !== 'Admin'){
            return res.status(401).json({message:'Unauthorized access, You are not an Admin',status:401});
        }
        const {couponCode, discountPercentage, expiryDate}=req.body;
        if(!couponCode || !discountPercentage || !expiryDate){
            return res.status(400).json({message:'couponCode, discountPercentage and expiryDate is required',status:400});
        }

        const coupon=new Coupon({couponCode:couponCode, discountPercentage:discountPercentage, expiryDate:expiryDate});
        
    } catch (error) {
        
    }
};

//get Sos number
exports.getSos=async(req,res)=>{
    try {
        const sos=await Sos.findOne();
        return res.status(200).json({sos:sos,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to fetch SoS',status:500});
    }
};










