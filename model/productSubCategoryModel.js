const mongoose = require('mongoose');

const productSubCategorySchema = mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    description: {
        type:String,
        trim:true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
    modifiedAt: {
        type:Date,
        default:Date.now()
    },
    isActive: {type:Boolean,default:1},
    categoryId:{
        type:mongoose.Schema.ObjectId,
        ref:'productCategory'
    }
});

module.exports = mongoose.model("productSubCategory",productSubCategorySchema);