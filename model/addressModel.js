const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    fullName: {
        type:String,
        trim:true
    },
    address1:{type:String,
        trim:true
    },
    city:{
        type:String,
        trim:true
    },
    state:{
        type:String,
        trim:true
    },
    postCode:{type:Number},
    phoneNo:{type:Number},
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    }
});

module.exports = mongoose.model("address",addressSchema);