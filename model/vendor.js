const mongoose=require('mongoose');

const vendorschema=new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    mobile:{
        type: Number,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'Vendor'
    },
    image:{
        path: String
    },
    vendorcreationdate:{
        type: Date
    },
    isVerified:{
        type: Boolean,
        default: false
    }
});

const Vendor=mongoose.model('Vendor',vendorschema);
module.exports=Vendor;