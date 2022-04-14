var express = require('express');
var router = express.Router();

router.get('/dashboard', function (req, res, next) {
    return res.render('main/index');
});

module.exports = router;