const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');
const storyRoute = require('./routes/storyRoute');
const ecommerceRoute = require('./routes/ecommerceRoute');
const quizRoutes = require('./routes/quizRoute');
const adminRoute = require('./routes/adminRoute');
const paymentRoute = require('./routes/paymentRoute');
var cors = require('cors')
require('dotenv').config();


const app = express();
 

//DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }).then(() =>{
      console.log("DB CONNECTED");
  }).catch(()=>{
    console.log("Error in DB CONNECTION")
});


//MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())


//My Routes
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Pooja Archana application"});
});

app.use('/user',userRoutes);

app.use('/story',storyRoute);

app.use('/ecommerce',ecommerceRoute);

app.use('/quiz',quizRoutes);

app.use('/admin',adminRoute);

app.use('/order',paymentRoute);


//Exporting app
module.exports = app;
