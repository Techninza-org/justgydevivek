const mongoose=require('mongoose');

const couponschema=new mongoose.Schema({
    couponCode:{
        type: String
    },
    discountPercentage:{
        type: Number,
        default: 0
    },
    couponExpiryDate:{
        type: Date
    },
    couponStatus:{
        type: String,
        enum: ['EXPIRED', 'CLAIMED', 'NOTCLAIMED'], 
    },
    isActive:{
        type: Boolean,
        default: true
    },
    usedBy:{
        type: String
    }
});

const Coupon=mongoose.model('Coupon',couponschema);
module.exports=Coupon;