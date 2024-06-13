const mongoose=require('mongoose');

const ratingschema=new mongoose.Schema({
    rating:{
        type: Number
    },
    userid:{
        type: String
    },
    vendorid:{
        type: String
    }
});

const Rating=mongoose.model('Rating',ratingschema);
module.exports=Rating