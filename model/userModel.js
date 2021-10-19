const mongoose = require("mongoose");
const validator = require("validator");
const crypto=require('crypto')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  emailId: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is Invalid");
      }
    },
  },
  phoneNo: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (value.length < 10) {
        throw new Error("Please enter 10 digit valid phoneNo!");
      }
    },
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: 1,
  },
  role: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 8) {
        throw new Error(
          "Password is too short. At least 8 characters are required!."
        );
      }
    },
  },
  watchList:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'stories'
  }//Child reference (so creating a array)
  ],
  passwordResetToken: String,
  passwordResetExpires: Date,
});



//function to getForgetPasswordToken
userSchema.methods.getForgetPasswordToken=async function(){
  const user=this;
  
  //generate a random token with crypto
  const resetToken=crypto.randomBytes(32).toString('hex');

  //hash the ResetToken and update passwordResetToken
  user.passwordResetToken=crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');

  //token will expire in 10 min(change if want for longer)
  user.passwordResetExpires=Date.now()+10*60*1000;
  console.log(resetToken," ",user.passwordResetToken);

  //return unencrypted resetToken
  return resetToken;
}




module.exports = mongoose.model("users", userSchema);
