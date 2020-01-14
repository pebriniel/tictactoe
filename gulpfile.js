// import de gulp et del (qui n'est pas un plugin gulp)
var gulp = require('gulp');

// Include plugins
var concat = require('gulp-concat');
var rename = require('gulp-rename'); //sera $.rename()
var uglify = require('gulp-uglify');
var $ = require('gulp-load-plugins')({ lasy: true });

// Variables de chemins
var source = './src'; // dossier de travail
var destination = './dist'; // dossier à livrer


///////////////////////////////////////////////////
//  CSS
///////////////////////////////////////////////////

// transformation de nos sources scss en css
gulp.task('css', function () {

    return gulp.src(source+'/scss/app.scss') // fichiers sources
        .pipe($.sass({ // transformation du sass en css
            outputStyle: 'nested',
            precision: 5,
        }))
        .pipe(rename('app.css')) // renommage du fichier
        .pipe(gulp.dest(destination+'/assets/css')) // copie du fichier dans sa destination
        .pipe(rename('app.min.css')) // renommage du flux avec .min
        .pipe($.csso()) // minification du css
        .pipe(gulp.dest(destination+'/assets/css')); // copie du fichier dans sa destination
});

///////////////////////////////////////////////////
//  JavaScript
///////////////////////////////////////////////////

gulp.task('js', function() {
    return gulp.src([
            'src/js/**/**/*.js'
        ])
        .pipe(concat('app.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(destination+'/assets/js'));
});


gulp.task('default', ['css', 'js'], function () {
    gulp.watch('src/scss/**/*', ['css']);
    gulp.watch('src/js/**/*', ['js']);

});
