const Otpschema=require('../model/otpschema.js');
const crypto=require('crypto');
const Vendor=require('../model/vendor');
const User=require('../model/user');

const {sendEmailOtp}=require('../utils/emailservice');
const { stat } = require('fs');



//vendor gerate otp
exports.generateotp=async(req,res)=>{
    try {
        const currentemail=req.email;
        const otp=crypto.randomInt(1000,9999).toString();
        const otptoken=new Otpschema({email:currentemail,otpToken:otp});
        await otptoken.save();
        await sendEmailOtp(currentemail,otp);
        return res.status(200).json({message:'OTP sent to your email',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to generate OTP',status:500});
    }
};


//vendor verify otp
exports.verifyotp=async(req,res)=>{
    try {
        const {otp}=req.body;
        const currentemail=req.email;
        const otpdata=await Otpschema.findOne({email:currentemail, otpToken:otp});
        console.log("++++++++++++++++++++++++++++++++++++++");
        console.log(otpdata);
        if(!otpdata){
            return res.status(400).json({message:'Invalid OTP',status:400});
        }
        const vendor=await Vendor.findOne({email:currentemail});
        vendor.isVerified=true;
        await vendor.save();

        //deleting all otps of this email after verifying email with otp
        await Otpschema.deleteMany({email:currentemail});
        res.status(200).json({message:'OTP verified',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to verify OTP',status:500});
    }
};


//vendor resend otp
exports.resendotp=async(req,res)=>{
    try {
        const currentemail=req.email;
        if(!currentemail){
            return res.status(400).json({message:'Email is missing',status:400});
        }

        //deleting all otps of this email
        await Otpschema.deleteMany({email:currentemail});

        const otp=crypto.randomInt(1000,9999).toString();

        //creating new otp after deleting all previous otps of this email
        const otptoken=new Otpschema({email:currentemail,otpToken:otp});
        await otptoken.save();
        await sendEmailOtp(currentemail,otp);
        return res.status(200).json({message:'OTP sent to your email',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to generate OTP',status:500});
    }
};

//============================================================================================

//user gerate otp
exports.generateuserotp=async(req,res)=>{
    try {
        const currentemail=req.email;
        const otp=crypto.randomInt(1000,9999).toString();
        const otptoken=new Otpschema({email:currentemail,otpToken:otp});
        await otptoken.save();
        await sendEmailOtp(currentemail,otp);
        return res.status(200).json({message:'OTP sent to your email',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to generate OTP',status:500});
    }
};


//user verify otp
exports.verifyuserotp=async(req,res)=>{
    try {
        const {otp}=req.body;
        const currentemail=req.email;
        const otpdata=await Otpschema.findOne({email:currentemail, otpToken:otp});
        if(!otpdata){
            console.log(otpdata);
            return res.status(400).json({message:'Invalid OTP',status:400});
        }
        const user=await User.findOne({email:currentemail});
        user.isVerified=true;
        await user.save();

        //deleting all otps of this email after verifying email with otp
        await Otpschema.deleteMany({email:currentemail});
        res.status(200).json({message:'OTP verified',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to verify OTP',status:500});
    }
};


//user resend otp
exports.resenduserotp=async(req,res)=>{
    try {
        const currentemail=req.email;
        if(!currentemail){
            return res.status(400).json({message:'Email is missing',status:400});
        }

        //deleting all otps of this email
        await Otpschema.deleteMany({email:currentemail});

        const otp=crypto.randomInt(1000,9999).toString();

        //creating new otp after deleting all previous otps of this email
        const otptoken=new Otpschema({email:currentemail,otpToken:otp});
        await otptoken.save();
        await sendEmailOtp(currentemail,otp);
        return res.status(200).json({message:'OTP sent to your email',status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Unable to generate OTP',status:500});
    }
};