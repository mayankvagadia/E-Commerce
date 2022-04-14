const mongoose = require('mongoose');

let options = {
    collection: 'users',
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    },
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

let usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    uuid:{
        type: String,
        required : true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'in_active']
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, options);

//virtual field for user full name
usersSchema.virtual('full_name').get(function () {
    if (this.first_name != undefined && this.last_name != undefined) {
        return this.first_name + ' ' + this.last_name;
    } else {
        return "";
    }
});

let user = db.model('User', usersSchema);

module.exports = {
    Model: user,
    /**Query for create new user
     * @param  {object}
     * @return {[type]}
     */
    createUser: function (newUser) {
        return new Promise((resolve, reject) => {
            user.create(newUser).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**Query for get user by email
     * @param  {string}
     * @return {[type]}
     */
    getUserByEmail: function (email) {
        return new Promise((resolve, reject) => {
            user.findOne({
                'email': email
            }, {
                first_name: 1,
                last_name: 1,
                mobile: 1,
                password: 1,
                email: 1,
                deleted: 1,
                status: 1,
                photo: 1,
                login_otp: 1
            }).then(data => {
                resolve(data);
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * Query to get count of users based on condition
     * @param  {object} condition
     */
    getUserCount: function (condition) {
        return new Promise((resolve, reject) => {
            user.countDocuments(condition).then(count => {
                resolve(count);
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * Query to update user data
     * @param  {object} condition
     * @param  {object} data ,data to be update
     */
    updateUser: function (condition, data) {
        return new Promise((resolve, reject) => {
            user.updateOne(condition, data).then(updateUser => {
                resolve(updateUser);
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * Query to get user data based on specified condition
     * If projection is set then it'll return only specified fields
     * @param  {object} condition , condition to find user
     * @param  {object} projection , selection of fields
     */
    getUserByCondition: function (condition, projection) {
        return new Promise((resolve, reject) => {
            let selectFields = {};
            if (projection != undefined) {
                selectFields = projection;
            }
            user.findOne(condition, selectFields).then(user => {
                resolve(user);
            }).catch(err => {
                reject(err);
            });
        });
    },
    /**
     * Query to get users list based on specified condition
     * If projection is set then it'll return only specified fields
     * @param  {object} condition , condition to find user
     * @param  {object} projection , selection of fields
     */
    getUsers: function (condition, projection) {
        return new Promise((resolve, reject) => {
            let selectFields = {};
            if (projection != undefined) {
                selectFields = projection;
            }
            user.find(condition, selectFields).then(user => {
                resolve(user);
            }).catch(err => {
                reject(err);
            });
        });
    },
};