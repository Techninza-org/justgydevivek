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
    },
    quantity:{
        type: Number
    },
    paidvia:{
        type: String
    },
    servicestatus:{
        type: String
    },
    date:{
        type: Date
    },
    catergory:{
        type: String
    },
    bookedprice:{
        type: Number
    },
    addressid:{
        type: String
    },
    coinsused:{
        type: Number
    }
});

const Bookedsevice=mongoose.model('Bookedservice',bookedserviceschema);
module.exports=Bookedsevice;