const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    description: {
        type:String,
        trim:true
    },
    price:{type:Number},
    stock:{type:Number},
    sold:{type:Number,default:0},
    image:{type:Array},
    quantity:{type:Number,default:1},
    isActive: {type:Boolean,default:1},
    categoryId:{
        type:mongoose.Schema.ObjectId,
        ref:'productCategory'
    },
    subCategoryId:{
        type:mongoose.Schema.ObjectId,
        ref:'productSubCategory'
    }
});

module.exports = mongoose.model("products",productSchema);