const User=require('../model/user');
const Address=require('../model/address');
const Service=require('../model/service');
const Vendor=require('../model/vendor');
const Bookedservice=require('../model/bookedservice');
const bcrypt = require('bcrypt');

const SALT_ROUND=10;

//get all details of current user
exports.getAll=async (req,res)=>{
    try {
        const email=req.email;
        const currentuserdetails=await User.findOne({email:email});
        if(currentuserdetails){
            return res.status(200).send(currentuserdetails);
        }else{
            return res.status(404).send({message:"vendor not found"});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
}

//delete current user

exports.deleteuser=async (req,res)=>{
    try {
        const currentvendoremail=req.email;
        await User.deleteOne({email:currentvendoremail});
        return res.status(200).send({message:"deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: "inside catch user not deleted"});
    }
}

// update user
exports.updateuser=async(req,res)=>{
    try {
        const {name,password}=req.body;
        const currentuseremail=req.email;
        const user=await User.findOne({email:currentuseremail});

        bcrypt.hash(password, SALT_ROUND, async (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Unable to update password" });
            }

            // Update the user's password and name if provided
            user.password = hashedPassword;
            if (name) {
                user.name = name;
            }

            // Save the updated user
            await user.save();
            user.password = undefined; // Remove password from response

            return res.status(200).send({ message: "Vendor updated successfully", user });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};

//get all offered services of vendor
exports.getallservices=async(req,res)=>{
    try {
        const {catergory}=req.body;
        const listOfServices=await Service.find({catergory: catergory});
        return res.status(200).send(listOfServices);
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
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
        const userid=userbyuseremail._id;

        const newbookeservice=new Bookedservice({serviceid,userid,vendorid});
        console.log(serv._id);
        console.log(serv.vendoremail);
        await newbookeservice.save();
        return res.status(200).send(newbookeservice);
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};

//all booked services by user
exports.myorders=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        const userid=userbyuseremail._id;
        const listofallordersbyuserid=await Bookedservice.find({userid:userid});
        return res.status(200).send(listofallordersbyuserid);
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
            return res.status(400).send({message:"name variable is null"});
        }
        const userbyuseremail=await User.findOne({email:currentuseremail});
        userbyuseremail.name=name;
        await userbyuseremail.save();
        return res.status(200).send(userbyuseremail);
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};

//user home
exports.userhome=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        const userid=userbyuseremail._id;
        const addressbyuserid=await Address.find({userid:userid});
        return res.status(200).send({userbyuseremail, addressbyuserid});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
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
        const addressbyuserid=await Address.find({userid:userid});
        await newaddress.save();
        return res.status(200).send({newaddress, addressbyuserid});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};