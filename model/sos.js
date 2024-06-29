const mongoose=require('mongoose');

const sosSchema=new mongoose.Schema({
    number:{
        type: Number
    }
});

const Sos=mongoose.model('Sos',sosSchema);
module.exports=Sos;