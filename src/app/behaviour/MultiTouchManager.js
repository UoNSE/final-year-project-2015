define(function (require) {

	'use strict';

	var $ = require('jquery');
	var Factory = require('Factory');
	var ZIndexManager = require('behaviour/ZIndexManager');
	var MultiTouchElement = require('behaviour/MultiTouchElement');
	var RotateTranslateScaleBehaviour = require('behaviour/RotateTranslateScaleBehaviour');
	var DraggableBehaviour = require('behaviour/DraggableBehaviour');

	function MultiTouchManager() {

		this.elements = [];
		this.zIndexManager = new ZIndexManager();

		$(window).on('touchmove', function (event) {

			// Prevent the browser's inbuilt touch gestures
			event.preventDefault();

		});

	}

	MultiTouchManager.prototype.addElementRTS = function (component) {

		var multiTouchComponent = this.addElement(component);
		var behaviour = new RotateTranslateScaleBehaviour(multiTouchComponent);
		multiTouchComponent.addBehaviour(behaviour);
		return multiTouchComponent;

	};

	MultiTouchManager.prototype.addElementDraggable = function (component) {

		var multiTouchComponent = this.addElement(component);
		var behaviour = new DraggableBehaviour(multiTouchComponent);
		multiTouchComponent.addBehaviour(behaviour);
		return multiTouchComponent;

	};

	MultiTouchManager.prototype.addElement = function (component) {

		var multiTouchComponent = new MultiTouchElement(component);

		// Add a remove binding for when the element is no longer on the DOM.
		$(multiTouchComponent).on('remove', this.onRemove.bind(this));

		this.elements.push(multiTouchComponent);
		this.zIndexManager.registerElement(multiTouchComponent);
		multiTouchComponent.addBehaviour(this.zIndexManager);
		return multiTouchComponent;

	};

	MultiTouchManager.prototype.onRemove = function (event) {
		this.remove(event.currentTarget);

	};

	MultiTouchManager.prototype.remove = function (multiTouchComponent) {
		this.elements.splice(this.elements.indexOf(multiTouchComponent), 1);
		this.zIndexManager.removeElement(multiTouchComponent);
	};

	return Factory.createFactory(MultiTouchManager);

});

