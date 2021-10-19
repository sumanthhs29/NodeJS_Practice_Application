const express = require('express');
const ecommerceController = require('../controller/ecommerceController');

const router = express.Router();

router.post("/address",ecommerceController.addAddress);
router.post("/category",ecommerceController.addCategory);
router.post("/subcategory",ecommerceController.addSubCategory);
router.post("/product",ecommerceController.addProduct);
router.post("/cart",ecommerceController.addToCart);
router.post("/order/:userId",ecommerceController.addToOrder);



router.get("/address/:userId",ecommerceController.getAddress);
router.get("/category",ecommerceController.getCategory);
router.get("/subcategory/:categoryId",ecommerceController.getSubCategory);
router.get("/allproduct",ecommerceController.getAllProduct);
router.get("/product",ecommerceController.getProduct);
router.get("/cart/:userId",ecommerceController.getCart);
router.get("/order/:userId",ecommerceController.getOrder);
router.get("/order",ecommerceController.getAllOrder);

router.delete("/cart/:userId/:productId",ecommerceController.deleteCartProduct);

module.exports = router;