const mongoose=require('mongoose');

const userschema=new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type:String,
        unique: true,
        required: true
    },
    mobile:{
        type: Number,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'User'
    },
})

const User=mongoose.model('User',userschema);
module.exports=User;