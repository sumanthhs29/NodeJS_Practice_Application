const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.post("/signup",userController.signup);
router.post("/checksignin",userController.checksignin);
router.post("/login",userController.login);
router.post("/forgotPassword",userController.forgotPassword);

router.patch("/resetPassword",userController.resetPassword);

router.get("/signout",userController.signout);
router.get("/",userController.allUser);
router.get("/protected",userController.isAuthenticated,userController.protectedRoute);

router.delete("/user",userController.deleteUser);

module.exports = router;