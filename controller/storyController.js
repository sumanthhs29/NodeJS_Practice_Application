const characterModel = require('../model/characterModel');
const categoryModel = require('../model/categoryModel');
const locationModel = require('../model/locationModel');
const chapterModel = require('../model/chapterModel');
const storyModel = require('../model/storyModel');
const { Mongoose } = require('mongoose');
const userModel = require('../model/userModel');
const reviewModel = require('../model/storyReviewModel');
const htmlModel = require('../model/htmlModel');
const multer = require("multer");


//Method to store character
exports.addCharacter = (async(req,res) =>{
    let findCharacter;
    try{
        findCharacter = await characterModel.findOne({name:req.body.name});
    }catch(err) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
          });
    }
    if(!findCharacter){
        const character = new characterModel(req.body);
        character.save((err,result) =>{
            if(err){
                console.error(`Error in saving character ${req.body.name}`,new Date());
                res.status(500).send({
                    err:"Not able to save character in DB"
                });
            }else{
                console.log(`Character saved successfully ${req.body.name}`,new Date());
                res.status(200).json({
                    status:"success",
                    data:result
                })
            }
        })
    }else{
        res.status(400).json({
            status:'Character already exists'
        })
    }
});

//method to store location
exports.addLocation = (async(req,res) =>{
    let findLocation;
    try{
        findLocation = await locationModel.findOne({name:req.body.name});
    }catch(err) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
          });
    }
    if(!findLocation){
        const location = new locationModel(req.body);
        location.save((err,result) =>{
            if(err){
                console.error(`Error in saving location = ${req.body.name}`,new Date());
                res.status(500).send({
                    err:"Not able to save location in DB"
                });
            }else{
                console.log(`Location saved successfully ${req.body.name}`,new Date());
                res.status(200).json({
                    status:"success",
                    data:result
                })
            }
        })
    }else{
        console.log(`Location already exists ${req.body.name}`,new Date());
        res.status(400).json({
            status:'Location already exists'
        })
    }
});


//method to store category
exports.addCategory = (req,res) =>{
    const category = new categoryModel(req.body);
    category.save((err,result) =>{
        if(err){
            console.error(`Error in storying catrgory ${req.body.name}`,new Date());
            return res.status(500).send({
                err:"Not able to save category in DB"
            });
        }else{
            res.status(200).json({
                status:"success",
                name:result.name,
                image:result.image
            })
        }
    })
}

//method to store story
exports.addStory = (req,res) => {
    const story = new storyModel(req.body);
    story.save((err,result) =>{
        if(err){
            console.error(`Error in saving story ${req.body.storyName}`,new Date());
            return res.status(500).send({
                err:"Not able to save chapter in DB"
            });
        }else{
            res.status(200).json({
                status:"success",
                data:result
            })
        }
    })
};

//method to store chapter
exports.addChapter = (req,res) =>{
    const chapter = new chapterModel(req.body);
    chapter.save((err,result) =>{
        if(err){
            console.error(`Error in saving chapter ${req.body.chapterName}`,new Date());
            return res.status(500).send({
                err:"Not able to save chapter in DB"
            });
        }else{
            res.status(200).json({
                status:"success",
                data:result
            })
        }
    })
}

