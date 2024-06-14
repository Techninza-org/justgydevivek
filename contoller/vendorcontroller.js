const Vendor=require('../model/vendor');
const Address=require('../model/address');
const Service=require('../model/service');
const Bookedservice=require('../model/bookedservice');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');

const SALT_ROUND=10;

//add service by vender
exports.addservicebyvendor=async(req,res)=>{
    try {
        const vendoremail=req.email;
        const {servicename, catergory, servicedescription, price, image, address}=req.body;
        console.log(req);
        const newservice=new Service({servicename, catergory, servicedescription, price, image, address});
        newservice.vendoremail=vendoremail;
        await newservice.save();
        return res.status(200).send({newservice, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

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

// update vendor
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
        return res.status(200).send({message:"order accepted", status: 200, getbookedservice});
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

//total orders
exports.totalorders=async(req,res)=>{
    try {
        const currentemail=req.email;
        const currentvendor=await Vendor.findOne({email:currentemail});
        const vendorid=currentvendor._id;
        console.log(vendorid);
        const listofallordersbyvendorid=await Bookedservice.find({vendorid:vendorid, servicestatus:"accepted"});
        return res.status(200).send({listofallordersbyvendorid, status: 200});
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
}


