const addressModel = require('../model/addressModel');
const productCategoryModel = require('../model/productCategoryModel');
const productSubCategoryModel = require('../model/productSubCategoryModel');
const productModel = require('../model/productModel');
const userModel = require('../model/userModel');
const cartModel = require('../model/cartModel');
const orderModel = require('../model/orderModel');
const orderItemModel = require('../model/orderItemModel');

//Method to add address
exports.addAddress = (async(req,res) => {
    let user;
    try{
        user = await addressModel.findOne({userId:req.body.userId});
    }catch(err) {
        console.error(`Error in finding user = ${req.body.userId}`,new Date());
        return res.status(500).json(err);
    }
    if(!user){
        //When user address does not exist in database
        const address = new addressModel(req.body);
        address.save((err,result) =>{
            if(err){
                console.error(`Error in saving user address whose id = ${req.body.userId}`,new Date());
                res.status(500).json({
                    err:"Not able to save user address in DB"
                });
            }else{
                console.log(`User address saved successfully for userId = ${req.body.userId}`,new Date());
                res.status(200).json({
                    status:"success",
                    data:result
                })
            }
        })
    }else{
        //User address is already present
        user = await addressModel.findOneAndUpdate({userId:req.body.userId},{$set:req.body}, {
            new:true,
            useFindAndModify:false
        })
        res.status(200).json({
            status:'updated address',
            data:user
        })
    }
});

//Method to add product category
exports.addCategory = (async(req,res,next) => {
    let findCategory;
    try{
        //Checking if category already exists
        findCategory = await productCategoryModel.findOne({name:req.body.name});
    }catch (err) {
        console.error(`Error in adding category = ${req.body.name}`,new Date());
        return res.status(500).json(err);
    }
    if(!findCategory){
        //If category is new
        const category = new productCategoryModel(req.body);
        category.save((err,result) =>{
            if(err){
                console.error(`Error in saving category ${req.body.name}`,new Date());
                res.status(500).send({
                    err:"Not able to save category in DB"
                });
            }else{
                console.log(`Category saved successfully ${req.body.name}`,new Date());
                res.status(200).json({
                    status:"success",
                    data:result
                })
            }
        })
    }else{
        //When category already exists
        res.status(400).json({
            status:'cagtegory already exists'
        })
    }
});

//Method to add product sub-category
exports.addSubCategory = (async(req,res,next) => {
    let findSubCategory;
    try{
        //Checking if sub-category already exists
        findSubCategory = await productSubCategoryModel.findOne({name:req.body.name});
    }catch (err) {
        console.error(`Error in adding sub-category = ${req.body.name}`,new Date());
        return res.status(500).json(err);
    }
    if(!findSubCategory){
        //If sub-category is new
        const subCategory = new productSubCategoryModel(req.body);
        subCategory.save((err,result) =>{
            if(err){
                console.error(`Error in saving sub-category ${req.body.name}`,new Date());
                res.status(500).send({
                    err:"Not able to save sub-category in DB"
                });
            }else{
                console.log(`sub-category saved successfully ${req.body.name}`,new Date());
                res.status(200).json({
                    status:"success",
                    data:result
                })
            }
        })
    }else{
        //When sub-category already exists
        res.status(400).json({
            status:'sub-cagtegory already exists'
        })
    }
});

//Method to add product details
exports.addProduct = (async(req,res,next) => {
    let findProduct;
    try{
        //Checking if product already exists
        findProduct = await productModel.findOne({name:req.body.name});
    }catch (err) {
        console.error(`Error in adding product details = ${req.body.name}`,new Date());
        return res.status(500).json(err);
    }
    if(!findProduct){
        //If product is new
        const product = new productModel(req.body);
        product.save((err,result) =>{
            if(err){
                console.error(`Error in saving product details ${req.body.name}`,new Date());
                res.status(500).send({
                    err:"Not able to save product details in DB"
                });
            }else{
                console.log(`Product details saved successfully ${req.body.name}`,new Date());
                res.status(200).json({
                    status:"success",
                    data:result
                })
            }
        })
    }else{
        //When product detail already exists
        res.status(400).json({
            status:'Product details already exists'
        })
    }
});

