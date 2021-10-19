const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    name: {type:String, required:true,trim: true,unique: true},
    latitude: {type:Number},
    longitude: {type:Number},
    aliasName: {type:Array}
});

module.exports = mongoose.model("locations",locationSchema);