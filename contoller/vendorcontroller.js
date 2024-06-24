const Vendor=require('../model/vendor');
const Address=require('../model/address');
const Service=require('../model/service');
const Rating=require('../model/rating');
const kyc=require('../model/kyc');
const Bookedservice=require('../model/bookedservice');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const Catergory=require('../model/catergory');

const SALT_ROUND=10;
const SECRET_KEY = 'aaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccccccccccccc';



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



//add service by vender
exports.addservicebyvendor=[upload.array('images', 10), async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        const vendoremail=req.email;
        const {servicename, title, catergory, servicedescription, price, address, servicerange}=req.body;

        //+++++++++++++++++++++++++++++++++++++
        if(catergory){
            const availableCatergories=await Catergory.findOne({catergorytype:catergory});
            if (!availableCatergories) {
                return res.status(400).send({message:"you cant create this type of catergory", status: 400});
            }
        }
        //+++++++++++++++++++++++++++++++++++++

        if(!catergory){
            return res.status(400).send({message:"catergory is required", status: 400});
        }

        //storing list of images path in images variable
        const images = req.files?.map((file) => ({ path: file.path }));

        console.log(images);

        if(!servicerange){
            return res.status(400).send({message:"please enter service range", status: 400});
        }

        const newservice=new Service({servicename, title, catergory, servicedescription, price, image: images, address, servicerange});
        newservice.vendoremail=vendoremail;
        
        //newservice.vendoreid=vendorid;

        await newservice.save();
        return res.status(200).send({newservice, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}];

//get all service of vendor
exports.allservices=async(req,res)=>{
    try {
        const vendoremail=req.email;
        const listofservices=await Service.find({vendoremail:vendoremail});
        return res.status(200).send({listofservices, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500})
    }
};

// update vendor name and password
exports.updatevendor=async(req,res)=>{
    try {
        const {name,password}=req.body;
        const currentvendoremail=req.email;
        const vendor=await Vendor.findOne({email:currentvendoremail});

        bcrypt.hash(password, SALT_ROUND, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Unable to update password", status: 500});
            }

            // Update the vendor's password and name if provided
            vendor.password = hashedPassword;
            if (name) {
                vendor.name = name;
            }

            // Save the updated vendor
            await vendor.save();
            vendor.password = undefined; // Remove password from response

            return res.status(200).send({ message: "Vendor updated successfully", vendor, status: 200});
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//get all details of current vendor
exports.getAll=async (req,res)=>{
    try {
        const email=req.email;
        const currentvendordetails=await Vendor.findOne({email:email});
        if(currentvendordetails){
            return res.status(200).send(currentvendordetails);
        }else{
            return res.status(404).send({message:"vendor not found", status: 404});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}


//delete current vendor
exports.deletevendor=async (req,res)=>{
    try {
        const currentvendoremail=req.email;
        await Vendor.deleteOne({email:currentvendoremail});
        return res.status(200).send({message:"deleted successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "inside catch user not deleted", status: 500});
    }
}

//accept order
exports.acceptorder=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        if (!currentvendor) {
            return res.status(400).send({message:"your are not a vendor", status: 400});
        }
        const bookedservice=req.body;
        const bookedserviceid=bookedservice._id;
        if (!bookedserviceid) {
            return res.status(400).send({message:"bookedserviceid variable is null", status: 400});
        }
        const getbookedservice=await Bookedservice.findById(bookedserviceid);
        getbookedservice.servicestatus='accepted';
        await getbookedservice.save();
        return res.status(200).send({message:"order accepted", status: 200, getbookedservice});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//reject order
exports.rejectorder=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        if (!currentvendor) {
            return res.status(400).send({message:"your are not a vendor", status: 400});
        }
        const bookedservice=req.body;
        const bookedserviceid=bookedservice._id;
        if (!bookedserviceid) {
            return res.status(400).send({message:"bookedserviceid variable is null", status: 400});
        }
        const getbookedservice=await Bookedservice.findById(bookedserviceid);
        getbookedservice.servicestatus='rejected';
        await getbookedservice.save();
        return res.status(200).send({message:"order successfully rejected", status: 200, getbookedservice});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//order requests
exports.orderrequests=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        const vendorid=currentvendor._id;
        const listofallordersbyvendorid=await Bookedservice.find({vendorid:vendorid, servicestatus:"payment is done waiting for vendor to accept the service"});
        return res.status(200).send({listofallordersbyvendorid, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}

//total completed orders
exports.totalorders=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        const vendorid=currentvendor._id;
        console.log(vendorid);
        const listofallordersbyvendorid=await Bookedservice.find({vendorid:vendorid, servicestatus:"completed"});
        return res.status(200).send({listofallordersbyvendorid, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}

//get all ratings of vendor
exports.getallratings=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        const vendorid=currentvendor._id;
        const listofallratings=await Rating.find({vendorid:vendorid});
        return res.status(200).send({listofallratings, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}

//booked service completed
exports.completed=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        if (!currentvendor) {
            return res.status(400).send({message:"your are not a vendor", status: 400});
        }
        const bookedservice=req.body;
        const bookedserviceid=bookedservice._id;
        if (!bookedserviceid) {
            return res.status(400).send({message:"bookedserviceid variable is null please pass the object of bookedservice", status: 400});
        }
        const getbookedservice=await Bookedservice.findById(bookedserviceid);
        getbookedservice.servicestatus='completed';
        await getbookedservice.save();
        return res.status(200).send({message:"order completed", status: 200, getbookedservice});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//get all live orders
exports.liveOrders=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        const vendorid=currentvendor._id;
        const listofallordersbyvendorid=await Bookedservice.find({vendorid:vendorid, servicestatus:"accepted"});
        return res.status(200).send({listofallordersbyvendorid, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//upadate profile photo of vendor
exports.uploadprofilephoto=[upload.single('image'), async(req,res)=>{
    try {
        const vendoremail=req.email;
        const vendor=await Vendor.findOne({email:vendoremail});
        
        const image = { path: req.file.path };

        if (!image) {
            return res.status(400).send({message: "Image is required", status: 400});
        }
        vendor.image = image;
        await vendor.save();
        return res.status(200).send({message: "Profile photo uploaded successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
}];

//upload kyc details and documents of vendor
exports.kyc=[upload.array('images', 10), async(req,res)=>{
    try {
        const vendoremail=req.email;
        const vendor=await Vendor.findOne({email:vendoremail});
        const vendorid=vendor._id;
        const {name, homeaddress, pincode, alternatephone, alternateemail}=req.body;

        if (!name || !homeaddress || !pincode) {
            return res.status(400).send({message: "All fields are required", status: 400});
        }
        const images = req.files?.map((file) => ({ path: file.path }));
        if (!images) {
            return res.status(400).send({message: "Images are required", status: 400});
        }
        console.log(images);
        const kycdetails=new kyc({vendorid:vendorid, document:images, name, email:vendoremail, homeaddress, pincode, alternatephone, alternateemail, status:"pending"});
        kycdetails.submitted=true;
        await kycdetails.save();
        return res.status(200).send({message: "kyc details uploaded successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
}];

//update vendor moblile and email
exports.updatemobileemail=async(req,res)=>{
    try {
        const {mobile,email}=req.body;
        const currentvendoremail=req.email;
        const vendor=await Vendor.findOne({email:currentvendoremail});

        if(!vendor){
            return res.status(400).send({message:"vendor not found", status: 400});
        }

        if (mobile) {
            vendor.mobile = mobile;
        }
        if (email) {
            vendor.email = email;
            const allServicesOfCurrentVendor=await Service.find({vendoremail:currentvendoremail});
            allServicesOfCurrentVendor.forEach(async(service)=>{
                service.vendoremail=email;
                await service.save();
            });
        }

        await vendor.save();

        const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).send({message: "Mobile and email updated successfully", token, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//get kyc status of vendor
exports.getkyc=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        const vendorid=currentvendor._id;
        const kycdetails=await kyc.findOne({vendorid:vendorid});
        const kycStatus=kycdetails.status;
        return res.status(200).send({kycStatus, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};





