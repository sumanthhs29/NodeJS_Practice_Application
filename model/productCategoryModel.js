const mongoose = require('mongoose');

const productCategorySchema = mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    description: {
        type:String,
        trim:true
    },
    image:{type:String},
    createdAt: {
        type:Date,
        default:Date.now()
    },
    modifiedAt: {
        type:Date,
        default:Date.now()
    },
    isActive: {type:Boolean,default:1}
});

module.exports = mongoose.model("productCategory",productCategorySchema);