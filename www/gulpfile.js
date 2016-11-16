/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require('gulp');

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'bower-files'],
    replaceString: /\bgulp[\-.]/
});

var paths = {
    utilities: "js/utilities/",
    controllers: "js/controllers/*.js",
    services: "js/services/*.js",
    target: "target/",
    bower: "bower_components/",
    semantic: "semantic/dist/"
};


//Libraries
gulp.task('librariesJS', function () {
    var files = plugins.bowerFiles().ext('js').files;
    files.push(paths.semantic + '*.min.js');
    files.push(paths.bower + 'jquery-filestyle/src/*.min.js');

    console.info(files);
    gulp.src(files)
            .pipe(plugins.concat('libraries.min.js'))
            .pipe(plugins.uglify().on('error', function (e) {
                console.log(e);
            })).pipe(gulp.dest(paths.target + 'js/libs'));

});

gulp.task('librariesCSS', function () {
    var files = plugins.bowerFiles().ext('css').files;
    files.push(paths.semantic + '*.min.css');
    files.push(paths.bower + 'jquery-filestyle/src/*.min.css');
    console.info(files);
    gulp.src(files)
            .pipe(plugins.concatCss('libraries.min.css'))
            .pipe(plugins.uglifycss())
            .pipe(gulp.dest(paths.target + 'css/libs'));


});

gulp.task('utilitiesJS', function () {
    var files = [];
    files.push(paths.utilities + 'handlerKO/*.js');
    files.push(paths.utilities + '*.js');

    console.info(files);
    gulp.src(files)
            .pipe(plugins.concat('utilities.min.js'))
            .pipe(plugins.uglify().on('error', function (e) {
                console.log(e);
            })).pipe(gulp.dest(paths.target + 'js/utilities'));

});

gulp.task('fonts', ['librariesCSS'], function () {

    gulp.src(paths.bower + '/components-font-awesome/fonts/**.*') 
            .pipe(gulp.dest(paths.target + 'css/components-font-awesome/fonts'));

    gulp.src(paths.semantic + '/themes/default/assets/fonts/*') 
            .pipe(gulp.dest(paths.target + paths.semantic + '/themes/default/assets/fonts'));

    gulp.src(paths.semantic + '/themes/default/assets/images/*') 
            .pipe(gulp.dest(paths.target + paths.semantic + '/themes/default/assets/images'));

});

gulp.task('controllers', function () {
    gulp.src(paths.controllers)
            .pipe(plugins.concat('controllers.min.js'))
            .pipe(plugins.order([
                '*'
            ]))
            .pipe(plugins.uglify({
                mangle: false
            }).on('error', function (e) {
                console.log(e);
            })).pipe(gulp.dest(paths.target + 'js/controllers'));

});

gulp.task('services', function () {
    gulp.src(paths.services)
            .pipe(plugins.concat('services.min.js'))
            .pipe(plugins.order([
                '*'
            ]))
            .pipe(plugins.uglify().on('error', function (e) {
                console.log(e);
            })).pipe(gulp.dest(paths.target + 'js/services'));

});

gulp.task('default', ['librariesJS', 'librariesCSS', 'utilitiesJS', 'fonts', 'controllers', 'services']);

gulp.task('watch', function () {
    var watcher = gulp.watch(paths.controllers, ['controllers']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type);
    });

    var watcher = gulp.watch(paths.services, ['services']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type);
    });
});


