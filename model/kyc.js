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
    document:[{
        path: String,
    }],
    status:{
        type: String,
        emums: ['pending', 'completed','rejected']
    },
    submitted:{
        type: Boolean,
        default: false
    }
});

const Kyc=mongoose.model('Kyc',kycschema);
module.exports=Kyc;