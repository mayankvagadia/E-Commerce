const express = require('express');
const router = express.Router();
const md5 = require('md5');
const usersModel = require('../models/users.js');
const multer = require('multer');
const path = require('path');
const fsExtra = require('fs-extra');
const pagination = require('../helpers/paginator');
const Mailer = require('../helpers/mailer.js');
let ObjectId = require('mongoose').Types.ObjectId;
let id = '';

//set path and change file name for image upload
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        fsExtra.mkdirsSync('./public/uploads/');
        fsExtra.mkdirsSync('./public/uploads/avatar/');
        callback(null, './public/uploads/avatar/');
    },
    filename: function (req, file, callback) {
        if (id == '') {
            id = req.body.id;
        }
        callback(null, id + path.extname(file.originalname));
    }
});

// image upload config
let upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        let filetype = ['.jpeg', '.png', '.jpg'];
        if (filetype.indexOf(path.extname(file.originalname)) < '0') {
            return cb(new Error('File must be jpg, jpeg and png.'))
        }
        cb(null, true)
    }
}).single('user_image');

/**
 * Get for display list of admins
 */
router.get('/list/:role?', function (req, res, next) {
    let row = 10;
    let conditions = {
        'deleted': false,
        'role': 'user'
    };
    var title = 'Users List';
    if (req.params.role != undefined && req.params.role != "" && req.params.role == "admins") {
        conditions['role'] = 'admin';
        title = 'Admins List'
    }
    if (req.query.search) {
        //or conditions
        conditions['$or'] = [{
            'first_name': {
                '$regex': req.query.search,
                '$options': 'i'
            }
        }, {
            'last_name': {
                '$regex': req.query.search,
                '$options': 'i'
            }
        }, {
            'mobile': {
                '$regex': req.query.search,
                '$options': 'i'
            }
        }, {
            'email': {
                '$regex': req.query.search,
                '$options': 'i'
            }
        }];
    }

    let sort = {};
    if (req.query.sort && req.query.sort_field) {
        //sorting field
        sort[req.query.sort_field] = req.query.sort == "desc" ? -1 : 1;
    } else {
        sort['created_on'] = -1;
    }

    //Make options for pagination
    var options = {
        sort: sort
    };

    pagination.getPagination(usersModel.Model, '/users' + req.url, req.query.page, row, {
        conditions: conditions,
        options: options
    }, function (data) {
        res.render('admin/users/index', {
            search: req.query.search,
            paginator: data.paginator,
            listtype: req.params.role,
            users: data.result,
            title: title
        });
    });
});




/**
 * Get for display add user view
 */
router.get('/add', function (req, res, next) {
    res.render('users/add', {
        'title': ' Add Admin',
        'from': 'add'
    });
});

/*
 * POST route for add user data in database.
 */
router.post('/add', function (req, res, next) {
    id = new ObjectId();
    upload(req, res, function (err) {
        if (err) {
            catchErrorLogs('Error on adding user, from upload file');
            catchErrorLogs(err);
            return res.send({
                type: 'error',
                message: err.message
            });
        } else {
            const uuidv4 = require('uuid/v4');
            let userData = req.body;
            userData._id = id;
            if (typeof req.file != 'undefined' && req.file.filename) {
                userData.photo = req.file.filename;
            }
            let generator = require('generate-password');
            let password = generator.generate({
                length: 8,
                numbers: true
            });
            userData.uuid = uuidv4();
            userData.role = "admin";
            userData.password = md5(password);
            userData.created_by = req.user.id;
            userData.email = userData.email.toLowerCase();
            usersModel.createUser(userData).then(user => {
                // Mailer.sendMail('new_user', {
                //     reciver: user.email,
                //     reciver_name: user.full_name,
                //     variable: {
                //         '%full_name%': user.full_name,
                //         '%password%': password,
                //         '%url%': config.base_url,
                //         '%site_title%': config.site_title
                //     }
                // });
                res.send({
                    type: 'success',
                    message: 'User added successfully'
                });
            }).catch(err => {
                catchErrorLogs('Error on adding user in database');
                catchErrorLogs(err);
                res.send({
                    type: 'error',
                    message: 'Error on creating a user'
                });
            });
        }
    });
});

/*
 * GET route for check unique email of user.
 * return (boolean)
 */
