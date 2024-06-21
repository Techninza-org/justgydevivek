const mongoose=require('mongoose');

const wishlistschema=new mongoose.Schema({

    serviceid:{
        type: String
    },
    userid:{
        type: String
    },
    servicename:{
        type: String
    }
});