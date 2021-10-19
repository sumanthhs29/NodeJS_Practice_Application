const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    },
    products:[{
        productId:{
            type:mongoose.Schema.ObjectId,
            ref:'products'
        },
        quantity:{type:Number}
    }],
    orderId:{
        type:mongoose.Schema.ObjectId,
        ref:"orders"
    },
})

module.exports = mongoose.model("orderitems",orderItemSchema);