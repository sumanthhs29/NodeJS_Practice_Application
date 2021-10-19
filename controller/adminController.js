const express = require("express");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const router = express.Router();
const { promisify } = require("util");
const multer = require("multer");
const userModel = require("../model/userModel");
const locationModel = require('../model/locationModel');
const characterModel = require("../model/characterModel");
const categoryModel = require("../model/categoryModel");
const storyModel = require("../model/storyModel");
const chapterModel = require("../model/chapterModel");
const htmlModel = require("../model/htmlModel");
const productCategoryModel = require("../model/productCategoryModel");
const productSubCategoryModel = require("../model/productSubCategoryModel");
const productModel = require("../model/productModel");
const orderModel = require("../model/orderModel");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


//Method to authorise admin
exports.isAuthorised = (async(req,res,next) => {
    // 1) Getting token and check if it's there
    let token,decoded;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
      return res.status(401).json({
        error:'You are not logged in! Please login to get access.'
      })
    }
    // 2) Verification token
    try {
      decoded = await promisify(jwt.verify)(token,"randomstring");
    }catch (err) {
      console.error(`Invalid token ${err}`,new Date());
      return res.status(500).json({
        status:'Invaild token'
      });
    }
    // 3) Check if user still exists
    const user = await userModel.findOne({_id:decoded._id,isActive:true,role:1},{password:0});
    if(!user){
      return res.status(401).json({
        status:'Admin no logner exists'
      });
    }
    // 4) Grant access to protected route
    req.user = user;
    next();
})

//Send email and password during login
exports.login = (req, res) => {
    userModel.findOne({ emailId: req.body.emailId,isActive:true,role:1}, function (err, user) {
        if (err || !user) {
            //Error when connecting to DB  ||  email does not exist
            return res.status(500).json({
            error: "User mail does not exist",
            });
        }
        if (user) {
            if (!bcrypt.compareSync(req.body.password, user["password"])) {
            //If user mail and password does not match
            return res.status(400).json({
                error: "Email and pwd does not match",
            });
            }
        }
        //Create token which expires in 1day(1d)
        const token = jwt.sign({ _id: user._id }, "randomstring",{expiresIn: "1d"});
    
        //put token in cookie and browser delete the cookie after 1 day automatically
        res.cookie("token", token, {
            expires: new Date(Date.now() + 1*24*60*60*1000),
            // secure:true,  //Cookie can be sent over encrypted connection
            // httpOnly:true   //Cookie cannot be accessed or midified by browser
        });
    
        //send response to frontend
        const { _id, name, emailId } = user;
        return res.json({
            token,
            user: { _id, name, emailId },
        });
    });
};

