const express = require('express');
const adminController = require('../controller/adminController');

const router = express.Router();


router.post("/login",adminController.login);

router.use(adminController.isAuthorised);

router.patch('/location/:locationId',adminController.editLocation);
router.patch('/character/:characterId',adminController.editCharacter);
router.patch('/category/:categoryId',adminController.editCategory);
router.patch('/story/:storyId',adminController.editStory);
router.patch('/chapter/:chapterId',adminController.editChapter);
router.patch('/chapter/html/:chapterId',adminController.upload.single('upload'),
    adminController.editChapterHtml,
    adminController.errorInChapterHtmlPage)

router.delete('/chapter/:chapterId',adminController.deleteChapter);
router.delete('/story/:storyId',adminController.deleteStory);

router.patch("/ecategory/:categoryId",adminController.editECategory);
router.patch("/esubcategory/:subcategoryId",adminController.editESubCategory);
router.patch("/eproduct/:productId",adminController.editEProduct);
router.patch("/eorder/:orderId",adminController.editEOrder);

module.exports = router;