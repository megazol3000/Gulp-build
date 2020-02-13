//Подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

//Порядок подключения css файлов
const cssFiles = [
   './src/css/bootstrap-grid.min.css',
   './src/css/fonts.css',
   './src/css/main.css'
]

//Порядок подключения js файлов
const jsFiles = [
   './src/js/script.js'
]

//Таск на стили CSS
function styles() {
   //Всей файлы по шаблону './src/css/**/*.css'
   return gulp.src('./src/css/**/*.css')
   //Объединение файлов в один
   .pipe(concat('style.css'))
   //Добавить префиксы
   .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
   }))
   //Минификация CSS
   .pipe(cleanCSS({
      level: 2
   }))
   //Выходная папка для стилей
   .pipe(gulp.dest('./build'))
   .pipe(browserSync.stream());
}

//Таск на сжатие картинок
function imgmin() {
   return gulp.src('./src/img/**')
   .pipe(imagemin({
      progressive : true
   }))
   .pipe(gulp.dest('./build/img/'))
}

//Таск на скрипты JS
function scripts() {
   //Всей файлы по шаблону './src/js/**/*.js'
   return gulp.src('./src/js/**/*.js')
   //Объединение файлов в один
   .pipe(concat('script.js'))
   //Минификация JS
   .pipe(uglify({
      toplevel: true
   }))
   //Выходная папка для скриптов
   .pipe(gulp.dest('./build/js'))
   .pipe(browserSync.stream());
}

//Удалить всё в указанной папке
function clean() {
   return del(['build/*'])
}

//Просматривать файлы
function watch() {
   browserSync.init({
      server: {
          baseDir: "./"
      }
   });
   //Следить за CSS файлами
   gulp.watch('./src/css/**/*.css', styles)
   //Следить за JS файлами
   gulp.watch('./src/js/**/*.js', scripts)
   //Следить за добавлением картинок
   gulp.watch('./src/img/**', imgmin)
   //При изменении HTML запустить синхронизацию
   gulp.watch("./*.html").on('change', browserSync.reload);
}

//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск сжатия картинок
gulp.task('imgmin', imgmin);
//Таск для очистки папки build
gulp.task('clean', clean);
//Таск для отслеживания изменений
gulp.task('watch', watch);
//Таск для удаления файлов в папке build и запуск styles, imgmin и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts,imgmin)));
//Таск запускает таск build и watch последовательно
gulp.task('dev', gulp.series('build','watch'));