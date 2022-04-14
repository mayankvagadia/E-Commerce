var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var soap = require('soap');
var app = express();


app.use(bodyParser.json({
    limit: '50mb',
    parameterLimit: 1000000
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
    parameterLimit: 1000000
}));

app.use(function (req, res) {

    soap.createClient("ApiServiceWsdl/APIService.wsdl", function (err, client) {
        if (err) {
            console.log("==================");
            console.log(err);
            console.log("==================");
            res.send(err);
            return;
        }
        if (req.body.api == "searchFilter") {
            delete req.body.api;
            client.getNewNumberSearchFilters(req.body, function (err, result) {
                if (err) {
                    res.send({
                        type: "error",
                        error: err
                    });
                    return;
                }
                if (result) {
                    res.send({
                        type: "success",
                        result: result
                    });
                    return;
                }
            });
        } else if (req.body.api == "searchNumber") {
            delete req.body.api;
            client.searchNumbers(req.body, function (err, result) {
                if (err) {
                    res.send({
                        type: "error",
                        error: err
                    });
                    return;
                }
                if (result) {
                    res.send({
                        type: "success",
                        result: result
                    });
                    return;
                }
            });
        } else if (req.body.api == "placeOrder") {
            delete req.body.api;
            client.placeOrder(req.body, function (err, result) {
                if (err) {
                    res.send({
                        type: "error",
                        error: err
                    });
                    return;
                }
                if (result) {
                    res.send({
                        type: "success",
                        result: result
                    });
                    return;
                }
            });
        } else if (req.body.api == "orderStatus") {
            delete req.body.api;
            client.getOrderStatus(req.body, function (err, result) {
                if (err) {
                    res.send({
                        type: "error",
                        error: err
                    });
                    return;
                }
                if (result) {
                    res.send({
                        type: "success",
                        result: result
                    });
                    return;
                }
            });
        }
    });


});


var port = normalizePort(80);
app.set('port', port);
var server = http.createServer(app);
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
