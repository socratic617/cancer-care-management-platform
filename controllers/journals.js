const cloudinary = require("../middleware/cloudinary");
// const Journal = require("../models/Journal");
module.exports = {

    getCommunity: async (req, res) => {
    try {
      console.log('req.user : ')
      console.log(req.user)
      // const posts = await Post.find({ user: req.user.id });
      res.render("community-page.ejs", {  user: req.user, entries: [] });//*****TO DO: Create Request to database and model for journals (add schema for journal aka model)*** *********TO DO*/
    } catch (err) {
      console.log(err);
    }
  },
   getJournal: async (req, res) => {
    try {
      console.log('req.user : ')
      console.log(req.user)
      // const posts = await Post.find({ user: req.user.id });
      res.render("journal-entry.ejs", {  user: req.user });//*****TO DO: Create Request to database and model for journals (add schema for journal aka model)*** *********TO DO*/
    } catch (err) {
      console.log(err);
    }
  },
};