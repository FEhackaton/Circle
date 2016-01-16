var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');

gulp.task('browser-sync', function() {
    browserSync.init(['*.*'], {
        //server: "bin/www",
        proxy:'http://localhost:3000'

    });
    gulp.watch("public/**/*.*").on('change', browserSync.reload);
    gulp.watch("*.*").on('change', browserSync.reload);
    gulp.watch("views/*.*").on('change', browserSync.reload);
});
gulp.task('default', ['browser-sync']);
