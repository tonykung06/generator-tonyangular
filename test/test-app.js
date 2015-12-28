'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('tonyangular', function() {
	describe('default', function() {
		before(function(done) {
			helpers.run(path.join(__dirname, '../app'))
			.withArguments(['MyCoolApp'])
			.withOptions({
				skipInstall: true
			}).on('end', done);
		});

		it('creates files', function() {
			assert.file(['package.json', 'src/routes/adminRoutes.js']);
		});

		it('adds default ngapp', function() {
			assert.fileContent('src/index.html', /<html ng-app="app"/);
		});
	});
});

describe('tonyangular prompt', function() {
	describe('default', function() {
		before(function(done) {
			helpers.run(path.join(__dirname, '../app'))
			.withArguments(['MyCoolApp'])
			.withPrompts({
				ngappname: 'fooBarApp'
			})
			.withOptions({
				skipInstall: true
			})
			.on('end', done);
		});

		it('injects custom ngappname', function() {
			assert.fileContent('src/index.html', /<html ng-app="fooBarApp"/);
		});
	});
});
