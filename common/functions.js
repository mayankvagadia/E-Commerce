var path = require('path'); //The path module provides utilities for working with file and directory paths
var fs = require('fs'); //This module make file opertaion simple
var moment = require('moment');
var clone = require('clone'); // This module is use for deep clone of object.

global.getUtcTime = function (input_time, utc_offset, input_format, output_format) {
    var moment = require('moment');
    var m = moment(input_time, input_format);
    return m.add(convertUtcOffsetToMinute(utc_offset), 'minute').format(output_format);
};

global.getApplicationTime = function (input_time, utc_offset, input_format, output_format) {
    var moment = require('moment');
    var m = moment(input_time, input_format);
    return m.add(convertUtcOffsetToMinute(utc_offset) * -1, 'minute').format(output_format);
};

global.convertUtcOffsetToMinute = function (tz) {
    var offset = tz.split(":");
    offset[0] = parseInt(offset[0]);
    offset[1] = parseInt(offset[1]);
    var tz_minute = Math.abs(offset[0]) * 60 + Math.abs(offset[1]);
    if (offset[0] < 0) {
        tz_minute = tz_minute * -1;
    }
    return (tz_minute) * -1;
};
global.createLog = function (log_name) {
    return require('simple-node-logger').createRollingFileLogger({
        logDirectory: 'logs', // NOTE: folder must exist and be writable...
        fileNamePattern: log_name + '_<DATE>.log',
        dateFormat: 'YYYY_MM_DD',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    });
};

global.updateQueryStringParameter = function (uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
};
global.validateForm = function (req, validateObj, callback) {
    req.checkBody(validateObj);
    var errors = req.validationErrors();
    var error_res = {};
    if (errors) {
        for (inx in errors) {
            if (error_res[errors[inx].param] == undefined) {
                error_res[errors[inx].param] = errors[inx].msg;
            }
        }
    }
    callback(error_res);
};

global.validateFormForOrder = function (data, validateObj, callback) {
    var error_res = {};
    for (inx in validateObj) {
        if (data[inx] == undefined || data[inx] == null || data[inx] == "") {
            error_res[inx] = validateObj[inx].errorMessage;
        }
    }
    callback(error_res);
}

/**
 * Function to create dynamic logs on specified file name
 * @param  {string]} log_name ,log file name
 */
global.createLog = function (log_name) {
    return require('simple-node-logger').createRollingFileLogger({
        logDirectory: 'logs', // NOTE: folder must exist and be writable...
        fileNamePattern: log_name + '_<DATE>.log',
        dateFormat: 'YYYY_MM_DD',
        timestampFormat: 'YYYY-MM-DD HH:mm:ss'
    });
};

/**
 * Function to write error logs in file
 */
global.catchErrorLogs = function (error_message) {
    let error_log = createLog('catch_error_logs');
    error_log.info(error_message);
    return true;
};

var request_response_log = createLog('request_response_log');

global.createReqResLog = function (req, response, type) {
    request_response_log.info("Platform : " + req.get("platform"));
    request_response_log.info("Request URL: " + req.originalUrl);
    request_response_log.info("Request : ");
    request_response_log.info(req.body);
    request_response_log.info("Response " + type + " : ");
    request_response_log.info(response);
    request_response_log.info("---------------------------------");
}


/**
 * Send Error Response
 */
global.sendErrorMsg = function (req, res, message_id, data = null, callback) {
    var status_code = 403;
    var response = {
        type: "error",
        'data': {}
    };
    if (message_id != null) {
        response['message'] = config.flashMessages[message_id];
        response['code'] = parseInt(message_id);
    }
    if (data != null && data.err != undefined) {
        response['message'] = data.err.message;
        if (data.err.error_user_title != undefined) {
            response['message'] = data.err.error_user_title;
        }
        if (data.err.error_user_msg != undefined) {
            response['message'] = response['message'] + " : " + data.err.error_user_msg;
        }
        console.log(data.err)
        delete data.err;
    }
    if (data != null && data.custom_message != undefined) {
        response['message'] = data.custom_message;
        delete data.custom_message;
    }
    if (data != null && data.validationErrors != undefined) {
        response['errors'] = data.validationErrors;
        status_code = 400;
        delete data.validationErrors;
    }
    if (data != null) {
        response['data'] = data;
    }
    if (response['message'] == undefined || response['message'] == "") {
        response['message'] = "Something went wrong";
    }
    createReqResLog(req, response, 'Error');
    res.status(status_code).json(response);
};

/**
 * Send Success Response
 */
global.sendSuccessMsg = function (req, res, message_id, data = null, callback) {
    var response = {
        type: "success",
        'data': {},
        message: config.flashMessages[message_id],
        code: parseInt(message_id)
    };
    if (data != null) {
        response['data'] = data;
    }
    if (response['data']['long_message'] != undefined && response['data']['long_message'] != "") {
        response['long_message'] = response['data']['long_message'];
        delete response['data']['long_message'];
    }
    createReqResLog(req, response, 'Success');
    res.status(200).json(response);
};

global.isValidApiUser = function (req, res, callback) {
    if (req.body != undefined) {
        if (req.body.auth_token != undefined) {
            const User = require('../models/users.js');
            User.Model.findOne({
                uuid: req.body.auth_token
            }, "-updated_on -created_on -password").then(function (users) {
                if (users) {
                    users = users.toObject();
                    if (users["deleted"] == 0) {
                        if (users["status"] == "active") {
                            if (users["role"] == "user") {
                                req.user = users;
                                callback();
                            } else {
                                return sendErrorMsg(req, res, "017");
                            }
                        } else {
                            return sendErrorMsg(req, res, "013");
                        }
                    } else {
                        return sendErrorMsg(req, res, "011");
                    }
                } else {
                    return sendErrorMsg(req, res, "014");
                }
            }).catch(function (err) {
                return sendErrorMsg(req, res, null, {
                    err: err
                });
            });
        } else {
            return sendErrorMsg(req, res, "016");
        }
    } else {
        return sendErrorMsg(req, res, "015");
    }
};

/**
 * if object is empty then it will return true otherwise false.
 * @param {Object} obj 
 * @returns return true if object is empty.
 */
global.isEmptyObject = function(obj){
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false
        }
    }
    return true
}
