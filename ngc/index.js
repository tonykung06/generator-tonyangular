'use strict';

var generators = require('yeoman-generator'),
	_ = require('lodash'),
	chalk = require('chalk'),
	yosay = require('yosay');

module.exports = generators.NamedBase.extend({
	constructor: function() {
		generators.NamedBase.apply(this, arguments)	;

		console.log('inside ngc sub-generator', this.name);

		this.option('view', {
			desc: 'Determines if view is created along with controller',
			type: Boolean,
			default: false
		});
	},

	writing: function() {
		this.fs.copyTpl(this.templatePath('ng-controller.js'), this.destinationPath('src/app/' + this.name + '/' + this.name + '.controller.js'), {
			ctrlName: this.name,
			appName: this.config.get('ngappname')
		});

		if (this.options.view) {
			this.fs.copyTpl(this.templatePath('ng-view.html'), this.destinationPath('src/app/' + this.name + '/' + this.name + '.html'), {
				name: this.name
			})
		}
	}
});