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
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'Vendor'
    }
});

const Vendor=mongoose.model('Vendor',vendorschema);
module.exports=Vendor;