//Method to add product to cart
exports.addToCart = (async(req,res,next) => {
    let user;
    try{
        user = await cartModel.findOne({userId:req.body.userId});
    } catch(err){
        console.error(`Error in getting cart details of userId = ${req.body.userId}`,new Date());
        return res.status(500).json(err);
    }

    //When cart is empty for given user
    if(!user){
        const cart = new cartModel(req.body);
        cart.save((err,result) =>{
            if(err){
                console.error(`Error in saving product details in cart for userId = ${req.body.userId}`,new Date());
                return res.status(500).send({
                    err:"Not able to save product details in cart"
                });
            }else{
                console.log(`Cart details saved successfully for userId = ${req.body.userId}`,new Date());
                return res.status(200).json({
                    status:"success",
                    data:result
                })
            }
        })
    }
    //When user cart already exists
    else{
        try{
            await cartModel.updateOne({userId:req.body.userId},{$addToSet: {productId:req.body.productId}});
        }
        catch (err) {
            console.error(`Error in updating cart of userId = ${req.body.userId}`,new Date());
            return res.status(500).json(err);
        }
        console.log(`Cart details updated successfully for userId = ${req.body.userId}`,new Date());
        return res.status(200).json({
            status:"success"
        })
    }
});

//Method to add order details
exports.addToOrder = (async(req,res,next) => {
    let order,orderItem,allProducts;
    try{
        const ordermodel = new orderModel({
            totalAmount:req.body.amount,
            userId:req.params.userId,
            addressId:req.body.addressId,
            paymentId:req.body.paymentId
        });
        order = await ordermodel.save();
    }catch(error){
        console.error(`Error in saving order detail of userId = ${req.params.userId}`,new Date());
            return res.status(500).json(error);
    }
    try{
        const orderItemmodel = new orderItemModel({
            userId:req.params.userId,
            products:req.body.products,
            orderId:order._id,
        })
        allProducts = req.body.products;
        allProducts.map(async(item) => {
            await productModel.updateOne({_id:item.productId},{$inc: {stock: -item.quantity,sold: item.quantity}});
        })
        orderItem = await orderItemmodel.save();
    }catch(error){
        console.error(`Error in saving order-items detail of userId = ${req.params.userId}`,new Date());
            return res.status(500).json(error);
    }
    try{
        await cartModel.deleteOne({userId:req.params.userId});
    }catch(error){
        console.error(`Error in deleting cart detail detail of userId = ${req.params.userId}`,new Date());
            return res.status(500).json(error);
    }
    res.status(200).json({
        status:'success'
    });
});

//Method to get address of a particular user
exports.getAddress = (async(req,res) => {
    let address;
    try{
        address = await addressModel.findOne({userId:req.params.userId});
    }catch(err) {
        console.error(`Error in fetching address details of userId = ${req.body.name}`,new Date());
        return res.status(500).json(err);
    }
    if(!address){
        console.log(`address for userId = ${req.body.name} does not exist`,new Date());
        return res.status(400).json({
            status:'address not saved for the user'
        })
    }
    res.status(200).json({
        status:"success",
        data:{
            address
        }
    });
})


//Method to get all category
exports.getCategory = (async(req,res,next) => {
    let category;
    try{
        category = await productCategoryModel.find({},{__v:0,createdAt:0,modifiedAt:0});
    }
    catch(err) {
        console.error('Error in getting product category details ',new Date());
        return res.status(500).json(err);
    }

    if(!category.length) {
        console.error("No product categories is present",new Date());
        return res.status(500).send({
            error:'not success'
        })
    }
    res.status(200).json({
        status:"success",
        data:{
            category
        }
    });
    next();
});

//Method to get all sub-category in a category
exports.getSubCategory = (async(req,res,next) => {
    let subCategory;
    try{
        subCategory = await productSubCategoryModel.find({categoryId:req.params.categoryId},{__v:0,createdAt:0,modifiedAt:0})
        .populate({
            path:'categoryId',
            select:'name description'
        });
    }
    catch(err) {
        console.error('Error in getting product sub-category details ',new Date());
        return res.status(500).json(err);
    }

    if(!subCategory.length) {
        console.error("No product sub-categories is present",new Date());
        return res.status(500).send({
            error:'not success'
        })
    }
    res.status(200).json({
        status:"success",
        data:{
            subCategory
        }
    });
    next();
});

