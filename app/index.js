'use strict';

var generators = require('yeoman-generator'),
	_ = require('lodash'),
	chalk = require('chalk'),
	yosay = require('yosay');

module.exports = generators.Base.extend({
	constructor: function() {
		generators.Base.apply(this, arguments)	;

		this.argument('appname', {
			type: String,
			require: true
		});
		this.appname = _.kebabCase(this.appname);

		//usage:
		//
		//yo tonyangular --help
		//yo tonyangular --includeutils
		//yo tonyangular --no-includeutils
		this.option('includeutils', {
			desc: 'Optionally includes angular-ui-utils library',
			type: Boolean,
			default: false
		});
	},

	//run loop hook methods
	initializing: function() {
		this.log('initializing');
	},
	prompting: function() {
		this.log(yosay('welcome to ' + chalk.yellow('yeoman generator template')));

		var done = this.async();
		this.prompt([{
			type: 'input',
			name: 'ngappname',
			message: 'Angular App Name (ng-app)',
			// default: 'app'
			default: this.config.get('ngappname') || 'app'
			// store: true //store for the last user-entered value instead of showing the default one everytime
		}, {
			type: 'checkbox',
			name: 'jslibs',
			message: 'Which JS lib would you like to include?',
			choices: [{
				name: 'lodash',
				value: 'lodash',
				checked: true
			}, {
				name: 'Moment.js',
				value: 'momentjs',
				checked: true
			}]
		}], function(answers) {
			this.log(answers);
			// this.ngappname = answers.ngappname;

			//in the scaffolding, a file called .yo-rc.json is created to contain this ngappname value
			//  , which could be used in sub-generators
			this.config.set('ngappname', answers.ngappname) ;
			this.config.save();
			
			this.includeLodash = _.includes(answers.jslibs, 'lodash');
			this.includeMoment = _.includes(answers.jslibs, 'momentjs');

			done();
		}.bind(this));
	},
	configuring: function() {
		this.log('configuring');
	},
	default: function() {
		this.log('default');
	},
	writing: {
		gulpfile: function() {
			this.copy('jshintrc', '.jshintrc');
			this.copy('bowerrc', '.bowerrc');
		},
		packageJSON: function() {
			this.copy('_package.json', 'package.json');
		},
		git: function() {
			this.composeWith('common', {
				options: {
					'skip-messages': true,
					gitignore: true,
					gitattributes: true,
					jshintrc: false,
					editorconfig: false,
					'test-jshintrc': false
				}
			}, {
				local: require.resolve('generator-common')
			});
		},
		bower: function() {
			var bowerJson = {
				name: 'my-app', //TODO: make this dynamic
				license: 'MIT',
				dependencies: {
					angular: '~1.4.6'
				}
			};

			if (this.includeLodash) {
				bowerJson.dependencies['lodash'] = '~3.10.1';
			}

			if (this.includeMoment) {
				bowerJson.dependencies['moment'] = '~2.10.6';
			}

			if (this.options.includeutils) {
				bowerJson.dependencies['angular-ui-utils'] = '~3.0.0';
			}

			this.fs.writeJSON('bower.json', bowerJson);
		},
		appStaticFiles: function() {
			// this.log('template path: ', this.templatePath());
			// this.log('destination path: ', this.destinationPath());
			// var source = this.templatePath('_favicon.ico');
			// var destination = this.destinationPath('src/favicon.ico');
			// this.log('Source: ', source, '\n\rDestination: ', destination);

			//templatePath() and destinationPath() are used behind the scene
			this.copy('_favicon.ico', 'src/favicon.ico');
			this.directory('routes', 'src/routes');
		},
		scripts: function() {
			
		},
		html: function() {
			this.fs.copyTpl(this.templatePath('_index.html'), this.destinationPath('src/index.html'), {
				appname: _.startCase(this.appname),
				// ngapp: this.ngappname
				ngapp: this.config.get('ngappname')
			});
		}
	},
	conflicts: function() {
		this.log('conflicts');
	},
	install: function() {
		// this.npmInstall();
		// this.bowerInstall();

		this.installDependencies({
			skipInstall: this.options['skip-install']
		});
	},
	end: function() {
		if (this.options['skip-install']) {
			this.log('Please run npm install & bower install to install all dependencies');
		}
		this.log('end');
	},

	//will be executed right after default()
	customStuff: function() {
		this.log('**custom');
	}
});