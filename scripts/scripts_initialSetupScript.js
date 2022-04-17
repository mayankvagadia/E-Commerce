/**
 * Script is used for setup db first time this script will work only in docker
 */

global.models = null //load all models in global conn var.
global.conn = null;
//inport config file
global.config = require('../config/config.js');

/***********create uploads and logs folder */
var fs = require('fs');
var uploadDirs = [
  './public/uploads'
];
for (inx in config.dir_constants) {
  uploadDirs.push('./public/uploads' + config.dir_constants[inx]);
}
for (inx in uploadDirs) {
  if (!fs.existsSync(uploadDirs[inx])) {
    fs.mkdirSync(uploadDirs[inx]);
  }
}
if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}
/**************************************** */

let ObjectId = require('mongoose').Types.ObjectId;
//create client of mongo
const MongoClient = require('mongodb').MongoClient;
//get dbconfig
let dbconfig = config['datasource'];
//create database connection uri for central db
let database = 'mongodb://:' + dbconfig.host + ':' + dbconfig.port + '/admin';
//connect database
MongoClient.connect(database, {
  useNewUrlParser: true
}, function (err, client) {
  if (!err) {
    console.log('==============>Central db connected');
    //authentication if centraldb already created
    let central_database = 'mongodb://' + dbconfig.username + ':' + dbconfig.password + '@' + dbconfig.host + ':' + dbconfig.port + '/' + dbconfig.database;
    MongoClient.connect(central_database, {
      useNewUrlParser: true
    }, async function (central_err, central_client) {
      if (central_err) {
        // Add the new user to the admin database
        const db = client.db(dbconfig.database);
        db.addUser(dbconfig.username, dbconfig.password, {
          roles: ["readWrite", "dbAdmin"]
        }, async function (err, result) {
          //db.close();
          if (err) {
            console.log('==============>Error while add user');
            console.log(err);
          } else {
            console.log('==============>Central db user added');

            require('../models');

            //create super admin
            const uuidv4 = require('uuid/v4');
            const md5 = require('md5');
            const User = require('../models/users.js');

            try {
              await User.Model.create({
                first_name: "admin",
                last_name: "admin",
                uuid: uuidv4(),
                role: "admin",
                password: md5("admin"),
                deleted: false,
                email: "admin@site.com",
                mobile: "9999999999",
                status: "active"
              });
              console.log('==============>Superadmin created');
            } catch (err) {
              console.log(err)
              console.log('==============>Superadmin create failed');
            };

            process.exit();
          }
        })
      } else {
        console.log('==============>central db and user already created');
        process.exit();
      }
    });
  } else {
    console.log('==============>Error while connect admin db');
    console.log(err);
  }
});