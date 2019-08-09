const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');

// компилировать код в CSS
function style() {
	// 1. путь к CSS
	return gulp.src('./scss/**/*.scss')
	// 2. перекидывать через SASS
	.pipe(sass().on('error', sass.logError))
	// 3. куда сохранять компиилируемый код
	.pipe(gulp.dest('./css'))
	// 4. browser sync
	.pipe(browserSync.stream());
}
//compress js
gulp.task('compress', function () {
  return pipeline(
        gulp.src('script/*.js'),
        uglify(),
        gulp.dest('script')
  );
});
//babel
gulp.task('babel', () =>
    gulp.src('script/main.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('script'))
);
//imageMin
gulp.task('imagemin', () =>
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('img'))
);
//autoPrefix
gulp.task('autoprefix', () =>
    gulp.src('css/style.css')
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))
);
//CSS MIN
gulp.task('cssmin', function () {
    gulp.src('css/**/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css'));
});

function watch() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});
	gulp.watch('./scss/**/*.scss', style);
	gulp.watch('./*.html').on('change', browserSync.reload);
	gulp.watch('./script/**/*.js').on('change', browserSync.reload);
}
exports.style = style;
exports.watch = watch;