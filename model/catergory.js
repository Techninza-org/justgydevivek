const mongoose=require('mongoose');

const categoryschema=new mongoose.Schema({
    catergorytype:{
        type: String,
    },
    catergoryicon:{
        path: String
    },
    startcolor:{
        type: String
    },
    endcolor:{
        type: String
    }
});

const Catergory=mongoose.model('Catergory',categoryschema);
module.exports=Catergory;