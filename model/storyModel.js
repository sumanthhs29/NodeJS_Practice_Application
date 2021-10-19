const mongoose = require('mongoose');

const storySchema = mongoose.Schema({
    storyName:{
        type:String,
        required:true,
        trim: true,
        unique: true
    },
    language:{
        type:String,
        required:true,
        trim: true
    },
    startYear:{
        type:String,
        trim: true
    },
    endYear:{
        type:String,
        trim: true
    },
    views:{type:Number,default:0},
    imageUrl:{type:String},
    categoryId:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'storyCategory'
        }//Child reference (so creating a array)
    ],
    characterId:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'characters'
        }//Child reference (so creating a array)
    ],
    locationId:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'locations'
        }//Child reference (so creating a array)
    ],
    createdOn:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model("stories",storySchema);