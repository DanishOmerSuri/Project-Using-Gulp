var site          = "./site/website/";
var source        = site + "assets/";
var sourceStyles  = source + "scss/";
var sourceScripts = source + "js/";
var sourceImages  = source + "images/";
var sourceIcons   = source + "icon-font/";
var sourceFonts   = source + "fonts/";
var sourceMarkup  = source + "";


var build        = site + "assets/";
var buildStyles  = build + "css/";
var buildScripts = build + "js/";
var buildImages  = build + "images/";
var buildMarkup  = site + "";


var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var browserSync = require('browser-sync').create();

// dynamic
var server = 'localhost:80';
var devProxy =  server + '/site/website';

function swallowError(error) {

  // If you want details of the error in the console
  console.log(error.toString());

  this.emit('end');
}

// Gulp Sass Task 
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
gulp.task('styles', function() {
  gulp.src(sourceStyles + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./'],
      errLogToConsole: true
    }).on('error', swallowError))
    .pipe(prefix({
      browsers: ['ie 8-9', 'last 2 versions']
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(buildStyles));
    // .pipe(browserSync.stream());
})

// ### Images
// `gulp images` - Run lossless compression on all the images.
var imagemin = require('gulp-imagemin');
gulp.task('images', function() {
  return gulp.src(sourceImages + '*.{jpg,png,svg}')
  .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        removeUnknownsAndDefaults: false
      }, {
        cleanupIDs: false
      }]
    }))
    .pipe(gulp.dest(buildImages))
    .pipe(browserSync.stream());
});


