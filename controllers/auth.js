const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }

    res.render("login", {
    message: req.flash('loginMessage')
  });
  // res.render("login", {
  //   title: "Login",
  // });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  console.log('req.flash: ')
  console.log(req.flash('signupMessage'))
  res.render("signup", {
    message: req.flash('signupMessage')
  });
};

exports.postSignup = (req, res, next) => {

  const validationErrors = [];

  //VALIDATION FOR ENTERING VALID EMAIL
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });

  //VALIDATION FOR PASSWORD BEING MIN OF 8 CHARACTERS LONG
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });

  // VALIDATION FOR PASSWORD MATCHING OG PASSWORD
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  // EDGE CASE: IF THE USER IS A CAREGIVER NEEDS TO FILL OUT ALL CAREGIVER FIELDS
  if(req.body['warrior-status'] === 'Caregiver' && (req.body['caregiver-patient-name'] === '' || req.body['caregiver-patient-status'] === '' || req.body['relationship-type'] === '' )){
    validationErrors.push({ msg: "Fill out all fields" })
  }

  console.log('req.body')
  console.log(req.body)

  if (validationErrors.length) {
    console.log('validationErrors :')
    console.log(validationErrors)
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });


  //CREATED NEW USER W/ SCHEMA 
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    'warrior-name': req.body['warrior-name'],
    'warrior-status': req.body['warrior-status'],
    'caregiver-patient-name': req.body['caregiver-patient-name'],
    'caregiver-patient-status': req.body['caregiver-patient-status'],
    'relationship-type': req.body['relationship-type'],
    'cancer-type' : req.body['cancer-type'],
    'lang-type' : req.body['lang-type'],
  });


  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/profile");
        });
      });
    }
  );
};
