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
    },
    serviceprice:{
        type: Number
    }
});

const Cart=mongoose.model('Cart',cartschema);
module.exports=Cart;