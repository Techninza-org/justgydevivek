const Vendor=require('../model/vendor');
const Address=require('../model/address');
const User=require('../model/user');
const Service=require('../model/service');
const Rating=require('../model/rating');
const kyc=require('../model/kyc');
const Bookedservice=require('../model/bookedservice');
const Aboutus=require('../model/aboutus');
const Sos=require('../model/sos');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const Catergory=require('../model/catergory');
const { log } = require('node:console');

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
        const currentMobile=req.mobile;

        // const vendoremail=req.email;
        const {servicename, title, catergory, servicedescription, price, address, servicerange, discount}=req.body;

        const {houseno, mobile, area_street, sector_area, landmark, pincode, name, longitude, latitude, city, state, country}=req.body;

        //make object of address
        const newaddress=new Address({houseno, mobile, area_street, sector_area, landmark, pincode, name, longitude, latitude, city, state, country});

        //+++++++++++++++++++++++++++++++++++++
        if(catergory){
            const availableCatergories=await Catergory.findOne({catergorytype:catergory});
            if (!availableCatergories) {
                return res.status(400).send({message:"you cant use this type of catergory", status: 400});
            }
        }

        if(!catergory){
            return res.status(400).send({message:"catergory is required", status: 400});
        }

        //storing list of images path in images variable
        // const images = req.files?.map((file) => ({ path: file.path })); //storing complete path of image.



        //stroing relative path only of image in images variable
        const images = req.files?.map((file) => {
            // Extract the relative path from 'uploads' directory
            const uploadDirIndex = file.path.indexOf('uploads');
            const relativePath = file.path.substring(uploadDirIndex);
            return { path: relativePath };
        });

        console.log(images);

        if(!servicerange){
            return res.status(400).send({message:"please enter service range", status: 400});
        }

        const newservice=new Service({servicename, title, catergory, servicedescription, price, image: images, address:newaddress, servicerange});
        // newservice.vendoremail=vendoremail;
        newservice.vendoreMobile=currentMobile;
        console.log(newservice.vendoreMobile);

        if(discount || discount>=0 && discount<=100){
            discount=Math.round(discount);
            newservice.discount=discount;
        }

        
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
        // const vendoremail=req.email;
        const vendorMobile=req.mobile;
        console.log(vendorMobile);
        console.log(req);
        // const listofservices=await Service.find({vendoremail:vendoremail});
        const listofservices=await Service.find({vendoreMobile:vendorMobile});
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
        // const currentvendoremail=req.email;
        const currentMobile=req.mobile;
        // const vendor=await Vendor.findOne({email:currentvendoremail});
        const vendor=await Vendor.findOne({mobile:currentMobile});

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
        // const email=req.email;
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        const currentMobile=req.mobile;
        // const currentvendordetails=await Vendor.findOne({email:email});
        const currentvendordetails=await Vendor.findOne({mobile:currentMobile});

        //get price of total of all booked services havind status completed
        const vendorid=currentvendordetails._id;
        const listofallordersbyvendorid=await Bookedservice.find({vendorid:vendorid, servicestatus:"completed"});
        let totalprice=0;
        listofallordersbyvendorid.forEach((order)=>{
            totalprice+=order.price;
        });

        //total average rating of vendor by vendorid
        const listofallratings=await Rating.find({vendorid:vendorid});
        let totalrating=0;
        listofallratings.forEach((rating)=>{
            totalrating+=rating.rating;
        });
        //total number of ratings
        totalNumberOfRatings=listofallratings.length;

        //doing average of all ratings
        totalrating=totalrating/listofallratings.length;

        //get current kyc status of vendor
        const kycdetails=await kyc.findOne({vendorid:vendorid});
        let kycStatus="kyc not submitted by vendor";
        if(kycdetails){
            kycStatus=kycdetails.status;
        }

        //get total order per per month which have status completed
        const date=new Date();
        const month=date.getMonth();
        const year=date.getFullYear();
        const listofallordersbyvendoridpermonth=await Bookedservice.find({vendorid:vendorid, servicestatus:"completed"});
        let totalorderpermonth=0;
        listofallordersbyvendoridpermonth.forEach((order)=>{
            if(order.date.getMonth()===month && order.date.getFullYear()===year){
                totalorderpermonth+=1;
            }
        });



        if(currentvendordetails){
            return res.status(200).send({currentvendordetails, totalIncome:totalprice, totalrating, kycStatus, totalorderpermonth, totalNumberOfRatings,status: 200});
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
        // const currentvendoremail=req.email;
        const currentMobile=req.mobile;
        // await Vendor.deleteOne({email:currentvendoremail});
        await Vendor.deleteOne({mobile:currentMobile});
        return res.status(200).send({message:"deleted successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "inside catch user not deleted", status: 500});
    }
}

//accept order
exports.acceptorder=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
        if (!currentvendor) {
            return res.status(400).send({message:"your are not a vendor", status: 400});
        }
        const {bookedserviceid}=req.body;
        // const bookedserviceid=bookedservice._id;
        if (!bookedserviceid) {
            return res.status(400).send({message:"bookedservice's id is required", status: 400});
        }
        // const getbookedservice=await Bookedservice.findById(bookedserviceid);
        const getbookedservice=await Bookedservice.findOne({_id:bookedserviceid, vendorid:currentvendor._id});
        if (!getbookedservice) {
            return res.status(400).send({message:"bookedservice not found, may bookedservice and current vendor id not matched or id is not valid", status: 400});
        }

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
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
        if (!currentvendor) {
            return res.status(400).send({message:"your are not a vendor", status: 400});
        }
        const {bookedserviceid}=req.body;
        // const bookedserviceid=bookedservice._id;
        if (!bookedserviceid) {
            return res.status(400).send({message:"bookedserviceid variable is null", status: 400});
        }
        // const getbookedservice=await Bookedservice.findById(bookedserviceid);
        const getbookedservice=await Bookedservice.findOne({_id:bookedserviceid, vendorid:currentvendor._id});
        if (!getbookedservice) {
            return res.status(400).send({message:"bookedservice not found, may bookedservice and current vendor id not matched or id is not valid", status: 400});
        }


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
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
        const vendorid=currentvendor._id;
        // const listofallordersbyvendorid=await Bookedservice.find({vendorid:vendorid, servicestatus:"PLACED"});
        const list=await Bookedservice.find({vendorid:vendorid, servicestatus:"PLACED"});


        let listOf=[];
        //add user name and user image and service id , service name and date bookedservice status from bookedService list.
        // list.forEach( async(order)=>{
        //     console.log("aaaaaaa");
        //     console.log(order);
        //     //find name of user by userid
        //     const userid=order.userid;
        //     const user=await User.findOne({_id:userid});
        //     const username=user.name;
        //     const userimage=user.image;
        //     const serviceid=order.serviceid;
        //     const service=await Service.findOne({_id:serviceid});
        //     const servicename=service.servicename;

        //     //find address of user by addressid
        //     const addressid=order.addressid;
        //     const address=await Address.findOne({_id:addressid});
        //     listOf.push({bookedservice:order, username, userimage, servicename, address});


        //     console.log("++++++++++++++++++++++");
        //     console.log(listOf);
        // });

        // Use Promise.all to ensure all async operations are completed
        await Promise.all(list.map(async (order) => {
            const userid = order.userid;
            const user = await User.findOne({ _id: userid });
            const username = user.name;
            const userimage = user.image;

            const serviceid = order.serviceid;
            const service = await Service.findOne({ _id: serviceid });
            const servicename = service.servicename;

            const addressid = order.addressid;
            const address = await Address.findOne({ _id: addressid });

            listOf.push({ bookedservice: order, username:username, userimage:userimage, servicename:servicename, useraddress:address });
        }));
            

        return res.status(200).send({listofallordersbyvendorid: listOf, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}

//total completed orders
exports.totalorders=async(req,res)=>{
    try {
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
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
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
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
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
        const vendorid=currentvendor._id;
        // const listofallordersbyvendorid=await Bookedservice.find({vendorid:vendorid, servicestatus:"accepted"});
        const list=await Bookedservice.find({vendorid:vendorid, servicestatus:"accepted"});

        let listofallordersbyvendorid=[];

        // list.forEach( async(order)=>{
        await Promise.all(list.map( async(order)=>{
            //find name of service by serviceid
            const serviceid=order.serviceid;
            const service=await Service.findOne({_id:serviceid});
            const servicename=service.servicename;
            listofallordersbyvendorid.push({bookedservice:order,servicename, paymentStatus: "comes from payment gateway"});
        }));
        // console.log(listofallordersbyvendorid);


        return res.status(200).send({listofallordersbyvendorid, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//upadate profile photo of vendor
exports.uploadprofilephoto=[upload.single('image'), async(req,res)=>{
    try {

        //check image is uploaded or not from client side
        if (!req.file) {
            return res.status(400).send({message: "Image is required, please upload an image", status: 400});
        }


        // const vendoremail=req.email;
        const currentMobile=req.mobile;
        // const vendor=await Vendor.findOne({email:vendoremail});
        const vendor=await Vendor.findOne({mobile:currentMobile});

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // Extract the relative path from 'uploads' directory
        const uploadDirIndex = req.file.path.indexOf('uploads');//new code
        const relativePath = req.file.path.substring(uploadDirIndex);// new code
        
        // const image = { path: req.file.path }; //original code
        const image = { path: relativePath};//new code
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        //checking if files are uploaded or not
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ message: "At least one file is required", status: 400 });
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png']; // Define allowed MIME types

        // Check the type of each uploaded file
        for (let file of req.files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return res.status(400).send({ message: `File type ${file.mimetype} is not allowed, only jpeg or png files are allowed`, status: 400 });
            }
        }



        // const vendoremail=req.email;
        const currentMobile=req.mobile;
        // const vendor=await Vendor.findOne({email:vendoremail});
        const vendor=await Vendor.findOne({mobile:currentMobile});
        const vendorid=vendor._id;
        const {name, homeaddress, pincode, alternatephone, alternateemail}=req.body;

        if (!name || !homeaddress || !pincode) {
            return res.status(400).send({message: "All fields are required", status: 400});
        }

        //if kyc with same vendorid already exist then return error
        const isExistedkyc=await kyc.findOne({vendorid:vendorid});
        if (isExistedkyc) {
            return res.status(400).send({message: "kyc details already uploaded by this vendor id", status: 400});
        }


        const images = req.files?.map((file) => ({ path: file.path }));
        if (!images) {
            return res.status(400).send({message: "Images are required", status: 400});
        }
        console.log(images);

        //if kyc is already submitted then return a message
        const isSubmitted=await kyc.findOne({vendorid:vendorid});
        if (isSubmitted) {
            return res.status(400).send({message: "kyc details already submitted", status: 400});
        }



        const kycdetails=new kyc({vendorid:vendorid, document:images, name, email:vendor.email, homeaddress, pincode, alternatephone, alternateemail, status:"pending"});
        kycdetails.submitted=true;
        kycdetails.mobile=vendor.mobile;
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
        // const currentvendoremail=req.email;
        const currentMobile=req.mobile;
        // const vendor=await Vendor.findOne({email:currentvendoremail});
        const vendor=await Vendor.findOne({mobile:currentMobile});

        if(!vendor){
            return res.status(400).send({message:"vendor not found", status: 400});
        }

        if (mobile) {
            vendor.mobile = mobile;
        }
        if (email) {
            vendor.email = email;
            // const allServicesOfCurrentVendor=await Service.find({vendoremail:currentvendoremail});
            const allServicesOfCurrentVendor=await Service.find({vendoreMobile:currentMobile});
            allServicesOfCurrentVendor.forEach(async(service)=>{
                service.vendoremail=email;
                await service.save();
            });
        }

        await vendor.save();

        const token = jwt.sign({ email: vendor.email, role: vendor.role, mobile: vendor.mobile }, SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).send({message: "Mobile and email updated successfully", token, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//get kyc status of vendor
exports.getkycStatus=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
        const vendorid=currentvendor._id;
        const kycdetails=await kyc.findOne({vendorid:vendorid});
        const kycStatus=kycdetails.status;
        return res.status(200).send({kycStatus, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//update discount of service
exports.updatediscount=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        const {discount, serviceid}=req.body;
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        
        if(!discount || !serviceid){
            return res.status(400).send({message:"discount and serviceid is required", status: 400});
        }
        // const currentvendor=await Vendor.findOne({email:currentemail});
        // if (!currentvendor) {
        //     return res.status(400).send({message:"vendor not found", status: 400});
        // }
        // const service=await Service.findOne({vendoremail:currentemail, _id:serviceid});
        const service=await Service.findOne({vendoreMobile:currentMobile, _id:serviceid});
        if(!service){
            return res.status(400).send({message:"service not found", status: 400});
        }
        service.discount=discount;
        await service.save();
        return res.status(200).send({message:"discount updated successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//add address of vendor
exports.addaddress=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        const {houseno, lineone, linetwo, linethree, landmark, pincode, longitude, latitude, city, name, state, country, area_street, sector_area, mobile}=req.body;
        // const currentemail=req.email;
        const currentMobile=req.mobile;

        const {addressType}=req.body;

        if(!addressType){
            return res.status(400).send({message:"addressType is required", status: 400});
        }

        const validAddressTypes = ["Home", "Work", "Other"];
        if (addressType && !validAddressTypes.includes(addressType)) {
            return res.status(400).send({ message: "addressType should be Home, Work or Other", status: 400 });
        }

        // const vendor=await Vendor.findOne({email:currentemail});
        const vendor=await Vendor.findOne({mobile:currentMobile});
        if (!vendor) {
            return res.status(400).send({message:"vendor not found", status: 400});
        }
        const address=new Address({houseno, lineone, linetwo, linethree, landmark, pincode, longitude, latitude, vendorid:vendor._id, city:city, name:name, state:state, country:country, area_street:area_street, sector_area:sector_area, mobile:mobile});
        
        if(addressType){
            address.addressType=addressType;
        }

        await address.save();
        return res.status(200).send({message:"address added successfully", address,status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//get all address of vendor
exports.getaddress=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const vendor=await Vendor.findOne({email:currentemail});
        const vendor=await Vendor.findOne({mobile:currentMobile});
        const vendorid=vendor._id;
        const listofalladdress=await Address.find({vendorid:vendorid});
        if (listofalladdress.length===0) {
            return res.status(404).send({message:"vendor don't saved any address yet", status: 404});
        }
        return res.status(200).send({listofalladdress, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//make isActive false by service id
exports.makeinactive=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        const {serviceid}=req.body;
        const currentMobile=req.mobile;
        const vendor=await Vendor.findOne({mobile:currentMobile});
        if (!vendor) {
            return res.status(400).send({message:"vendor not found", status: 400});
        }


        const service=await Service.findOne({vendoreMobile:currentMobile, _id:serviceid});
        if (!service) {
            return res.status(400).send({message:"service not found or service id not belongs to current vendor", status: 400});
        }

        service.isActive=false;
        await service.save();
        return res.status(200).send({message:"service is now inactive", service,status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//make isActive true by service id
exports.makeactive=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        const {serviceid}=req.body;
        const currentMobile=req.mobile;
        const vendor=await Vendor.findOne({mobile:currentMobile});
        if (!vendor) {
            return res.status(400).send({message:"vendor not found", status: 400});
        }

        const service=await Service.findOne({vendoreMobile:currentMobile, _id:serviceid});
        if (!service) {
            return res.status(400).send({message:"service not found", status: 400});
        }

        service.isActive=true;
        await service.save();
        return res.status(200).send({message:"service is now active", service,status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};


//update address by address id
exports.updateaddress=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        const {addressid,houseno, landmark, pincode, longitude, latitude, city, name, state, country, area_street, mobile}=req.body;
        if(!addressid){
            return res.status(400).send({message:"addressid is required", status: 400});
        }
        const currentMobile=req.mobile;
        const vendor=await Vendor.findOne({mobile:currentMobile});
        if (!vendor) {
            return res.status(400).send({message:"vendor not found", status: 400});
        }
        const address=await Address.findOne({_id:addressid, vendorid:vendor._id});
        if (!address) {
            return res.status(400).send({message:"address not found or current address id not belongs to current vendor's id", status: 400});
        }
        if(houseno){
            address.houseno=houseno;
        }
        if(landmark){
            address.landmark=landmark;
        }
        if(pincode){
            address.pincode=pincode;
        }
        if(longitude){
            address.longitude=longitude;
        }
        if(latitude){
            address.latitude=latitude;
        }
        if(city){
            address.city=city;
        }
        if(name){
            address.name=name;
        }
        if(state){
            address.state=state;
        }
        if(country){
            address.country=country;
        }
        if(area_street){
            address.area_street=area_street;
        }
        if(mobile){
            address.mobile=mobile;
        }
        await address.save();
        return res.status(200).send({message:"address updated successfully", address,status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//get list of available catergories
exports.getcatergory=async(req,res)=>{
    try {
        const listofallcatergories=await Catergory.find({});
        return res.status(200).send({listofallcatergories, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//get all live sercvices of current vendor
exports.getliveservices=async(req,res)=>{
    try {
        if (req.role!=='Vendor') {
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }
        // const currentemail=req.email;
        const currentMobile=req.mobile;
        // const currentvendor=await Vendor.findOne({email:currentemail});
        const currentvendor=await Vendor.findOne({mobile:currentMobile});
        const vendorid=currentvendor._id;
        const listofallliveservices=await Service.find({vendoreMobile:currentMobile, isActive:true});
        return res.status(200).send({listofallliveservices, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//get about us
exports.aboutus=async(req,res)=>{
    try {
        const aboutus=await Aboutus.findOne({});
        if (!aboutus) {
            return res.status(404).send({message:"about is not created by admin", status: 404});
        }
        return res.status(200).send({aboutus, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//get sos
exports.sos=async(req,res)=>{
    try {
        const sos=await Sos.findOne({});
        if (!sos) {
            return res.status(404).send({message:"sos is not created by admin", status: 404});
        }
        return res.status(200).send({sos, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};

//delete address by address id
exports.deleteaddress=async(req,res)=>{
    try {
        if(req.role!=='Vendor'){
            return res.status(400).send({message:"you are not a vendor", status: 400});
        }

        const {addressid}=req.body;
        if(!addressid){
            return res.status(400).send({message:"addressid is required", status: 400});
        }
        const currentMobile=req.mobile;
        const vendor=await Vendor.findOne({mobile:currentMobile});
        if (!vendor) {
            return res.status(400).send({message:"vendor not found", status: 400});
        }
        const address=await Address.findOne({_id:addressid, vendorid:vendor._id});
        if (!address) {
            return res.status(400).send({message:"address not found or current address id not belongs to current vendor's id", status: 400});
        }
        await Address.deleteOne({_id:addressid});
        return res.status(200).send({message:"address deleted successfully", status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "Error occured in try block please check console to see error", status: 500});
    }
};




