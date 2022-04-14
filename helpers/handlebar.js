var block_script = {};
var block_css = {};
var Handlebars = require('handlebars');
var helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});
var String = require('string');
var moment = require('moment');

module.exports = {
    defaultLayout: 'default',
    extname: '.hbs',
    // Specify helpers which are only registered on this instance.
    helpers: {
        /**
         * helper function for debug view variables into server log
         * @param  {string}
         * @return {null|void}
         */
        debug: function (data) {
            console.log(data);
        },
        select: function (selected, option) {
            return (selected == option) ? 'selected="selected"' : '';
        },
        checked: function (value, test) {
            if (value == undefined) return '';
            //if (test == undefined && value) return 'checked'
            return value == test ? 'checked' : '';
        },
        /**
         * retrieve script from_block script var and add into layout at given position
         * @param  {string}
         * @return {string}
         */
        retrieve_script: function (position) {
            var str = "";
            if (typeof block_script[position] != 'undefined') {
                for (i = 0; i < block_script[position].length; i++) {
                    str += '<script src="' + block_script[position][i] + '"></script>'
                }
                block_script[position] = [];
            }
            return new Handlebars.SafeString(str);
        },
        /**
         * retrieve increment by 1
         * @param  {number}
         * @return {number}
         */
        add_one: function (number, options) {
            if (typeof (number) === 'undefined' || number === null)
                return null;

            // Increment by inc parameter if it exists or just by one
            return number + (options.hash.inc || 1);
        },
        /**
         * retrieve script from_block script var and add into layout at given position
         * @param  {string}
         * @return {string}
         */
        retrieve_css: function (position) {
            var str = "";
            if (typeof block_css[position] != 'undefined') {
                for (i = 0; i < block_css[position].length; i++) {
                    str += '<link rel="stylesheet" href="' + block_css[position][i] + '" />'
                }
                block_css[position] = [];
            }
            return new Handlebars.SafeString(str);
        },
        /**
         * load javascript file into perticular position
         * @param  {string} position idetifier
         * @param  {string|array} set of sript path
         * @return {null}
         */
        load_script: function () {
            var args = [];
            for (i in arguments) {
                if (typeof arguments[i] == "string")
                    args.push(arguments[i]);
            };
            var position = args.shift();
            if (typeof block_script[position] == 'undefined') {
                block_script[position] = [];
            }
            block_script[position] = block_script[position].concat(args);
        },
        /**
         * load javascript file into perticular position
         * @param  {string} position idetifier
         * @param  {string|array} set of sript path
         * @return {null}
         */
        load_css: function () {
            var args = [];
            for (i in arguments) {
                if (typeof arguments[i] == "string")
                    args.push(arguments[i]);
            };
            var position = args.shift();
            if (typeof block_css[position] == 'undefined') {
                block_css[position] = [];
            }
            block_css[position] = block_css[position].concat(args);
        },
        /**
         * Return path of role base partial
         * @param  {string} path of partial element
         * @param  {string} role name which is equivalent to partial file name
         * @return {string} return full path based on passed role
         */
        role_base_partial: function (path, name) {
            return path + name;
        },
        /**
         * Helper for comparision left and right value
         * @param  {any}
         * @param  {any}
         * @param  {object} options for comparision
         * @return {[type]}
         */
        compare: function (lvalue, rvalue, options) {
            if ((typeof lvalue === 'object' || lvalue instanceof Object) && (lvalue != null && lvalue != "")) {
                lvalue = lvalue.toString();
            }
            if ((typeof rvalue === 'object' || rvalue instanceof Object) && (rvalue != null && rvalue != "")) {
                rvalue = rvalue.toString();
            }
            if (arguments.length < 3)
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

            // if operator not set then take == for comparision
            var operator = options.hash.operator || "==";

            var operators = {
                '==': function (l, r) {
                    return l == r;
                },
                '===': function (l, r) {
                    return l === r;
                },
                '!=': function (l, r) {
                    return l != r;
                },
                '<': function (l, r) {
                    return l < r;
                },
                '>': function (l, r) {
                    return l > r;
                },
                '<=': function (l, r) {
                    return l <= r;
                },
                '>=': function (l, r) {
                    return l >= r;
                },
                'typeof': function (l, r) {
                    return typeof l == r;
                }
            }

            if (!operators[operator])
                throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

            var result = operators[operator](lvalue, rvalue);

            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        /**
         * Converts a tring into special case.
         * @param  {string} sting which you want to convert into special case
         * @param  {string} name of special case
         * @return {string} converted string
         */
        string: function (string, method) {
            return new Handlebars.SafeString(String(string)[method]().s);
        },
        /**
         * Display Flash meesage on View
         * @param  {object} object of flash message
         * @return {string} HTML safestring in javascript tag
         */
        flash_me: function (data) {
            var str = '<script>$(function () { new PNotify({ ';
            str += '  text: "' + data.message + '", ';
            str += '  shadow: true, ';
            str += '  type: "' + data.type + '", ';
            str += '  stack: {dir1: "down", dir2: "left", push: "top", spacing1: 10, spacing2: 10 }, ';
            str += '  width: "250px", ';
            str += '  delay: 1400 ';
            str += '  }); ';
            str += "});</script>";
            return new Handlebars.SafeString(str);
        },
        escape: function (variable) {
            if (typeof variable == 'undefined') {
                return '';
            }
            return new String(variable).replace(/(['"])/g, '\\$1');
        },
        //temp date formate function
        dateFormat: function (input_time, format, options) {
            var time_zone = config.default_time_zone;
            return new Handlebars.SafeString(moment(input_time).utcOffset(time_zone).format(format));
        },
        //convert data base date to company date
        dbToCompanyDate: function (input_time, format, options) {
            var time_zone = config.default_time_zone;
            return new Handlebars.SafeString(moment(input_time).utcOffset(time_zone).format(format));
        },
        //convert data base date to custome date by time zone
        dbDateToCustom: function (input_time, format, time_zone, options) {
            if (time_zone == '') {
                time_zone = config.default_time_zone;
            }
            return new Handlebars.SafeString(moment(input_time).utcOffset(time_zone).format(format));
        },
        //convert date to custome date by time zone
        customDateFormat: function (input_time, utc_offset, input_format, output_format, options) {
            if (utc_offset == '') {
                utc_offset = config.default_time_zone;
            }
            var m = moment(input_time, input_format);
            return m.add(convertUtcOffsetToMinute(utc_offset) * -1, 'minute').format(output_format);
        },
        //convert database time to company time
        dbToCompanyTime: function (input_time, input_format, output_format, options) {
            var time_zone = config.default_time_zone;
            var m = moment(input_time, input_format);
            return m.add(convertUtcOffsetToMinute(time_zone) * -1, 'minute').format(output_format);
        },
        withItem: function (object, options) {
            return options.fn(object[options.hash.key]);
        },
        html_decoder: function (text) {
            return unescape(text).replace(/&amp;/g, '&');
        },
        times: function (n, incremental, block) {
            var accum = '';
            for (var i = 0; i < n;) {
                i = i + incremental
                accum += block.fn(i);
            }
            return accum;
        },
        /**
         * lead_access helper return true if user has given access based on access level
         * access can be "viewable","editable" and "deleteable"
         * @param {string} access
         * @param {string} user_id
         * @returns {boolean}
         */
        lead_access: function (access, user_id, options) {
            var user_session = options.data.root.user_session;
            var user_access = user_session.user_preferences.lead_access;
            if (access == 'deleteable') {
                if (['admin', 'super_admin'].indexOf(user_session.role) >= 0 || user_session.id == user_id || user_access == 'full_access') {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            }

            if (user_session.id == user_id || ['admin', 'super_admin'].indexOf(user_session.role) >= 0) {
                user_access = 'full_access';
            } else if (user_session.role == 'manager') {
                user_access = 'read_write';
            }
            var access_mapping = {
                full_access: ['editable', 'readable', 'deleteable'],
                read_write: ['editable', 'readable'],
                read_only: ['readable']
            };
            if (typeof access_mapping[user_access] != 'undefined' && access_mapping[user_access].indexOf(access) >= 0) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        /**
         * take_action helper return true if user has given access for take action
         * @param {string} user_id
         * @returns {boolean}
         */
        lead_operation_access: function (operation, user_id, options) {
            var user_session = options.data.root.user_session;
            var user_access = user_session.user_preferences[operation];
            if (user_session.id == user_id || ['admin', 'super_admin'].indexOf(user_session.role) >= 0 || user_access == 'yes') {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        ifIn: function (elem, list, options) {
            if (typeof list == 'string') {
                list = list.split(',');
            }
            if (list != undefined) {
                if (list.indexOf(elem) > -1) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            } else {
                return options.inverse(this);
            }
        },
        has_user_role: function (role, options) {
            var roles = JSON.parse(role);
            if (roles.indexOf(options.data.root.user_session.role) >= 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        aggregate_role_base_access: function (action, options) {
            var actions = action.split(',');
            var access_list = options.data.root.access_list;

            var role = options.data.root.user_session.role;

            if (options.data.root.user_session.actual_role != undefined) {
                role = options.data.root.user_session.actual_role
            }

            for (var i in actions) {
                if (typeof access_list[actions[i]] != 'undefined' && access_list[actions[i]].indexOf(role) >= 0) {
                    return options.fn(this);
                }
            }
            return options.inverse(this);
        },
        /**
         * display_pagination helper return html for pagination
         * @param {object} pagination
         * @param {boolean} (optional) display_couter display_couter for display counter or not
         * @returns {string} html for pagination
         */
        pagination: function (pagination, display_couter) {

            if (typeof pagination != 'object' || Object.keys(pagination).length <= 0) {
                return '';
            }

            if (typeof display_couter != 'boolean') {
                display_couter = true;
            }

            var result = pagination._result;
            var options = pagination.options;

            var html = '';

            if (result.totalResult <= 0) {
                return '';
            }

            if (display_couter) {
                html = '<div class="pull-right mt10"><small class="total_page_record" data-record="' + result.totalResult + '">Display ' + result.fromResult + ' to ' + result.toResult + ' records out of ' + result.totalResult + '</small></div>';
            }

            var i, len, prelink;
            html += '<div><ul class="pagination">';
            if (result.pageCount < 2) {
                html += '</ul></div>';
                return html;
            }

            prelink = pagination.preparePreLink(result.prelink.replace('page=' + result.current, ''));

            if (result.first) {
                html += '<li><a class="ajax_pagination" href="' + prelink + result.first + '">' + options.translator('FIRST') + '</a></li>';
            } else {
                html += '<li class="disabled"><a>' + options.translator('FIRST') + '</a></li>';
            }

            if (result.previous) {
                html += '<li><a class="ajax_pagination" href="' + prelink + result.previous + '">' + options.translator('PREVIOUS') + '</a></li>';
            } else {
                html += '<li class="disabled"><a>' + options.translator('PREVIOUS') + '</a></li>';
            }
            if (result.range.length) {
                for (i = 0, len = result.range.length; i < len; i++) {
                    if (result.range[i] === result.current) {
                        html += '<li class="active"><a href="#">' + result.range[i] + '</a></li>';
                    } else {
                        html += '<li><a class="ajax_pagination" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                    }
                }
            }

            if (result.next) {
                html += '<li><a href="' + prelink + result.next + '" class="paginator-next ajax_pagination">' + options.translator('NEXT') + '</a></li>';
            } else {
                html += '<li class="disabled"><a class="paginator-next">' + options.translator('NEXT') + '</a></li>';
            }

            if (result.last) {
                html += '<li><a class="ajax_pagination" href="' + prelink + result.last + '">' + options.translator('LAST') + '</a></li>';
            } else {
                html += '<li class="disabled"><a>' + options.translator('LAST') + '</a></li>';
            }

            html += '</ul></div>';

            return new String(html);
        },
        modulo: function (lvalue, rvalue, options) {
            if (lvalue % rvalue == 0) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        time_date: function (date, time) {
            return moment(moment(date).format('MM-DD-YYYY') + ' ' + time, 'MM-DD-YYYY HH:mm:ss');
        },
        /**
         * TO multiply two numbers
         * @param {number} a
         * @param {number} b
         * @returns {Number}
         */
        multiply: function (a, b) {
            return parseFloat(Number(a) * Number(b));
        },
        json: function (content) {
            return JSON.stringify(content);
        },
        concat: function() {
            arguments = [...arguments].slice(0, -1);
            return arguments.join(' ');
        }
    }
};
