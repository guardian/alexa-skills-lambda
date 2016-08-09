var gulp = require('gulp');
var zip = require('gulp-zip');
var exec  = require('exec-chainable');
var yaml = require('gulp-yaml');
var eslint = require('gulp-eslint');
var path = require('path');
process.env.ARTEFACT_PATH = __dirname;
var riffraff = require('node-riffraff-artefact');

var LAMBDA_SOURCE = 'src/*.js';
var DEPLOY_SOURCE = 'conf/deploy.yml';
var CLOUDFORMATION_SOURCE = 'conf/cloudformation.yml';

gulp.task('compile', function () {
	return exec('rollup -c rollup.config.js');
});

gulp.task('compile-dev', ['compile'], function () {
	gulp.watch(LAMBDA_SOURCE, ['compile']);
});

gulp.task('cloudformation', function () {
	return gulp.src(CLOUDFORMATION_SOURCE)
		.pipe(yaml({ space: 4 }))
		.pipe(gulp.dest('./tmp/riffraff/packages/cloudformation'));
});
gulp.task('cfn', ['cloudformation']);

gulp.task('cloudformation-dev', ['cloudformation'], function () {
	gulp.watch(CLOUDFORMATION_SOURCE, ['cloudformation']);
});

gulp.task('lint', function () {
	return gulp.src([
		LAMBDA_SOURCE,
		'test/**/*.js'
	])
	.pipe(eslint())
	.pipe(eslint.formatEach('compact', process.stderr))
	.pipe(eslint.failAfterError());
});

gulp.task('lint-dev', ['lint'], function () {
	gulp.watch(LAMBDA_SOURCE, ['lint']);
});

gulp.task('riffraff-deploy', function () {
	return gulp.src(DEPLOY_SOURCE)
		.pipe(yaml({ space: 4 }))
		.pipe(gulp.dest('tmp/riffraff'));
});

gulp.task('riffraff-deploy-dev', ['riffraff-deploy'], function () {
	gulp.watch(DEPLOY_SOURCE, ['riffraff-deploy']);
});


gulp.task('dev', ['lint-dev', 'cloudformation-dev', 'compile-dev', 'riffraff-deploy-dev']);

gulp.task('archive', ['compile', 'riffraff-deploy'], function () {
	return gulp.src('tmp/lambda/**/*')
		.pipe(zip('artifact.zip'))
		.pipe(gulp.dest('tmp/riffraff/packages/lambda'))
		.pipe(gulp.dest('tmp/riffraff/packages/static'));
});

gulp.task('package', ['archive'], function () {
	return gulp.src('tmp/riffraff/**/*')
		.pipe(zip('artifacts.zip'))
		.pipe(gulp.dest('tmp/'));
});

gulp.task('deploy', ['package'], function (cb) {
	riffraff.settings.leadDir = path.join(__dirname, 'tmp/');

	riffraff.s3Upload().then(function () {
		cb();
	}).catch(function (error) {
		cb(error);
	});
});
