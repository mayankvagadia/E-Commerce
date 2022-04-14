var express = require('express');
const passport = require('passport');
const md5 = require('md5');
const uuidv4 = require("uuid/v4")
var router = express.Router();
const userModel = require("../models/users")


router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/main/dashboard');
  } else {
    return res.render('user/login');
  }
});

router.get('/signup', function (req, res, next) {
  res.render('user/signin');
});

/*
 * POST route for add user data in database.
 */
router.post('/signup', async function (req, res, next) {
  try {
    console.log("Body  data :- ", req.body);
    let userData = req.body;
    userData["role"] = "user"
    userData["status"] = "active";
    userData["deleted"] = "false";
    userData["uuid"] = uuidv4();
    userData["password"] = md5(req.body.password)
    console.log("User data ;- ", userData);
    await userModel.createUser(userData);
    res.redirect('/admin/');
  } catch (error) {
    console.log("Error in create user :- ", error);
  }
});

/**
 * POST router for login, authentication is managed by passport.js
 */
router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    // If error or user does not exist
    let failed_url = req.query.u ? '?u=' + req.query.u : '/admin';
    if (err || !user) {
      return res.send({
        title: 'Authentication failed',
        type: 'error',
        message: info.message
      });
    } else {
      //establish sesstion
      req.logIn(user, async function (err) {
        // Invalid password
        if (err) {
          return res.send({
            title: 'Authentication failed',
            type: 'error',
            message: info.message
          });
        } else {
          res.redirect("/admin")
        }
      });
    }
  })(req, res, next);
});

/**
 * Logout from Admin
 */
router.get('/logout', function (req, res) {
  res.clearCookie('remember_me'); //clear cookie
  req.logout(); //passport logout method
  res.redirect('/admin');
});

/*
 * GET for display reset password layout with token.
 */
router.get('/reset_password/:user_id/:token', async function (req, res, next) {
  res.render('user/forgot-password');
});

/*
 * POST for update password form forgot password layout.
 * it will check any request is came for reset password by given email, if yes then process further else redirect to same page.
 */
router.post('/reset_password/:user_id',async function (req, res, next) {
  if (req.params.user_id) {
    try {
      if (req.user.uuid == req.params.user_id) {
        await userModel.updateUser({ uuid: req.params.user_id })
        req.flash('success', 'Password reset successfully.');
        res.redirect('/admin');
      } else {
        req.flash('error', 'Invalid request token for reset password.');
        res.redirect('/admin');
      }
    } catch (err) {
      req.flash('error', 'Invalid request token for reset password.');
      res.redirect('/admin');
    }
  } else {
    req.flash('error', 'Invalid request token for reset password.');
    res.redirect('/admin');
  }
});

module.exports = router;