//Method to get all product for admin
exports.getAllProduct = (async(req,res,next) => {
    let product;
    try{
        product = await productModel.find({},{__v:0,createdAt:0,modifiedAt:0})
        .populate({
            path:'categoryId',
            select:'name description'
        })
        .populate({
            path:'subCategoryId',
            select:'name description'
        });
    }
    catch(err) {
        console.error('Error in getting product details ',new Date());
        return res.status(500).json(err);
    }

    if(!product.length) {
        console.error("No product detail is present",new Date());
        return res.status(500).send({
            error:'not success'
        })
    }
    res.status(200).json({
        status:"success",
        data:{
            product
        }
    });
    next();
});

//Method to get product/s in a category
exports.getProduct = (async(req,res,next) => {
    let product;
    if(req.query.categoryId != undefined){
        try{
            product = await productModel.find({categoryId:req.query.categoryId,stock: {$gt:0}},{__v:0,createdAt:0,modifiedAt:0});
        }
        catch(err) {
            console.error(`Error in getting all product details in categoryId = ${req.query.categoryId} `,new Date());
            return res.status(500).json(err);
        }
    }
    else if(req.query.productId != undefined){
        try{
            product = await productModel.find({_id:req.query.productId},{__v:0,createdAt:0,modifiedAt:0});
        }
        catch(err) {
            console.error(`Error in getting details of productId = ${req.query.productId} `,new Date());
            return res.status(500).json(err);
        }
    }
    else{
        console.error("Invalid api call for products",new Date());
        return res.status(500).send({
            error:'not success'
        })
    }

    if(!product.length) {
        console.error("No product detail is present",new Date());
        return res.status(500).send({
            error:'not success'
        })
    }
    res.status(200).json({
        status:"success",
        data:{
            product
        }
    });
    next();
});

//Method to  get deatils of cart of user
exports.getCart = (async(req,res) => {
    let cart;
    try{
        cart = await cartModel.findOne({userId:req.params.userId})
        .populate({
            path:'productId'
        });
        if(!cart){
            return res.status(400).json({
            status:'not success'
            })
        }
        return res.status(200).json({
            status:"success",
            data:{
                cart
            }
        });
    }catch(error) {
        console.error(`Error in getting cart details of userId = ${req.params.userId}`,new Date());
            return res.status(500).json(error);
    }
});

//Method to get details of order of user
exports.getOrder = (async(req,res) => {
    let order;
    try{
        order = await orderItemModel.find({userId:req.params.userId})
        .populate({
            path:'orderId',
            select:"-userId -__v"
        }).populate({
            path:"products.productId",
            select:"name price image"
        });
        if(!order){
            return res.status(400).json({
            status:'not success'
            })
        }
        return res.status(200).json({
            status:"success",
            data:{
                order
            }
        });
    }catch(error) {
        console.error(`Error in getting order details of userId = ${req.params.userId}`,new Date());
            return res.status(500).json(error);
    }
});

//Method to get details of all order
exports.getAllOrder = (async(req,res) => {
    let order;
    try{
        order = await orderItemModel.find()
        .populate({
            path:'orderId',
            select:"-userId -__v"
        }).populate({
            path:"products.productId",
            select:"name price image"
        });
        if(!order){
            return res.status(400).json({
            status:'not success'
            })
        }
        return res.status(200).json({
            status:"success",
            data:{
                order
            }
        });
    }catch(error) {
        console.error('Error in getting all order details',new Date());
            return res.status(500).json(error);
    }
});


exports.deleteCartProduct = (async(req,res) => {
    let cart;
    try{
        cart = await cartModel.findOne({userId:req.params.userId});
        index = cart.productId.indexOf(req.params.productId);
        if(index > -1 ){
            cart.productId.splice(index,1);
        }
        await cart.save();

    }catch(error) {
        console.error(`Error in deleting product = ${req.params.productId} of userId = ${req.params.userId}`,new Date());
            return res.status(500).json(error);
    }
    return res.status(200).json({
        status:'success'
    })
})
