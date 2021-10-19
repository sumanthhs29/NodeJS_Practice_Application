const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    totalAmount:{type:Number},
    createdOn:{
        type:Date,
        default:Date.now()
    },
    status:{type:String,default:'Ordered'},
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    },
    addressId:{
        type:mongoose.Schema.ObjectId,
        ref:'address'
    },
    paymentId:{type:String}
})

module.exports = mongoose.model("orders",orderSchema);