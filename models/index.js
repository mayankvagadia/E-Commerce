/**
 * Script for load db and models
 */
//DB library
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let dbConfig = config['datasource'];

//create database connection and compile model schema
let options = {
  useUnifiedTopology: true,
  user: dbConfig.username,
  pass: dbConfig.password,
  socketTimeoutMS: 0,
  connectTimeoutMS: 0,
  useNewUrlParser: true
};
let connUri = 'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.database;
global.db = mongoose.createConnection(connUri, options);