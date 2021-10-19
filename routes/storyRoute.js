const express = require('express');

const storyController = require('./../controller/storyController');
const userController = require('../controller/userController');

const router = express.Router();


router.post("/character",storyController.addCharacter);
router.post("/location",storyController.addLocation);
router.post("/category",storyController.addCategory);
router.post("/story",storyController.addStory);
router.post("/chapter",storyController.addChapter);
router.post("/chapter/upload/:chapterId",storyController.upload.single('upload'),
    storyController.addChapterHtmlPage,
    storyController.errorInChapterHtmlPage)

router.get("/character",storyController.getCharacter);
router.get("/location",storyController.getLocation);
router.get("/language",storyController.getLanguage);
router.get("/category",storyController.getCategory);
router.get("/story",storyController.getStory);
router.get("/chapter",storyController.getChapter);
router.get("/chapter/:storyId",storyController.getChapterByStoryId);
router.get("/chapter/html/:chapterId",storyController.getChapterHtmlPage)

router.patch("/story/:storyId",storyController.incrementViewsOfStory);

router.get("/search",storyController.search);
router.get("/popular",storyController.popular);
router.get("/recent",storyController.recent);
router.get("/watchlist",storyController.watchlist);
router.get("/youmaylike",storyController.youMayLike);

module.exports = router;