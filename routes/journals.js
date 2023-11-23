const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const journalsController = require("../controllers/journals");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.put("/updateFavorite", journalsController.updateFavorite);
router.delete("/deleteJournal", journalsController.deleteJournal);
router.post("/journal-entry", upload.single("file"), journalsController.postJournal);
router.post("/", upload.single("file"), journalsController.postJournal);
module.exports = router;