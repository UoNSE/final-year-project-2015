define(function (require) {
	'use strict';

	var Object2D = require('core/Object2D');
	var BackButton = require('component/backbutton/BackButton');
	var Vector2 = require('math/Vector2');

	return Object2D.extend({
		showBackButton: true,
		title: 'Page',

		initialize: function (router, camera, urlParams) {
			Object2D.prototype.initialize.apply(this, arguments);

			this.camera = camera;
			this.urlParams = urlParams;
			if (this.showBackButton) {
				this.backButton = this.add(new BackButton(router));
				this.backButton.on('back', this.onBack.bind(this));
			}
		},

		// Override in submodule to modify.
		onBack: function () {
		},

		// Override in submodule to modify.
		onPageEnter: function () {
			this.scale.set(0, 0);

			return new TWEEN.Tween(this.scale)
				.to(Vector2.ones())
				.easing(TWEEN.Easing.Elastic.Out)
				.start()
				.promise();
		},

		// Override in submodule to modify.
		onPageLeave: function () {
			return new TWEEN.Tween(this.scale)
				.to(Vector2.zeros(), 500)
				.easing(TWEEN.Easing.Back.In)
				.start()
				.promise();
		}
	});
});
