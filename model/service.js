const mongoose=require('mongoose');
const Address=require('./address');

const serviceschema=new mongoose.Schema({
    servicename:{
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
    image:{
        type: String
    },
    vendoremail:{
        type: String
    },
    address:{
        type: Address.schema
    }
});

const Service=mongoose.model('Service',serviceschema);
module.exports=Service;