define(function (require) {
	'use strict';

	var InventoryPage = require('page/InventoryPage');
	var VirtualPatient = require('component/activity/virtualpatient/VirtualPatient');

	return InventoryPage.extend({
		name: 'virtualpatient',
		title: 'Virtual Patient',
		initialize: function () {
			InventoryPage.prototype.initialize.apply(this, arguments);
			var caseID = this.urlParams['case_id'];
			this.add(new VirtualPatient(this.inventory, caseID));
		}
	});
});
