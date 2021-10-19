const mongoose = require('mongoose');

const storyCategorySchema = mongoose.Schema({
    name: {type:String, required:true,trim: true,unique: true},
    image:{type:String},
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("storyCategory",storyCategorySchema);