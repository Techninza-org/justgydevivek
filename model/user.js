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
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'User'
    },
    usercreationdate:{
        type: Date
    },
    image:{
        path: String
    },
    isVerified:{
        type: Boolean,
        default: false
    }
})

const User=mongoose.model('User',userschema);
module.exports=User;