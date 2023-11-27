const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const journalsController = require("../controllers/journals");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex); // (endpoint, callback function)

//ensureauth ensures that you are a user logged in who authorized to be here
router.get("/community-page", ensureAuth, journalsController.getCommunity);//added commmunity pg 
router.get("/journal-entry", ensureAuth, journalsController.getJournal);
router.get("/my-journals", ensureAuth, journalsController.getUserJournals);
router.get("/visualization", ensureAuth, journalsController.getVisualization);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;