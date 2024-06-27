const mongoose=require('mongoose');

const addresschema=new mongoose.Schema({
    houseno:{
        type: String
    },
    name:{
        type: String
    },
    mobile:{
        type: Number
    },
    city:{
        type: String
    },
    state:{
        type: String
    },
    country:{
        type: String
    },
    area_street:{
        type: String
    },
    sector_area:{
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