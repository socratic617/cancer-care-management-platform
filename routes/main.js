const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const journalsController = require("../controllers/journals");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex); // (endpoint, callback function)
// router.get("/profile", ensureAuth, journalsController.getProfile);
router.get("/community-page", ensureAuth, journalsController.getCommunity);//added commmunity pg 
router.get("/journal-entry", ensureAuth, journalsController.getJournal);
// router.get("/feed", ensureAuth, journalsController.getFeed);
// router.get("/feed", ensureAuth, journalsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
