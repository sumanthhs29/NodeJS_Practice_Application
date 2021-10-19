const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
    name: {type:String, required:true,trim: true},
    dob: {type:String},
    death: {type:String},
    gender: {type:String,trim: true}
});

module.exports = mongoose.model("characters",characterSchema);