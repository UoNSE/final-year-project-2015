define(function (require) {

	var Backbone = require('backbone');
	var Loader = require('controller/Loader');
	var Back = require('shared/navigation/back/BackController');

	return Backbone.Router.extend({

		_loader: null,
		_back: null,

		routes: {
			'': 'start',
			'cases': 'cases',
			'case/:id/overview': 'caseOverview',
			'case/:id/information': 'caseInformation',
			'case/:id/information/background': 'caseBackground'
		},

		initialize: function () {
            this._loader = new Loader(this);
			this._loader.insert('shared/navigation/back/Back', $('body'), 0).then(function (controller) {
				this._back = controller;
				$(this._back.selector).hide();
				this.trigger('ready');
			}.bind(this));

			this._loader.on({
				configureBack: this.onConfigureBack.bind(this),
				back: this._onBack.bind(this)
			});
		},

		/**
		 * Loads the previous page in the history.
		 */
		onBack: function () {
			Backbone.history.history.back();
		},

		/**
		 * Changes the visibility of the back button depending on the back configuration.
		 *
		 * @param back The back configuration.
		 */
		onConfigureBack: function (back) {
			if (this._back) {
				var button = $(this._back.selector);
				// TODO add transitions
				if (back === false || Backbone.history.getPath() === '') {
					button.hide();
				} else {
					button.show();
				}
			}
		},

		/**
		 * Loads the page given the route.
		 *
		 * @param route The path to the base route.
		 * @param id The id of the current case.
		 * @private
		 */
		_load: function (route, id) {
			if (id) {
				id = parseInt(id, 10);
			}
			this._loader.load(route, id);
		},

		start: function () {
			this._load('component/start/Start');
		},

		cases: function () {
			this._load('component/cases/Cases');
		},

		caseOverview: function (id) {
			this._load('component/overview/CaseOverview', id);
		},

		caseInformation: function (id) {
			this._load('component/information/CaseInformation', id);
		},

		caseBackground: function (id) {
			this._load('component/information/background/Background', id);
		}

	});

});