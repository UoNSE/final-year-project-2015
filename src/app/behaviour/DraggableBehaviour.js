define(function (require) {
	'use strict';

	var $ = require('jquery');

	function DraggableBehaviour (multiTouchElement, multiTouchManager, options) {
		this.multiTouchElement = multiTouchElement;
		this.component = multiTouchElement.component;
		this.multiTouchManager = multiTouchManager;
		this.options = options || {};
		this.dragging = {};
		this.bindEvents();
	}

	Object.assign(DraggableBehaviour.prototype, {
		bindEvents: function () {
			this.component.on({
				drag: this.onDrag.bind(this)
			});
		},

		onDrag: function () {
			var opacity = this.options.opacity || 1;
			if (opacity) {
				new TWEEN.Tween(this.component).to({opacity: opacity}, 300).start();
				//this.component.$el.fadeTo('fast', opacity);
			}
		},

		onMouseDown: function (element, event) {
			this.drag();
		},

		onMouseMove: function (element, event) {
			this.dragMove(event.pageX, event.pageY);
		},

		onMouseUp: function (element, event) {
			this.dragEnd(event.pageX, event.pageY);
		},

		onTouchStart: function (element, event) {
			this.drag();
		},

		onTouchMove: function (element, event) {
			var touch = event.originalEvent.targetTouches[0];
			this.dragMove(touch.pageX, touch.pageY);
		},

		onTouchEnd: function (element, event) {
			var touch = event.originalEvent.changedTouches[0];
			this.dragEnd(touch.pageX, touch.pageY);
		},

		drag: function () {
			this.component.trigger('drag', {
				draggable: this.component
			});
		},

		dragMove: function (x, y) {
			// Get the current intersection of elements.
			var $elements = $(document.elementsFromPoint(x, y)).filter('section.component').not(this.multiTouchElement.element);
			// Iterate through each element that has been dragged on.
			$.each(this.dragging, function (key, component) {
				// Check if we are no longer dragging an element, by checking if the element doesn't exist in the current intersection.
				if ($elements.index(component.$el) === -1) {
					// Trigger a touchleave event and remove the element from the set.
					component.trigger('touchleave', {
						draggable: this.component,
						droppable: component
					});
					delete this.dragging[key];
				}
			}.bind(this));
			// Iterate through each element intersection.
			$elements.each(function (index, element) {
				// Get the multitouch element from its id.
				var id = $(element).attr('id');
				var multiTouchElement = this.multiTouchManager.get(id);
				// If the multitouch element exists, add the component to the list of components being hovered on and trigger a touch enter event.
				if (multiTouchElement) {
					var droppable = multiTouchElement.component;
					this.dragging[id] = droppable;
					multiTouchElement.component.trigger('touchenter', {
						draggable: this.component,
						droppable: droppable
					});
				}
			}.bind(this));
		},

		dragEnd: function (x, y) {
			var elements = $(document.elementsFromPoint(x, y)).filter('section.component').not(this.multiTouchElement.element);
			elements.each(function (index, element) {
				var id = $(element).attr('id');
				var multiTouchElement = this.multiTouchManager.get(id);
				if (multiTouchElement) {
					multiTouchElement.component.trigger('dragendsink', {
						draggable: this.component,
						droppable: multiTouchElement.component
					});
				}
			}.bind(this));

			this.component.trigger('dragendsource', {
				draggable: this.component
			});

			new TWEEN.Tween(this.component).to({opacity: 1}, 200).start();

		}
	});

	return DraggableBehaviour;
});

