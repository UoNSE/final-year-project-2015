define(function (require) {
	'use strict';

	var Page = require('core/Page');
	var Inventory = require('model/Inventory');

	return Page.extend({
		name: 'inventory_page',
		initialize: function () {
			Page.prototype.initialize.apply(this, arguments);

			//var inventory = this.add(new Inventory());
			//this.position.x = -inventory.width / 2;
			//this.camera.position.x = inventory.width / 2;

			this.inventory = this.session.get('inventory', () => new Inventory());
			this.inventory2 = this.session.get('inventory2', () => new Inventory());
		},

		/**
		 * An event triggered when the inventory page is destroyed. This method resets the camera position to account
		 * for the offset applied in the constructor.
		 */
		onDestroy: function () {
			//this.camera.position.set(0, 0);
		}

	});
});
