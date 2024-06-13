const mongoose=require('mongoose');

const kycschema=new mongoose.Schema({
    vendorid:{
        type: String
    },
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    homeaddress:{
        type: String,
    },
    pincode:{
        type: Number,
    },
    alternatephone:{
        type:Number
    },
    alternateemail:{
        type: String
    },
    document:{
        type: String,
    },
    status:{
        type: String,
        emums: ['pending', 'completed','rejected']
    },
    submitted:{
        type: Boolean,
        default: false
    }
})