//Method to edit location
exports.editLocation = (async(req,res) => {
    let location;
    try{
        location = await locationModel.findOneAndUpdate({_id:req.params.locationId},{$set:req.body}, {
            new:true,
            useFindAndModify:false
        })
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    res.status(200).json({
        status:'success'
    })
});

//Method to edit character
exports.editCharacter = (async(req,res) => {
  let character;
  try{
      character = await characterModel.findOneAndUpdate({_id:req.params.characterId},{$set:req.body}, {
          new:true,
          useFindAndModify:false
      })
  }catch(error) {
      console.error(`Error caught: ${error.message}`);
      return res.status(500).json({
          status:'Invaild token'
      });
  }
  res.status(200).json({
      status:'success'
  })
});


//Method to edit category
exports.editCategory = (async(req,res) => {
  let category;
  try{
      category = await categoryModel.findOneAndUpdate({_id:req.params.categoryId},{$set:req.body}, {
          new:true,
          useFindAndModify:false
      })
  }catch(error) {
      console.error(`Error caught: ${error.message}`);
      return res.status(500).json({
          status:'Invaild token'
      });
  }
  res.status(200).json({
      status:'success'
  })
});


//Method to edit story
exports.editStory = (async(req,res) => {
  let story;
  try{
      story = await storyModel.findOneAndUpdate({_id:req.params.storyId},{$set:req.body}, {
          new:true,
          useFindAndModify:false
      })
  }catch(error) {
      console.error(`Error caught: ${error.message}`);
      return res.status(500).json({
          status:'Invaild token'
      });
  }
  res.status(200).json({
      status:'success'
  })
});


//Method to edit chapter
exports.editChapter = (async(req,res) => {
  let chapter;
  try{
      chapter = await chapterModel.findOneAndUpdate({_id:req.params.chapterId},{$set:req.body}, {
          new:true,
          useFindAndModify:false
      })
  }catch(error) {
      console.error(`Error caught: ${error.message}`);
      return res.status(500).json({
          status:'Invaild token'
      });
  }
  res.status(200).json({
      status:'success'
  })
});


//Method for filtering uploaded file
exports.upload = multer({
    fileFilter(req,file,cb) {
        if(!file.originalname.endsWith('.html')){
            return cb(new Error('Please upload a html file'))
        }
        cb(undefined,true);
    }
})
//Method to edit chapter html
exports.editChapterHtml = (async(req,res) => {
    let html;
    try{
        html = await htmlModel.findOneAndUpdate({chapterId:req.params.chapterId},{$set:{htmlPage:req.file.buffer}}, {
            new:true,
            useFindAndModify:false
        })
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    res.status(200).json({
        status:'success'
    })
});
//callback when upload function return error
exports.errorInChapterHtmlPage = (error,req,res,next) => {
    res.status(400).send({error:error.message})
}

//Delete chapter and it's html page
exports.deleteChapter=async(req,res)=>{
    try{
      const chapter =await chapterModel.findById(req.params.chapterId);
      const html = await htmlModel.findOneAndRemove({chapterId:req.params.chapterId})
      await chapter.remove();
      res.status(200).json({
        status:'Chapter removed Successfully!'
      })
    }catch(err){
      res.status(500).send("Error");
    }
}

//Delete story and it's chapter
exports.deleteStory=async(req,res)=>{
    let chapter,html,story;
    try{
        story = await storyModel.findById(req.params.storyId);
        console.log(story);
        // chapter = await chapterModel.findById(req.params.chapterId);
        // html = await htmlModel.findOneAndRemove({chapterId:req.params.chapterId})
        // await chapter.remove();
        res.status(200).json({
            status:'Chapter removed Successfully!'
        })
    }catch(err){
      res.status(500).send("Error");
    }
}

//Method to edit ecommerce-category
exports.editECategory = (async(req,res) => {
    let category;
    try{
        category = await productCategoryModel.findOneAndUpdate({_id:req.params.categoryId},{$set:req.body}, {
            new:true,
            useFindAndModify:false
        })
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    res.status(200).json({
        status:'success'
    })
});

//Method to edit ecommerce-subcategory
exports.editESubCategory = (async(req,res) => {
    let subCategory;
    try{
        subCategory = await productSubCategoryModel.findOneAndUpdate({_id:req.params.subcategoryId},{$set:req.body}, {
            new:true,
            useFindAndModify:false
        })
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    res.status(200).json({
        status:'success'
    })
});

//Method to edit ecommerce-product
exports.editEProduct = (async(req,res) => {
    let product;
    try{
        product = await productModel.findOneAndUpdate({_id:req.params.productId},{$set:req.body}, {
            new:true,
            useFindAndModify:false
        })
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    res.status(200).json({
        status:'success'
    })
});


//Method to edit ecommerce order
exports.editEOrder = (async(req,res) => {
    let order;
    try{
        order = await orderModel.findOneAndUpdate({_id:req.params.orderId},{$set:req.body}, {
            new:true,
            useFindAndModify:false
        })
    }catch(error) {
        console.error(`Error caught: ${error.message}`);
        return res.status(500).json({
            status:'Invaild token'
        });
    }
    res.status(200).json({
        status:'success'
    })
});
