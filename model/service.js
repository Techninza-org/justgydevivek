const mongoose=require('mongoose');
const Address=require('./address');

const serviceschema=new mongoose.Schema({
    servicename:{
        type: String
    },
    title:{
        type: String
    },
    catergory:{
        type: String,
        enums: ['Medical', 'Security', 'Education', 'Finance', 'Marriage kutumb', 'Entertainment', 'FMCG','Services','Donations'],
    },
    servicedescription:{
        type: String
    },
    price:{
        type: Number
    },
    image:[{
        path: String
    }],
    vendoremail:{
        type: String
    },
    vendoreMobile:{
        type: Number
    },
    address:{
        type: Address.schema
    },
    servicerange:{
        type: Number
    },
    discount:{
        type: Number,
        default: 0
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Service=mongoose.model('Service',serviceschema);
module.exports=Service;