//Method for filtering uploaded file
exports.upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.endsWith('.html')){
            return cb(new Error('Please upload a html file'))
        }
        cb(undefined,true);
    }
})
//method to store html page when filter is success
exports.addChapterHtmlPage = async(req,res) => { 
    let ifHtmlExist; 
    const html = new htmlModel({
        htmlPage:req.file.buffer,
        chapterId:req.params.chapterId
    });
    try{
        ifHtmlExist =  await htmlModel.findOne({chapterId:req.params.chapterId})
    }catch(error){
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    if(!ifHtmlExist){
        html.save((err,result) =>{
            if(err){
                console.error(`Error in storying catrgory`,new Date());
                return res.status(500).send({
                    err:"Not able to save category in DB"
                });
            }else{
                return res.status(200).json({
                    status:"success"
                })
            }
        })
    }
    else{
        console.error(`Html file for chapter already exists ${req.params.chapterId} `,new Date());
        return res.status(400).send({
            status:'not success'
        })
    }
    
}
//callback when upload function return error
exports.errorInChapterHtmlPage = (error,req,res,next) => {
    res.status(400).send({error:error.message})
}

//Get methods
//method to fetch all character
exports.getCharacter = (async(req,res,next) => {
    try{
        const character = await characterModel.find({},{name:1,_id:1})
        if(!character) {
            return res.status(400).json({
                status:'not success'
            })
        }
        res.status(200).json({
            status:"success",
            data: character
        });
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});

//method to fetch all location
exports.getLocation = (async(req,res,next) => {
    try{
        const location = await locationModel.find({},{name:1,aliasName:1,_id:1})
        if(!location.length) {
            return res.status(400).json({
                status:'not success'
            })
        }
        res.status(200).json({
            status:"success",
            data: location
        });
    }catch(error){
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});


//method to fetch all language
exports.getLanguage = (async(req,res,next) => {
    try{
        const storyLanguage = await storyModel.distinct("language");
        if(!storyLanguage) {
            return res.status(400).json({
                status:'not success'
            })
        }
        res.status(200).json({
            status:"success",
            data: storyLanguage
        });
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});

//method to fetch all category
exports.getCategory = (async(req,res,next) => {
    try{
        const category = await categoryModel.find({},{name:1,image:1,_id:1})
        if(!category) {
            return res.status(400).json({
                status:'not success'
            })
        }
        res.status(200).json({
            status:"success",
            data:{
                category
            }
        });
    }catch(error){
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});

//method to fetch all story
exports.getStory = (async(req,res,next) => {
    let story;
    try{
        if(req.query.language != undefined){
            story = await storyModel.find({language:req.query.language},{__v:0,startYear:0,endYear:0,categoryId:0,locationId:0,characterId:0})
        }
        else if(req.query.categoryId != undefined){
            story = await storyModel.find({categoryId:req.query.categoryId},{__v:0,startYear:0,endYear:0,categoryId:0,locationId:0,characterId:0})
        }
        else{
            story = await storyModel.find({},{__v:0,startYear:0,endYear:0,categoryId:0,locationId:0,characterId:0})
        }
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    if(!story.length) {
        return res.status(400).json({
            status:'not success'
        })
    }
    res.status(200).json({
        status:"success",
        data:{
            story
        }
    });
    next();
});

//method to fetch all chapter
exports.getChapter =  (async(req,res,next) => {
    try{
        const chapter = await chapterModel.find({},{__v:0,storyId:0});
        if(!chapter.length) {
            return res.status(400).json({
                status:'not success'
            })
        }
        res.status(200).json({
            status:"success",
            data:{
                chapter
            }
        });
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});

//method to fetch all chapter by story id
exports.getChapterByStoryId =  (async(req,res,next) => {
    try{
        const chapter = await chapterModel.find({storyId:req.params.storyId},{__v:0,storyId:0})
        if(!chapter.length) {
            return res.status(500).send({
                error:'not success'
            })
        }
        res.status(200).json({
            status:"success",
            data:{
                chapter
            }
        });
    }catch(error){
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});

//method to fetch chapter html page
exports.getChapterHtmlPage = async(req,res) => {
    try{
        const html = await htmlModel.findOne({chapterId:req.params.chapterId})
        if(!html){
            return res.status(400).json({
                status:'not success'
            })
        }
        res.set('Content-Type','text/html; charset=UTF-8')
        res.send(html.htmlPage)
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
}

//method to increase the views of a story given by id
exports.incrementViewsOfStory = (async(req,res) =>{
    if(req.query.emailId != undefined){
        try{
            await userModel.updateOne({emailId:req.query.emailId},{$addToSet: {watchList:req.params.storyId}});
        }
        catch (err) {
            console.error(`Error in updating watchlist of user whose emailId = ${req.query.mailId}`,new Date());
            return res.status(500).json(err);
        }
        console.log(`added story ${req.params.storyId} to watchlist of ${req.query.emailId}`)
    }
    try{
        await storyModel.updateOne({_id:req.params.storyId},{$inc: {views: 1}});
    }
    catch (err) {
        console.error(`Error in updating views of story with id = ${req.params.storyId}`,new Date());
        return res.status(500).json(err);
    }
    res.status(200).json({
        status:"success"
    })
});

//method for search query
exports.search = (async(req,res,next) => {
    let story;
    try{
        if(req.query.name != undefined){
            //Checking if search is based on character
            const character = await characterModel.findOne({name: req.query.name},{name:1,_id:1})
            if(!character){
                //Checking if search is based on location
                const location = await locationModel.findOne({$or: [{name: req.query.name},{aliasName:req.query.location}]},{name:1,_id:1})
                if(!location){
                    console.error(`Not able to find any stories for search = ${req.query.name}`,new Date());
                    return res.status(400).json({
                        status:'not success'
                    })
                }
                //Search is based in location and looking for stories in which happened in that location
                story = await storyModel.find({locationId:location._id},{locationId:0,characterId:0});
            }
            //Search is based in character and looking for stories in which the character is present
            else{
                story = await storyModel.find({characterId:character._id},{locationId:0,characterId:0});
            }
        }
        //Search is invalid
        else{
            return res.status(400).json({
                status:'not success'
            })
        }
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    //Returing sucessful story fetched
    console.log(`Found story for search = ${req.query.name}`,new Date());
    res.status(200).send({
        status:'success',
        data:story
    })
    next();
});

//method for fetching popular 5 story
exports.popular = (async(req,res,next) => {
    let story;
    try{
        story = await storyModel
        .find({views: {$gt:0}},{__v:0,startYear:0,endYear:0,locationId:0,categoryId:0,characterId:0,locationId:0})
        .sort({views:-1}).limit(5);
        if(!story.length){
            console.error("Not able to get popular stories",new Date());
            return res.status(500).send({
                error:'not success'
            })
        }
        res.status(200).send({
            status:'success',
            data:story
        })
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});

//method for fetching 5 recently added story
exports.recent = (async(req,res,next) => {
    let story;
    try{
        story = await storyModel
        .find({},{__v:0,startYear:0,endYear:0,locationId:0,categoryId:0,characterId:0,locationId:0})
        .sort({createdOn:-1}).limit(5);
        if(!story.length){
            console.error("Not able to get recently added stories",new Date());
            return res.status(500).send({
                error:'not success'
            })
        }
        res.status(200).send({
            status:'success',
            data:story
        })
    }catch(error){
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    next();
});

//method for fetching 5 story from watchlist
exports.watchlist = (async(req,res) => {
    try{
        const user = await userModel.findOne({emailId:req.query.emailId},{watchList: {$slice: -5}})
        .populate({
            path:'watchList',
            select:'storyName language views imageUrl'
        })
        .limit(5);
        if(!user){
            return res.status(500).send({
                error:'not success'
            })
        }
        res.status(200).send({
            status:'success',
            data:user.watchList.reverse()
        })
    }catch(error){
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
});

//method for fetching 5 you-may-also-like stories
exports.youMayLike = (async(req,res) => {
    let i,j,index,story,user;
    try{
        user = await userModel.findOne({emailId:req.query.emailId},{watchList:1})
        .populate({
            path:'watchList',
            select:'categoryId'
        });
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    //No watchlist is present for the user
    if(!user.watchList.length){
        return res.status(500).send({
            error:'not success'
        })
    }
    const watchListLength = user.watchList.length;
    try{
        story = await storyModel.find({categoryId:user.watchList[watchListLength-1].categoryId},{storyName:1,_id:1,imageUrl:1});
    }catch(error){
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    for(i=0;i<watchListLength;i++) {
        for(j=0;j<story.length;j++){
            index = -1;
            if(story[j]._id.equals(user.watchList[i]._id)){
                index = j;
                break;
            }
        }
        //Removing already watched story
        if(index > -1 ){
            story.splice(index,1);
        }
    }
    //All stories of recently watched story category are in watchlist
    if(!story.length) {
        return res.status(500).send({
            error:'not success'
        })
    }
    res.status(200).send({
        status:'success',
        data:story
    })
});
