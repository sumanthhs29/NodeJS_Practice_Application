const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema({
    chapterName: {type:String, required:true,trim: true},
    serialNumber: {type:Number},
    description: {type:String},
    storyId:
    {
        type:mongoose.Schema.ObjectId,
        ref:'stories'
    },
    imageUrl: {type:String},
    storyUrl: {type:String}
});

module.exports = mongoose.model("chapters",chapterSchema);
