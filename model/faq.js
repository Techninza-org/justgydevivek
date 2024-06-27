const mongoose=require('mongoose');

const faqschema=new mongoose.Schema({
    question:{
        type: String
    },
    answer:{
        type: String
    }
});

const Faq=mongoose.model('Faq',faqschema);
module.exports=Faq;