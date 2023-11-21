const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);// post is an object that represents a post
      console.log('post :');
      console.log(post);

      const comments = await Comment.find({postId: req.params.id}).sort({ createdAt: "desc" }).lean()
      console.log('comments : ')
      console.log(comments)
      res.render("post.ejs", { post: post, user: req.user, comments: comments});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      console.log('right before cloud post' , req.file, req.body)
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({//waiting for results from cloudinary, Post i s a model
        title: req.body.title,
        image: result.secure_url,// coemes cloudinary 
        cloudinaryId: result.public_id,// coemes cloudinary and need id from cloudinary to know what to delete
        caption: req.body.caption,//comes from form
        likes: 0,
        user: req.user.id, //always going to get user by req.user.id
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  createComment: async (req, res) => {//created "createComment" from end point in routes post.js
  try {
    console.log("req.params in create comment :")
    console.log(req.params)

    console.log("commenterId :")
    console.log(req.params.commenterId)

    console.log("req.body in create comment :")
    console.log(req.body)
    //
    await Comment.create({//creating post
      comment: req.body.comment,// comment was in form
      madeBy: req.params.commenterId, //in params bc not in form its in url 
      postId: req.params.id, //in params bc not in form its in url
    });
    console.log("Post has been added!");
    res.redirect(`/post/${req.params.id}`);//renders new post created by user 
  } catch (err) {
    console.log(err);
  }
  },
};
