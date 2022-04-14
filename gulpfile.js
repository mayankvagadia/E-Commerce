var gulp = require('gulp'),
    compressor = require('node-minify'),
    spawn = require('child_process').spawn,
    //browserSync = require('browser-sync').create(),
    node;

require('custom-env').env()
/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', async function () {
    if (node) {
        node.kill();
    }
    process.env['TIMESTAMP'] = Math.round(new Date().getTime() / 1000);
    node = spawn('node', ['bin/www'], {
        stdio: 'inherit'
    })
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
})

/**
 * $ gulp minifyjs
 * description: start the development environment
 */
gulp.task('minifyjs', async function () {
    var application_files = ['./public/js/common/*.js', './public/js/page_wise/*.js'];
    var application_output = {
        combined: './public/js/application.js',
        minified: './public/js/application.min.js'
    };
    compressor.minify({
        compressor: 'no-compress',
        input: application_files,
        output: application_output.combined,
        callback: function (err, min) {
            if (!err) {
                console.log("\x1b[33mPagewise JS Concatenation done\x1b[0m");
            }
        }
    });
});
/**
 * $ gulp compress minifyjs
 * description: start the production environment
 */
gulp.task('compress_minifyjs', async function () {
    var application_output = {
        combined: './public/js/application.js',
        minified: './public/js/application.min.js'
    };
    if (process.env['APP_ENV'] == 'production') {
        compressor.minify({
            compressor: 'gcc',
            options: {
                compilation_level: 'ADVANCED_OPTIMIZATIONS'
            },
            input: application_output.combined,
            output: application_output.minified,
            callback: function (err, min) {
                if (!err) {
                    console.log("\x1b[33mPagewise JS Compression done\x1b[0m");
                }
            }
        });
    } else {
        console.log("\x1b[33mUsing development environment.\nPagewisw js compression cancel.\x1b[0m");
    }
});
/**
 * $ gulp minifyvendor
 * description: start the development environment
 */
gulp.task('minifyvendor', async function () {
    var vendor_files = [
        "./public/vendor/jquery/jquery_ui/jquery-ui.js",
        "./public/vendor/plugins/history/jquery.history.js",
        "./public/vendor/plugins/history/history.adapter.jquery.js",
        "./public/vendor/plugins/sparkline/jquery.sparkline.js",
        "./public/vendor/plugins/circles/circles.js",
        "./public/vendor/plugins/form/ajax_submit.js",
        "./public/vendor/plugins/sweetalert/dist/sweetalert.js",
        "./public/vendor/plugins/pnotify/pnotify.js",
        "./public/vendor/plugins/ladda/ladda.js",
        "./public/vendor/plugins/magnific/jquery.magnific-popup.js",
        "./public/vendor/plugins/nprogress/nprogress.js",
        "./public/vendor/plugins/jquery-steps/jquery.steps.min.js",
        "./public/vendor/plugins/select2/select2.min.js",
        "./public/vendor/plugins/daterange/moment.min.js",
        "./public/vendor/plugins/daterange/daterangepicker.js",
        "./public/vendor/plugins/duallistbox/jquery.bootstrap-duallistbox.min.js",
        "./public/vendor/plugins/papaparse/papaparse.js",
        "./public/vendor/plugins/tagsinput/tagsinput.min.js",
        "./public/vendor/plugins/datatables/media/js/jquery.dataTables.js",
        "./public/vendor/plugins/datatables/media/js/dataTables.bootstrap.js",
        "./public/vendor/plugins/datepicker/js/bootstrap-datetimepicker.js",
        "./public/vendor/plugins/dateformat/dist/jquery.formatDateTime.min.js",
        "./public/vendor/plugins/typeahead/typeahead.bundle.min.js",
        "./public/vendor/plugins/livequery/livequery.js",
        "./public/vendor/plugins/blockui/blockui.js",
        "./public/vendor/plugins/highcharts/chart.js",
        "./public/vendor/plugins/highcharts/chart_more.js",
        "./public/vendor/plugins/socketio/socket.io.js",
        "./public/vendor/plugins/bstimeout/bs-timeout.min.js",
        "./public/assets/admin-tools/admin-forms/js/jquery.validate.min.js",
        "./public/assets/js/utility/utility.js",
        "./public/assets/js/demo/demo.js",
        "./public/assets/js/main.js",
        "./public/assets/js/demo/widgets.js",
    ];

    var vendor_output = {
        combined: './public/js/vendors.js',
        minified: './public/js/vendors.min.js'
    };
    compressor.minify({
        compressor: 'no-compress',
        input: vendor_files,
        output: vendor_output.combined,
        callback: function (err, min) {
            if (!err) {
                console.log("\x1b[33mVendor JS files concatenation completed.\x1b[0m");
            }
        }
    });
});
/**
 * $ gulp compress minifyvendor
 * description: start the production environment
 */
gulp.task('compress_minifyvendor', async function () {
    var vendor_output = {
        combined: './public/js/vendors.js',
        minified: './public/js/vendors.min.js'
    };
    if (process.env['APP_ENV'] == 'production') {
        compressor.minify({
            compressor: 'uglifyjs',
            input: vendor_output.combined,
            output: vendor_output.minified,
            callback: function (err, min) {
                if (!err) {
                    //var newTotalSize = fs.statSync(vendor_output.combined).size
                    console.log("\x1b[33mVendor file compression completed.\x1b[0m")
                    //console.log("\x1b[33mFiles : '" + vendor_output.combined + "',\nSize total : '" + (newTotalSize) + "',\nSaved size '" + (100 - (newTotalSize * 100 / totalSize)) + "%' \x1b[0m")
                } else {
                    console.log("Error while compressing vendors(js) file.");
                }
            }
        });
    } else {
        console.log("\x1b[33mUsing development environment.\nVendor js compression cancel.\x1b[0m");
    }
});
/**
 * $ gulp watch
 * description: task watch in required files
 */
gulp.task('watch', async function () {
    gulp.watch([
        './public/js/common/custom.js',
        './public/js/page_wise/*.js'
    ], gulp.parallel('minifyjs'));

    gulp.watch([
        './helpers/*.js',
        './routes/*.js',
        './routes/admin/*.js',
        './models/*.js',
        './config/config.js',
        './app.js'
    ], gulp.parallel('server'));
});
/**
 * $ gulp default
 * description: start tasks in series
 */
gulp.task('default', gulp.series('minifyjs', 'compress_minifyjs', 'minifyvendor', 'compress_minifyvendor', 'server', 'watch'));
gulp.task('only_minify', gulp.series('minifyjs', 'compress_minifyjs', 'minifyvendor', 'compress_minifyvendor'));

// clean up if an error goes unhandled.
process.on('exit', function () {
    if (node) {
        node.kill();
    }
});