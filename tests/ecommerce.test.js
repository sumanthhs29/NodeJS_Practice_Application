const supertest = require('supertest')
const mongoose = require("mongoose");
const app = require('../app')
const addressModel = require('../model/addressModel');
const productCategoryModel = require('../model/productCategoryModel');
const productSubCategoryModel = require('../model/productSubCategoryModel');
const productModel = require('../model/productModel');
const cartModel = require('../model/cartModel');

const addressOne = {
    _id:new mongoose.Types.ObjectId(),
    fullName:'Sumanth',
    address1:'India',
    address2:'Karnataka',
    city:'Tumkur',
    postCode:572103,
    phoneNo:9114522583,
    userId: new mongoose.Types.ObjectId()
}
const productCategoryOne = {
    _id:new mongoose.Types.ObjectId(),
    name:'Books',
    description:'Read more books',
    image:'book.jpg'
}
const productSubCategoryOne = {
    _id:new mongoose.Types.ObjectId(),
    name:'Historical',
    description:'Learn more about Indian history',
    categoryId: productCategoryOne._id
}
const productOne = {
    _id:new mongoose.Types.ObjectId(),
    name:'Kalinga War',
    description:'Know How Ashoka Won the Kalinga War',
    price:200,
    stock:10,
    image:['kalinga.jpg'],
    categoryId: productCategoryOne._id,
    subCategoryId: productSubCategoryOne._id
}
const cartOne = {
    _id:new mongoose.Types.ObjectId(),
    userId: addressOne.userId,
    productId: productOne._id
}

beforeEach(async() =>{
    jest.setTimeout(30000);
    await addressModel.deleteMany()
    await productCategoryModel.deleteMany()
    await productSubCategoryModel.deleteMany()
    await productModel.deleteMany()
    await cartModel.deleteMany()

    await new addressModel(addressOne).save()
    await new productCategoryModel(productCategoryOne).save()
    await new productSubCategoryModel(productSubCategoryOne).save()
    await new productModel(productOne).save()
    await new cartModel(cartOne).save()
})

test('Test case for ecommerce controller',() =>{

})


//Test case for saving address
test('Should save address of user',async() => {
    await supertest(app).post('/ecommerce/address').send({
        fullName:'Sumanth',
        address1:'India',
        address2:'Karnataka',
        city:'Tumkur',
        postCode:572103,
        phoneNo:9114522583,
        userId: "609cc1f0e407297f7cec9aa4"
    }).expect(200)
})

test('Should not save address of user whose address is already present',async() => {
    await supertest(app).post('/ecommerce/address').send({
        fullName:'Sumanth',
        address1:'India',
        address2:'Karnataka',
        city:'Tumkur',
        postCode:572103,
        phoneNo:9114522583,
        userId: addressOne.userId
    }).expect(400)
})


//Test case for saving product category
test('Should save product category',async() => {
    await supertest(app).post('/ecommerce/category').send({
        name:'Wall paintings',
        description:'Read more books',
        image:'painting.jpg'
    }).expect(200)
})

test('Should not save category of product when category is already present',async() => {
    await supertest(app).post('/ecommerce/category').send({
        name:'Books',
        description:'Read more books',
        image:'book.jpg'
    }).expect(400)
})


//Test case for saving product sub-category
test('Should save product sub-category',async() => {
    await supertest(app).post('/ecommerce/subcategory').send({
        name:'War',
        description:'Learn more about War that happened in India',
        categoryId: productCategoryOne._id
    }).expect(200)
})

test('Should not save sub-category of product when the sub-category is already present',async() => {
    await supertest(app).post('/ecommerce/subcategory').send({
        name:'Historical',
        description:'Learn more about Indian history',
        categoryId: productCategoryOne._id
    }).expect(400)
})


//Test case for saving product details
test('Should save product details',async() => {
    await supertest(app).post('/ecommerce/product').send({
        name:'Mysore Palace',
        description:'Know more about Mysore Palace',
        price:200,
        stock:10,
        image:['mysore.jpg'],
        categoryId: productCategoryOne._id,
        subCategoryId: productSubCategoryOne._id
    }).expect(200)
})

test('Should not save product when the product is already present',async() => {
    await supertest(app).post('/ecommerce/product').send({
        name:'Kalinga War',
        description:'Know How Ashoka Won the Kalinga War',
        price:200,
        stock:10,
        image:['kalinga.jpg'],
        categoryId: productCategoryOne._id,
        subCategoryId: productSubCategoryOne._id
    }).expect(400)
})


//Test case for saving product in cart
test('Should save product in cart when user cart is empty',async() => {
    await cartModel.deleteMany()
    await supertest(app).post('/ecommerce/cart').send({
        _id:new mongoose.Types.ObjectId(),
        userId: addressOne.userId,
        productId: productOne._id
    }).expect(200)
})

test('Should save product in cart when the user cart already present',async() => {
    await supertest(app).post('/ecommerce/cart').send({
        _id:new mongoose.Types.ObjectId(),
        userId: addressOne.userId,
        productId: productOne._id
    }).expect(200)
})


//Test case for fetching address
test('Should send address of user with cart',async() => {
    await supertest(app).get(`/ecommerce/address/${addressOne.userId}`).send().expect(200)
})

test('Should not send address of user without cart',async() => {
    await supertest(app).get(`/ecommerce/address/${addressOne.userId+1}`).send().expect(500)
})


//Test case for fetching all product category
test('Should send all category',async() => {
    await supertest(app).get('/ecommerce/category').send().expect(200)
})

test('Should not send category',async() => {
    await productCategoryModel.deleteMany();
    await supertest(app).get('/ecommerce/category').send().expect(500)
})


//Test case for fetching all product sub-category in a category
test('Should send all sub-category in a category',async() => {
    await supertest(app).get(`/ecommerce/subcategory/${productCategoryOne._id}`).send().expect(200)
})

test('Should not send sub-category in a category',async() => {
    await productSubCategoryModel.deleteMany()
    await supertest(app).get(`/ecommerce/subcategory/${productCategoryOne._id}`).send().expect(500)
})


//Test case for fetching product detail
test('Should send all product detail',async() => {
    await supertest(app).get('/ecommerce/allproduct').send().expect(200)
})

test('Should not send any product detail when product DB is empty',async() => {
    await productModel.deleteMany()
    await supertest(app).get('/ecommerce/allproduct').send().expect(500)
})

test('Should send all product detail in a category',async() => {
    await supertest(app).get(`/ecommerce/product?categoryId=${productCategoryOne._id}`).send().expect(200)
})

test('Should not send any product detail when product DB is empty',async() => {
    await productModel.deleteMany()
    await supertest(app).get(`/ecommerce/product?categoryId=${productCategoryOne._id}`).send().expect(500)
})


//Test case for fetching cart detail of user
test('Should send cart detail of user',async() => {
    await supertest(app).get(`/ecommerce/cart/${cartOne.userId}`).send().expect(200)
})

test('Should not send any cart detail when user cart is empty',async() => {
    await cartModel.deleteMany()
    await supertest(app).get(`/ecommerce/cart/${cartOne.userId}`).send().expect(400)
})