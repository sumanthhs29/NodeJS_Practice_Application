const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    addedOn:{
        type:Date,
        default:Date.now()
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    },
    productId:[{
        type:mongoose.Schema.ObjectId,
        ref:'products'
    }]
})

module.exports = mongoose.model("carts",cartSchema);