var express = require('express');
var router = express.Router();

router.get('/dashboard', function (req, res, next) {
    console.log("main..............................");
    console.log(req.user);
    if (req.user.email == "admin@site.com") {
        console.log("ifff");
        console.log(req.user);
        res.render("index")
      }else{
        res.render('main/index');
      }
    return 
});

module.exports = router;