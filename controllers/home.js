module.exports = {
  getIndex: (req, res) => {
    console.log("Im in the homecontroller!")
    res.render("index.ejs");
  },
};
