define(function (require) {
	'use strict';

	var Page = require('core/Page');
    let Inventory = require('component/inventory/Inventory');
	var InventoryModel = require('model/Inventory');

	return Page.extend({
		name: 'inventory_page',
		initialize: function () {
			Page.prototype.initialize.apply(this, arguments);

			var inventory = this.add(new Inventory());
			//this.position.x = -inventory.width / 2;

			this.inventory = new InventoryModel();

			this.camera.position.x = inventory.width / 2;
		},

		/**
		 * An event triggered when the inventory page is destroyed. This method resets the camera position to account
		 * for the offset applied in the constructor.
		 */
		onDestroy: function () {
			this.camera.position.set(0, 0);
		}

	});
});
