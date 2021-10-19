const mongoose = require('mongoose');

const storyReviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:[true, 'Review cannot be empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    chapterId:{
        type:mongoose.Schema.ObjectId,
        ref:'chapters'
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    }
});

// storyReviewSchema.pre(/^find/,function(next) {
//     this.populate({

//     })
//     next();
// })
module.exports = mongoose.model("storyReview",storyReviewSchema);