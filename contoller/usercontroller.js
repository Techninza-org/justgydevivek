const User=require('../model/user');
const Address=require('../model/address');
const Service=require('../model/service');
const bcrypt = require('bcrypt');

const SALT_ROUND=10;

//get all details of current user
exports.getAll=async (req,res)=>{
    try {
        const email=req.email;
        const currentuserdetails=await User.findOne({email:email});
        if(currentvendordetails){
            res.status(200).send(currentuserdetails);
        }else{
            res.status(404).send({message:"vendor not found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
}

//delete current vendor

exports.deleteuser=async (req,res)=>{
    try {
        const currentvendoremail=req.email;
        await User.deleteOne({email:currentvendoremail});
        res.status(200).send({message:"deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: "inside catch user not deleted"});
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

            res.status(200).send({ message: "Vendor updated successfully", user });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({message:"error occured in try block please check cosole to see error"});
    }
};