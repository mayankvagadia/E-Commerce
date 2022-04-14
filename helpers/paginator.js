var pagination = require('pagination');
module.exports = {
    /**This function are used for generate pagination data(without aggregate)
     * 
     * @param {type} models We need to pass database model object
     * @param {type} url Page url
     * @param {type} current_page Current index page
     * @param {type} row Per page records
     * @param {type} options Mongodb Query
     * @param {type} callback return callback
     * @returns {paginator,result}
     */

    /*Example of pagination options
     * var options={
     *              sort:{'name':-1},
     *              populate:['users,group'],//mulitple populate
     *              {select:"name _id created_on"},
     *              .......We can set more options...................
     *              }
     */
    getPagination: function (models, url, current_page, row, options, callback) {
        var page = 1;
        var offset = 0;
        if (current_page) {
            page = current_page;
            offset = (page - 1) * row;
        }
        //check any conditions or not
        var conditions = options.conditions === true ? {} : conditions = options.conditions;
        models.countDocuments(conditions).then(function (count) { //count query for limitations
            //generate pagination link
            var paginator = new pagination.SearchPaginator({
                prelink: url,
                current: page,
                rowsPerPage: row,
                totalResult: count
            });
            //Make query string based on array
            let QueryString = models.find(conditions).skip(offset).limit(row).lean();
            if (options.options) {
                for (var key in options.options) {
                    if (Array.isArray(options.options[key])) { //check value array or value
                        for (var i in options.options[key]) {
                            QueryString[key](options.options[key][i]);
                        }
                    } else {
                        QueryString[key](options.options[key]);
                    }
                }
            }
            //execute query string 
            QueryString.then(function (result) {
                paginator.render();
                callback({
                    "paginator": paginator,
                    result: result
                }); //return result
            }).catch(function (err) {
                console.log(err);
                callback(err);
            });
        }).catch(function (err) {
            console.log(err);
            callback(err);
        });
    },
    /**This function are used for generate pagination data(using aggregate)
     * 
     * @param {type} models We need to pass database model object
     * @param {type} url Page url
     * @param {type} current_page Current index page
     * @param {type} row Per page records
     * @param {type} options Mongodb aggregate Query
     * @param {type} callback return callback
     * @returns {paginator,result}
     */

    /*Example of aggregaet pagination options
     * 
     * var options=[{$match: conditions},
     *              {$lookup: {
     from: "users",
     localField: "_id",
     foreignField: "groups",
     as: "users"}},
     {$project: {'_id': 1,'group_name': 1,'users._id': 1,'deleted': 1,'created_on': 1}}, 
     {$sort: sort}
     .......We can set more options...................
     ]
     */
    getPaginationWithAggregate: function (models, url, current_page, row, options, callback) {
        var page = 1;
        var offset = 0;
        if (current_page) {
            page = current_page;
            offset = (page - 1) * row;
        }
        //return current aggregate results
        models.aggregate(options.concat({
            "$skip": offset
        }, {
            "$limit": row
        })).then(function (records) {
            var remove = ["$sort", "$project"]; //remove array for options
            var i = options.length;
            while (i--) {
                var objectKey = Object.keys(options[i]); //Get Key from current object
                (remove.includes(objectKey[0])) ? options.splice(i, 1): 0; //if key found then remove data
            }
            models.aggregate(options.concat({
                $group: {
                    _id: null,
                    count: {
                        $sum: 1
                    }
                }
            })).then(function (result) {
                var count = result.length === 0 ? 0 : result[0].count; //By defualt value 0
                var paginator = new pagination.SearchPaginator({ //generate pagination link
                    prelink: url,
                    current: page,
                    rowsPerPage: row,
                    totalResult: count
                });
                paginator.render();
                callback({
                    "paginator": paginator,
                    result: records
                });
            }).catch(function (err) {
                console.log(err);
                callback(err);
            });
        }).catch(function (err) {
            console.log(err);
            callback(err);
        });
    },

    /**This function are used for generate pagination data(using mongoDB core query)
     * 
     * @param {type} models We need to pass database model object
     * @param {type} url Page url
     * @param {type} current_page Current index page
     * @param {type} row Per page records
     * @param {type} options Mongodb aggregate Query
     * @param {type} callback return callback
     * @returns {paginator,result}
     */

    /*Example of aggregaet pagination options
     * 
     * var options=[{$match: conditions},
     *              {$lookup: {
     **/
    getRawQueryPagination: function (models, url, current_page, row, options, callback) {

        //return current aggregate results
        models.aggregate(options.concat({
            $group: {
                _id: null,
                count: {
                    $sum: 1
                }
            }
        })).then(function (result) {
            var count = result.length === 0 ? 0 : result[0].count; //By defualt value 0
            var paginator = new pagination.SearchPaginator({ //generate pagination link
                prelink: url,
                current: current_page,
                rowsPerPage: row,
                totalResult: count
            });
            paginator.render();
            callback(paginator);
        }).catch(function (err) {
            console.log(err);
            callback(err);
        });
    },
    /*
     * function for get pagination without database query
     */
    getPaginationData: function (count, url, current_page, row, callback) {

        //return current aggregate results        
        var paginator = new pagination.SearchPaginator({ //generate pagination link
            prelink: url,
            current: current_page,
            rowsPerPage: row,
            totalResult: count
        });
        paginator.render();
        callback(paginator);
    },
    /**
     * Function is used for get pagination for populate query
     */
    getPopulatePagination: function (models, url, current_page, row, options, callback) {
        var page = 1;
        var offset = 0;
        if (current_page) {
            page = current_page;
            offset = (page - 1) * row;
        }
        //check any conditions or not
        var conditions = options.conditions === true ? {} : conditions = options.conditions;
        models.countDocuments(conditions).then(function (count) { //count query for limitations
            //generate pagination link
            var paginator = new pagination.SearchPaginator({
                prelink: url,
                current: page,
                rowsPerPage: row,
                totalResult: count
            });
            //Make query string based on array
            let QueryString = models.find(conditions);
            if (typeof options.populate != 'undefined') {
                QueryString.populate(options.populate);
            }
            QueryString.skip(offset).limit(row);
            if (options.options) {
                for (var key in options.options) {
                    if (Array.isArray(options.options[key])) { //check value array or value
                        for (var i in options.options[key]) {
                            QueryString[key](options.options[key][i]);
                        }
                    } else {
                        QueryString[key](options.options[key]);
                    }
                }
            }
            //execute query string 
            QueryString.then(function (result) {
                paginator.render();
                callback({
                    "paginator": paginator,
                    result: result
                }); //return result
            }).catch(function (err) {
                console.log(err);
                callback(err);
            });
        }).catch(function (err) {
            console.log(err);
            callback(err);
        });
    },
}