router.get('/checkEmail', function (req, res, next) {
    let condition = {
        'email': req.query.email
    };
    if (req.query.id != "undefined" && req.query.id != '') { //check conditions
        condition['_id'] = {
            '$ne': req.query.id
        };
    }
    usersModel.getUserCount(condition).then(count => {
        if (count > 0) {
            return res.send(false);
        }
        return res.send(true);
    }).catch(err => {
        return res.send(false);
    });
});

/*
 * GET for display edit user profile layout.
 */
router.get('/edit_profile', function (req, res, next) {
    usersModel.getUserByCondition({
        _id: req.user.id
    }).then(user => {
        if (user) {
            res.render('admin/users/edit_profile', {
                user: user,
                title: 'Edit Profile'
            });
        } else {
            req.flash('error', 'Something is wrong.');
            res.redirect('/admin');
        }
    }).catch(err => {
        req.flash('error', 'Something is wrong.');
        res.redirect('/admin');
    });
});

/*
 * POST for update user profile.
 * if user add image then it will check user photo with allowed extention and size, if valid then upload it with proper name
 */
router.post('/edit_profile', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.send({
                type: 'error',
                message: err.message
            });
        } else {
            let userData = req.body;
            if (typeof req.file != 'undefined' && req.file.filename) {
                userData.photo = req.file.filename;
            }
            userData.updated_by = req.user.id;
            usersModel.updateUser({
                _id: req.body.id
            }, userData).then(updatedUser => {
                //update data in session
                req.user.first_name = userData.first_name;
                req.user.last_name = userData.last_name;
                req.user.email = userData.email;
                req.user.phone = userData.mobile;
                if (userData.photo) {
                    req.user.photo = userData.photo;
                }
                res.send({
                    type: 'success',
                    message: 'Profile updated successfully',
                });
            }).catch(function (err) {
                catchErrorLogs('Error on updating user profile in database');
                catchErrorLogs(err);
                res.send({
                    type: 'error',
                    message: 'Profile can not updated'
                });
            });
        }
    });
});

/*
 * GET for display change logged in user password layout.
 */
router.get('/change_password', function (req, res, next) {
    res.render('users/change_password', {
        title: 'Change Password'
    });
});

/*
 * POST for update user password.
 */
router.post('/change_password', function (req, res, next) {
    try {
        usersModel.getUserCount({
            _id: req.user.id,
            password: md5(req.body.old_password)
        }).then(count => {
            if (count > 0) {
                usersModel.updateUser({
                    _id: req.user.id
                }, {
                    password: md5(req.body.password)
                }).then(user => {
                    return res.send({
                        type: 'success',
                        message: 'Password changed successfully.'
                    });
                }).catch(err => {
                    return res.send({
                        type: 'error',
                        message: 'Password can not changed.'
                    });
                });
            } else {
                return res.send({
                    type: 'error',
                    message: 'Password can not match with old password.'
                });
            }
        }).catch(err => {
            return res.send({
                type: 'error',
                message: 'Something went wrong,password can not changed.'
            });
        });
    } catch (err) {
        return res.send({
            type: 'error',
            message: 'Something went wrong,password can not changed.'
        });
    }
});

/**
 * Post for change status of user
 */
router.post('/changeStatus', function (req, res, next) {
    usersModel.updateUser({
        '_id': req.body.id
    }, {
        'status': req.body.status
    }).then(user => {
        return res.send({
            type: 'success',
            message: 'Status updated successfully',
            title: 'Status Changed'
        });
    }).catch(err => {
        catchErrorLogs('Error on change status of user : ' + req.params.id);
        catchErrorLogs(err);
        return res.send({
            type: 'error',
            message: 'Status can not updated',
            title: 'Status Not Changed'
        });
    });
});

/**
 * Post for reset password of user by other admin user
 */
router.post('/resetPassword/:id', function (req, res, next) {
    usersModel.updateUser({
        '_id': req.params.id
    }, {
        'password': md5(req.body.password)
    }).then(updatedUser => {
        return res.send({
            type: 'success',
            message: 'Password changed successfully'
        });
    }).catch(err => {
        catchErrorLogs('Error on reset password of user : ' + req.params.id);
        catchErrorLogs(err);
        return res.send({
            type: 'error',
            message: 'Password can not changed successfully'
        });
    });
});

module.exports = router;