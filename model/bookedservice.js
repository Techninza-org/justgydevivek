const mongoose=require('mongoose');
const Service=require('./service');

const bookedserviceschema=new mongoose.Schema({
    serviceid:{
        type: String
    },
    userid:{
        type: String
    },
    vendorid:{
        type: String
    }
});

const Bookedsevice=mongoose.model('Bookedservice',bookedserviceschema);
module.exports=Bookedsevice;