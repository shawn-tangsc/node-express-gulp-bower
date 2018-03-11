const gulp = require('gulp'),
     connect = require('gulp-connect');
const browserSync = require('browser-sync').create();
const minifycss=require('gulp-minify-css');
const reload = browserSync.reload;
//编译sass
const sass = require('gulp-sass');
//自动补全前缀：web-kit之类的
const autoprefixer = require('gulp-autoprefixer');
//显示报错信息和报错后不终止当前gulp任务
const notify = require('gulp-notify');
//
const stripCssComments = require('gulp-strip-css-comments');
//所以这个插件可以阻止 gulp 插件发生错误导致进程退出并输出错误日志
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const cssbeautify = require('cssbeautify');
const mapStream = require('map-stream');
//设置输出到终端的颜色
const colors = require('colors');
const minimatch = require('minimatch');
const path = require('path');
// var exphbs  = require('express-handlebars');
const logSymbols = require('log-symbols');

const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps =require('gulp-sourcemaps');


// 指定要编译的目录
const watchScssFilesPath = ['./src/sass/*.scss','./src/sass/*/*.scss'];
const watchJsFilesPath = ['./src/js/**/*.js'];

// 编译成功通知开关
const successNotify = false;

//这个可以让express启动
/**
 * 通过nodemon启动express，
 * NODE_ENV设置环境变量
 *
 */
gulp.task("node", function() {
    nodemon({
        script: './bin/www',
        ext: 'js html',
        env: {
            'NODE_ENV': 'uat'
        }
    })
});


gulp.task('browserSync', ["node"], function() {
    var files = ['./public/js/*.js','./public/js/*/*.js','./views/*.html'];

    //gulp.run(["node"]);
    browserSync.init(files, {
        proxy: 'http://localhost:4000',
        browser: 'chrome',
        notify: false,
        port: 4001
    });

    gulp.watch(watchScssFilesPath, ['styles']);
    // gulp.watch(watchJsFilesPath, ['scripts']);
    gulp.watch(files).on("change", reload);
});


gulp.task('scripts',function(){
    return gulp.src(watchJsFilesPath)
        .pipe(plumber({
            errorHandler: reportError
        }).on('error',function(e){
            console.log(e);
        }))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(gulp.dest("views/public/js"))
        .pipe(uglify())
        .pipe(rename(function(path){
            path.basename += '.min';
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("views/public/js"))
        // 编译成功后的提示（频繁提示会有点烦人，可将successNotify设置为：false关闭掉）
        .pipe(notify(function(file) {
            return successNotify && 'es6=>es5 编译成功！';
        }))
        .pipe(reload({stream: true}));;
})

// 将.scss/.sass文件实时转变为.css文件
gulp.task('styles', function() {
    return gulp.src(watchScssFilesPath)
        .pipe(plumber({
            errorHandler: reportError
        }).on('error',function(e){
            console.log(e);
        }))
        .pipe(sourcemaps.init())
        .pipe(mapStream(function(file, cb) {
            logPath(file);
            cb(null, file);
        }))
        .pipe(sass().on('error',function(e){
            console.log(e);
        }))
        // 去掉css注释
        .pipe(stripCssComments())
        // auto prefix
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        // css格式化、美化（因为有f2ehint，故在此不再做语法等的检查与修复）
        .pipe(mapStream(function(file, cb) {
            // 添加css代码的格式化
            var cssContent = file.contents.toString();

            if (/\.(css|sass|scss)/.test(path.extname(file.path))) {
                file.contents = new Buffer(cssbeautify(cssContent, {
                    indent: '    ',
                    openbrace: 'end-of-line',
                    autosemicolon: true
                }));
            }

            cb(null, file);
        }))
        .pipe(gulp.dest(function(file) {
            return 'views/public/css';
        }))
        .pipe(minifycss())
        .pipe(rename(function(path){
            path.basename += '.min';
        }))
        .pipe(sourcemaps.write('.'))
        // 将编译后的.css文件存放在.scss文件所在目录下
        .pipe(gulp.dest(function(file) {
            return 'views/public/css';
        }))

        // 编译成功后的提示（频繁提示会有点烦人，可将successNotify设置为：false关闭掉）
        .pipe(notify(function(file) {
            return successNotify && 'scss/sass编译成功！';
        }))
        .pipe(reload({stream: true}));
});
//help
function logPath(file) {
    console.log(logSymbols.info + ' 正在编译：' + file.path.gray);
}

function reportError(error) {
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

    notify({
        title: '编译失败 [' + error.plugin + ']',
        message: lineNumber + '具体错误请看控制台！',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    gutil.beep();

    // Pretty error reporting
    var report = '';
    var chalk = gutil.colors.white.bgRed;

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) {
        report += chalk('LINE:') + ' ' + error.lineNumber + '\n';
    }
    if (error.fileName) {
        report += chalk('FILE:') + ' ' + error.fileName + '\n';
    }
    console.error(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
}
gulp.task('compile', ['styles','scripts']);

gulp.task('default', ['styles','scripts','browserSync']);