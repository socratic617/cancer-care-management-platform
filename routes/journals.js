const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const journalsController = require("../controllers/journals");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.post("/journal-entry", upload.single("file"), journalsController.postJournal);

module.exports = router;