const mongoose=require('mongoose');

const addresschema=new mongoose.Schema({
    houseno:{
        type: String
    },
    lineone:{
        type: String
    },
    linetwo:{
        type: String
    },
    linethree:{
        type: String
    },
    landmark:{
        type: String
    },
    pincode:{
        type: Number
    },
    userid:{
        type: String
    },
    vendorid:{
        type: String
    },
    longitude:{
        type: Number
    },
    latitude:{
        type: Number
    }
});

const Address=mongoose.model('Address',addresschema);
module.exports=Address;