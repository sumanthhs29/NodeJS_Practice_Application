const mongoose = require('mongoose');

const htmlSchema = mongoose.Schema({
    htmlPage:{
        type:Buffer
    },
    chapterId:{
        type:mongoose.Schema.ObjectId,
        ref:'chapters'
    }
});

module.exports = mongoose.model("htmlPages",htmlSchema);