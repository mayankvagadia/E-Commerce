global.config = require('./config/config.js');
var express = require('express');
var path = require('path');
var fs = require('fs');
require('./models');
require("./common/functions");

// smtp configurations
const settingsModel = require('./models/settings.js');
settingsModel.getSettingsDataWithoutId().then(data => {
  if (data) {
    config.settings = data[0].toObject();
  }
}).catch(err => {
  catchErrorLogs('error to load settings models.');
  catchErrorLogs(err);
  console.log("error to load settings models");
});

var app = express();
/**
 * Including cron job for queue mail
 */
if (config.all_scheduler == 'on') {
  var setCronJob = function (time_string, file_path, other = null) {
    eval(fs.readFileSync('./shell/' + file_path) + '');
  };
  for (i in config.schedulers) {
    if (config.schedulers[i].active) {
      console.log(i);
      if (config.schedulers[i].other != undefined) {
        setCronJob(config.schedulers[i].time, config.schedulers[i].file, config.schedulers[i].other);
      } else {
        setCronJob(config.schedulers[i].time, config.schedulers[i].file);
      }
    }
  }
}

module.exports = app;