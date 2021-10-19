const express = require('express');
const Razorpay = require('razorpay');

const router = express.Router();

var instance = new Razorpay({
    key_id: 'rzp_test_uha25P6y8lg3rE',
    key_secret: 'EQ4Lmofud5NxW2nekSDbU0dC',
})


router.post("/",async (req, res) => {
    var options = {
      amount: req.body.amount * 100,  
      currency: "INR",
      receipt: "randomstring",
      payment_capture:1
    };
    try{
      const response = await instance.orders.create(options);
      res.json({
          id:response.id,
          currency:response.currency,
          amount:response.amount
      })
    }catch(error){
        console.error('err: ',error);
    }
})

module.exports = router;