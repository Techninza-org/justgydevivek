const mongoose=require('mongoose');

const wishlistschema=new mongoose.Schema({

    serviceid:{
        type: String
    },
    userid:{
        type: String
    },
    servicecatergory:{
        type: String
    },
    serviceprice:{
        type: Number
    }
});

const Wishlist=mongoose.model('Wishlist',wishlistschema);
module.exports=Wishlist;