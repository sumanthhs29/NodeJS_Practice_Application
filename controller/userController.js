const { promisify } = require("util");
const express = require("express");
const userSchema = require("../model/userModel");
const bodyParser = require("body-parser");
const crypto = require("crypto");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const router = express.Router();
const mongoose = require("mongoose");
const Email = require("../emails/emails");
const userModel = require("../model/userModel");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//Send login detail in the format of userModel
exports.signup = (req, res) => {
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  var users = new userModel(req.body);
  users.password = hash;

  users.save(function (err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      const { name, emailId } = users;
      //Successfully saving the user details
      res.status(200).json({
        status: "success",
        data: { name, emailId },
      });
    }
  });
};

//Checking if user is already present with given emailId
exports.checksignin = (req, res) => {
  userModel.findOne({ emailId: req.body.emailId }, function (err, result) {

    if (err) {
      //Error when connecting to DB
      res.status(500).json(err);
    }
    if (result === null) {
      //When user with given data is not present
      res.status(200).json({
        status: "notfound"
      });
    } else {
      //When user already exists
      res.status(400).json({ error: "User already exists!" });
    }
  });
};


//Send email and password during login
exports.login = (req, res) => {
  userModel.findOne({ emailId: req.body.emailId,isActive:true}, function (err, user) {
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

//forget password route
//Send emailId
exports.forgotPassword = async (req, res) => {
  //1. Get the user via email
  const user = await userModel.findOne({ emailId: req.body.emailId });
  if (user === null) {
    return res.status(400).json({ error: "User does not exists please create an account " });
  }
  else {
      //2. Generate the random reset token
    const resetToken = await user.getForgetPasswordToken();

    //3. Save the user without validation
    await user.save({ validateBeforeSave: false });

    //4. Generate the localhost resetURL and send email
    try {
      //resetURL{patch request}
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/resetPassword/${resetToken}`;
      const getResetURL=`https://pooja-archana-frontend-dot-hu18-groupa-angular.et.r.appspot.com/resetPassword/${resetToken}`;
      //send email
      await new Email(user, getResetURL).sendPasswordReset();

      //if everything alright,send response
      return res.status(200).json({
        status: "Suceess",
        message:
          "Reset link send to your email,please check your email(or check spam)!",
      });
    } catch (err) {
      //delete the resetToken
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).send({ error: "Unable to proceed" });
    }
  }
  
};

//Reset Password route
//Send password and Confirmpassword
exports.resetPassword = async (req, res) => {
  //1. Get the token and hashed it
  
  const incomingToken = req.body.token;
  const hashedToken = crypto
    .createHash("sha256")
    .update(incomingToken)
    .digest("hex");

  //2. Get user based on token{attached in mail sent to user mailId}
  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //3. If token has not expired, and there is user ,set the new password else return message
  if (!user) {
    return res.send({ error: "Token is invalid or has expired" });
  }
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  user.password = hash;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //4. Log the user in ,send the JWT back in response
  const token = await jwt.sign({ _id: user._id.toString() }, "prernapundir");
  res.status(200).json({
    status: "Success",
    token,
  });
};

//Method to sign out user
exports.signout = (req, res) => {
  res.clearCookie("token"); //clearing cookie named token which was saved during signin method
  res.json({ message: "User signout" });
};

//Method to get all user
exports.allUser = (async(req,res,next) => {
  let user;
  try{
    user = await userModel.find({},{password:0});
    if(!user){
      res.status(400).json({
        status:'not success'
      })
    }
    res.status(200).json({
      status:"success",
      data:{
          user
      }
    });
  }catch(err){
    console.error(`Error caught: ${error.message}`);
    return res.status(500).json({
      status:'Invaild token'
    });
  }
});

//Method to authenticate user
exports.isAuthenticated = (async(req,res,next) => {
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
  const user = await userModel.findOne({_id:decoded._id,isActive:true},{password:0});
  if(!user){
    return res.status(401).json({
      status:'User no logner exists'
    });
  }
  // 4) Grant access to protected route
  req.user = user;
  next();
})


exports.protectedRoute = (req,res) => {
  res.status(200).json({
    status:'protected'
  })
}


// Delete User
exports.deleteUser=async(req,res)=>{
  try{
    const user=await userSchema.findById(req.body.id);
    await user.remove();
    res.status(200).json({
      status:'User removed Successfully!'
    })
  }catch(err){
    res.status(500).send("Error");
  }
}


