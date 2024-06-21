const mongoose=require('mongoose');

const cartschema=new mongoose.Schema({
    serviceid:{
        type: String
    },
    userid:{
        type: String
    },
    quantity:{
        type: Number
    },
    servicename:{
        type: String
    },
    servicecatergory:{
        type: String
    }
});

const Cart=mongoose.model('Cart',cartschema);
module.exports=Cart;