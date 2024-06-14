const Vendor=require('../model/vendor');
const Address=require('../model/address');
const Service=require('../model/service');
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
        res.status(200).send(newservice);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};

//get all service of vendor
exports.allservices=async(req,res)=>{
    try {
        const vendoremail=req.email;
        const listofservices=await Service.find({vendoremail:vendoremail});
        res.status(200).send(listofservices);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error occured in try block please check cosole to see error"})
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
                return res.status(500).send({ message: "Unable to update password" });
            }

            // Update the vendor's password and name if provided
            vendor.password = hashedPassword;
            if (name) {
                vendor.name = name;
            }

            // Save the updated vendor
            await vendor.save();
            vendor.password = undefined; // Remove password from response

            res.status(200).send({ message: "Vendor updated successfully", vendor });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};

//get all details of current vendor
exports.getAll=async (req,res)=>{
    try {
        const email=req.email;
        const currentvendordetails=await Vendor.findOne({email:email});
        if(currentvendordetails){
            res.status(200).send(currentvendordetails);
        }else{
            res.status(404).send({message:"vendor not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
}


//delete current vendor
exports.deletevendor=async (req,res)=>{
    try {
        const currentvendoremail=req.email;
        await Vendor.deleteOne({email:currentvendoremail});
        res.status(200).send({message:"deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "inside catch user not deleted"});
    }
}


