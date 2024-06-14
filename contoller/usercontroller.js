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
        const userid=userbyuseremail._id;

        const newbookeservice=new Bookedservice({serviceid,userid,vendorid});
        console.log(serv._id);
        console.log(serv.vendoremail);
        await newbookeservice.save();
        return res.status(200).send({newbookeservice, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

//all booked services by user
exports.myorders=async(req,res)=>{
    try {
        const currentuseremail=req.email;
        const userbyuseremail=await User.findOne({email:currentuseremail});
        const userid=userbyuseremail._id;
        const listofallordersbyuserid=await Bookedservice.find({userid:userid});
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
        const newaddress=new Address({userid:userid, houseno:address.houseno, lineone:address.lineone, linetwo:address.linetwo, linethree:address.linethree, landmark:address.landmark, pincode:address.pincode});
        const addressbyuserid=await Address.find({userid:userid});
        await newaddress.save();
        return res.status(200).send({newaddress, addressbyuserid, status: 200});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:"error occured in try block please check cosole to see error", status: 500});
    }
};

// //get by catergory
// exports.getbycatergory=async(req,res)=>{
//     try {
//         const {catergory}=req.body;
//     } catch (error) {
        
//     }
// };