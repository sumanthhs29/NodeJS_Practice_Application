const supertest = require('supertest')
const jwt =  require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require('../app')
const user = require('../model/userModel')
const saltRounds = 10;

const userOneId = new mongoose.Types.ObjectId()

const encpass = bcrypt.hashSync("12345678", saltRounds);
const userOne = {
    _id:userOneId,
    name:"dummy6",
    emailId:"dummy6@gmail.com",
    phoneNo:1351080621,
    gender:"Male",
    dob:"29-10-1999",
    password:encpass
}
const loginToken = jwt.sign({ _id: userOne._id }, "randomstring",{expiresIn: "5m"});

beforeEach(async () => {
    jest.setTimeout(30000);
    await user.deleteMany()
    await new user(userOne).save()
})

test('Test cases for user controller',() =>{

})


//Test case for user signup
test('Should signup new user',async() => {
    await supertest(app).post('/user/signup').send({
        name:"dummy5",
        emailId:"dummy5@gmail.com",
        phoneNo:5351080621,
        gender:"Male",
        dob:"29-10-1999",
        password:"12345678"
    }).expect(200)
})

test('Should not signup existing user',async() => {
    await supertest(app).post('/user/signup').send({
        name:"dummy5",
        emailId:"dummy6@gmail.com",
        phoneNo:1351080621,
        gender:"Male",
        dob:"29-10-1999",
        password:"12345678"
    }).expect(500)
})

//Test case for check signin
test('Checking if user is new',async() => {
    await supertest(app).post('/user/checksignin').send({
        name:"dummy5",
        emailId:"dummy5@gmail.com",
        phoneNo:5351080621,
        gender:"Male",
        dob:"29-10-1999",
        password:"12345678"
    }).expect(200)
})

test('Checking if email already',async() => {
    await supertest(app).post('/user/checksignin').send({
        name:"dummy5",
        emailId:"dummy6@gmail.com",
        phoneNo:5351080621,
        gender:"Male",
        dob:"29-10-1999",
        password:"12345678"
    }).expect(400)
})


//Test case for user login
test('Should login existing user',async() => {
    const response = await supertest(app).post('/user/login').send({
        emailId:userOne.emailId,
        password:"12345678"
    }).expect(200)

    // expect(response.body).toMatchObject({       //Asserting object
    //     token:loginToken,   // fails since login and token creation time are different
    //     user:{
    //         _id:userOne._id,
    //         name:userOne.name,
    //         emailId:userOne.emailId
    //     }
    // })
    expect(response.body.user.emailId).toBe('dummy6@gmail.com');
})

test('Should not login nonexisting user',async() => {
    await supertest(app).post('/user/login').send({
        emailId:'user1@gmail.com',
        password:"12345678"
    }).expect(500)
})

test('Should not login existing user with wrong password',async() => {
    await supertest(app).post('/user/login').send({
        emailId:userOne.emailId,
        password:"123456789"
    }).expect(400)
})


//Test case for user authentication
test('Provide access to protected route when valid token is sent',async() => {
    await supertest(app)
        .get('/user/protected')
        .set('Authorization',`Bearer ${loginToken}`)
        .send()
        .expect(200)
})

test('Should not provide access to protected route when token is not sent',async() => {
    await supertest(app)
        .get('/user/protected')
        .send()
        .expect(401)
})

test('Should not provide access to protected route when invalid token is sent',async() => {
    await supertest(app)
        .get('/user/protected')
        .set('Authorization',`Bearer ${loginToken+1}`)
        .send()
        .expect(500)
})


//Test case to get all user details
test('Retriving all user details',async() => {
    await supertest(app).get('/user/').send().expect(200);
})


//Test case for signout
test('Signing out user successfully',async() => {
    await supertest(app).get('/user/signout').send().expect(200);
})


// test('Async test demo with demo',(done) => {
//     addFun(2,3).then((sum) => {
//         expect(sum).toBe(5)
//         done()
//     })
// })
// test('Async/wait test demo with async',async() => {
//     const sum = await addFun(2,3);
//     expect(sum).toBe(5)
// })