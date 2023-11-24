const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const journalsController = require("../controllers/journals");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//.getVisualization is my key that gets me my value (located in journalsController and that value is a method aka async anonymous function)
// router.get("/getVisualization", journalsController.getVisualization);//my router.get() method gets my callback function from key getVisualization but if it wasnt  router.get and you removed that, it would be a regular function
router.put("/updateFavorite", journalsController.updateFavorite);
router.delete("/deleteJournal", journalsController.deleteJournal);
router.post("/journal-entry", upload.single("file"), journalsController.postJournal);
router.post("/", upload.single("file"), journalsController.postJournal);
module.exports = router;