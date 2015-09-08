define(function (require) {
	'use strict';

	var Component = require('core/Component');
	var template = require('text!component/actionbutton/ActionButton.hbs');

	return Component.extend({
		template: template
	});

});