// ### Sprite
// `gulp sprite` - Make svg sprite from svg icons
var svgSprite = require('gulp-svg-sprite');
var svg2png = require('gulp-svg2png');
// var svgo      = require('gulp-svgo');
// converting svgs to one sprite
gulp.task('sprite', function(tmp) {
  gulp.src(sourceIcons + 'sprite/**/*.svg')
  .pipe(plumber())
    // optimize svgs
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        removeUnknownsAndDefaults: false
      }, {
        cleanupIDs: false
      }]
    }))
    // make sprite
    .pipe(svgSprite({
      "mode": {
        "css": {
          "spacing": {
            "padding": 5
          },
          "dest": "./",
          "layout": "diagonal",
          "sprite": sourceImages + "/sprite.svg",
          "bust": false,
          "render": {
            "scss": {
              "dest": sourceStyles + "lib/sprite/map/_sprite.scss",
              "template": sourceStyles + "lib/sprite/sprite-template.scss"
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('.'));
});

// convert svg sprite to png for fallback
gulp.task('pngSprite', function() {
  gulp.src(sourceImages + 'sprite.svg')
    .pipe(svg2png())
    .pipe(gulp.dest(buildImages));
});


// ### Iconfont
// `gulp icons` - Use svg icons to make an iconfont
var
  svg2ttf = require('gulp-svg2ttf'),
  svgicons2svgfont = require('gulp-svgicons2svgfont'),
  tap = require('gulp-tap'),
  template = require('gulp-template'),
  ttf2woff = require('gulp-ttf2woff');

gulp.task('iconfont', function() {
  gulp.src(sourceIcons + 'iconfont/*.svg')
    .pipe(svgicons2svgfont({
      fontName: '_Symbols-400-normal',
      normalize: true,
      fontHeight: 1000,
      log: function() {} // Silence
    }))
    .on('glyphs', function(glyphs) {
      gulp.src(sourceStyles + 'lib/iconfont/_iconfont-template.scss')
        .pipe(template({
          glyphs: glyphs
        }))
        .pipe(gulp.dest(sourceStyles + 'lib/iconfont/map/'));
    })
    .pipe(svg2ttf())
    .pipe(gulp.dest(sourceFonts));
});

// ### Fonts
// `gulp fonts` - Use .ttf files to convert to webfont

gulp.task('fonts', function() {
  var fonts = {};
  gulp.src(sourceFonts + '*.ttf')
    .pipe(ttf2woff())
    .pipe(tap(function(file) {
      var chunks = file.path.substring(file.path.lastIndexOf('_') + 1, file.path.lastIndexOf('.')).split('-'),
        variant = {
          style: chunks.pop(),
          weight: chunks.pop(),
          base64: file.contents.toString('base64')
        };
      chunks.forEach(function(string, i, array) {
        array[i] = string[0].toUpperCase() + string.slice(1);
      });
      var family = chunks.join(' ');
      if (fonts.hasOwnProperty(family)) fonts[family].push(variant);
      else fonts[family] = [variant];
    }))
    .on('end', function() {
      gulp.src(sourceStyles + 'lib/fonts/_fonts.scss')
        .pipe(template({
          fonts: fonts
        }))
        .pipe(gulp.dest(sourceStyles + 'lib/fonts/map'));
    });
});

//////////////////
// Jade to HTML //
//////////////////
var jade = require('gulp-jade');

gulp.task('markup', function() {
  return gulp.src(sourceMarkup + 'pages/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    })) // pip to jade plugin
    .pipe(gulp.dest(buildMarkup))
    .pipe(browserSync.stream()); // tell gulp our output folder
});


///////////////////
// HTML Extender //
///////////////////

// var gulp = require('gulp')
// var extender = require('gulp-html-extend')

gulp.task('extend', function() {
    gulp.src(source + '*.html')
        .pipe(plumber())
        .pipe(extender({ annotations: true, verbose: true })) // default options
        .pipe(gulp.dest(buildMarkup))
        .pipe(browserSync.stream()); // tell gulp our output folder
})



var jshint = require('gulp-jshint');
gulp.task('scripts', function() {
  return gulp.src(sourceScripts + '*.js')
    .pipe(plumber())
    .pipe(jshint())
    // .pipe(jshint.reporter('YOUR_REPORTER_HERE'))
    .pipe(gulp.dest(buildScripts))
    .pipe(browserSync.stream()); // tell gulp our output folder
});


// ### Static
// `gulp watch-static` - Use BrowserSync to start your dev server and synchronize code
// changes across devices. Watch static files

gulp.task('static', function() {
  //gulp.start('build');
  gulp.start('styles');
  browserSync.init({
    server: {
      baseDir: buildMarkup
    },
    //files: ['**/*.html', '**/*.css', '**/*.js'],
    files: ['../**/*.html', '**/*.html', '../**/*.php', '**/*.php', '**/*.css', '**/*.js'],
    notify: false,
    //online: true,
    port: 9999
  });

  // gulp.watch([sourceMarkup + '**/*'], ['markup']);
  //gulp.watch([sourceStyles + '**/*'], ['styles']);
  gulp.watch([sourceStyles + '**/*.scss'], ['styles']);
  // gulp.watch([sourceImages + '**/*'], ['images']);
  // gulp.watch([sourceScripts+/**/*.js], ['jshint', 'scripts']);
  // gulp.watch([sourceFonts + '**/*'], ['fonts', 'styles']);
  //gulp.watch([sourceIcons + 'iconfont/**/*.svg'], ['iconfont', 'fonts', 'styles']);
  // gulp.watch([sourceFonts + 'sprite/**/*.svg'], ['sprite', 'fonts', 'styles']);
});

gulp.task('dynamic', function() {
    gulp.start('styles');
     browserSync.init({
         files: ['../**/*.html', '**/*.html', '../**/*.php', '**/*.php', '**/*.css', '**/*.js'],
         proxy: devProxy,
         port: 9999,
         notify: false,
         //online: true,
     });
    gulp.watch([sourceStyles + '**/*.scss'], ['styles']);
});

// ### Watch
// `gulp watch` - Use BrowserSync to proxy your dev server and synchronize code
// changes across devices. Specify the hostname of your dev server at
// `manifest.config.devUrl`. When a modification is made to an asset, run the
// build step for that asset and inject the changes into the page.
// See: http://www.browsersync.io
// gulp.task('dynamic', function() {
//   gulp.start('build');
//   browserSync.init({
//     files: ['{lib,templates,pages}/**/*.php', '*.php', 'ui/**/*.css', '*.js'],
//     proxy: config.devUrl,
//     notify: false,
//     snippetOptions: {
//       whitelist: ['/wp-admin/admin-ajax.php'],
//       blacklist: ['/wp-admin/**']
//     }
//   });
//   gulp.watch([path.source + 'styles/**/*'], ['styles']);
//   gulp.watch([path.source + 'scripts/**/*'], ['jshint', 'scripts']);
//   gulp.watch([path.source + 'fonts/**/*.ttf'], ['fonts', 'styles']);
//   gulp.watch([path.source + 'images/**/*'], ['images']);
//   gulp.watch([path.source + 'icons/svgs-for-iconfont/**/*.svg'], ['icons', 'fonts', 'styles']);
//   gulp.watch([path.source + 'icons/svgs-for-sprite/**/*.svg'], ['sprite', 'styles']);
//   gulp.watch(['bower.json', 'ui/assets/manifest.json'], ['build']);
// });

// ### Build
// `gulp build` - Run all the build tasks but don't clean up beforehand.
// Generally you should be running `gulp` instead of `gulp build`.
gulp.task('build', ['styles'], function(callback) {});

gulp.task('default', ['dynamic']);