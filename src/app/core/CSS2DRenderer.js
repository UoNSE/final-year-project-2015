define(function (require) {
	'use strict';

	var Scene = require('core/Scene');
	var Camera = require('core/Camera');
	var Transform = require('math/Transform');
	var $ = require('jquery');
	var Promise = require('bluebird');

	function CSS2DRenderer () {
	}

	Object.assign(CSS2DRenderer.prototype, {
		render: function (selector, scene, camera) {
			var container = $(selector);
			var children = scene.children;
			var transform = camera.transform.getInverse();
			for (var i = 0, length = children.length; i < length; i++) {
				var child = children[i];
				var classes = child.classes || [];
				this.renderObject(child, container, transform, classes, scene.visible);
			}
		},

		renderObject: function (object, container, parentTransform, parentClasses, parentVisible) {
			var transform;

			if (object.needsWorldUpdate) {
				transform = object.worldTransform.copy(object.transform).applyTransform(parentTransform)
			} else {
				object.transform.copy(object.worldTransform);
				if (object.parent) {
					object.transform.worldToLocal(object.parent.worldTransform);
				}
			}

			var classes = (parentClasses || []).slice().concat(object.classes || []);
			var visible = parentVisible && object.visible;
			this.renderObjectHTML(object, container, transform, classes, visible);
			var children = object.children;
			for (var i = 0, length = children.length; i < length; i++) {
				var child = children[i];
				this.renderObject(child, container, transform, classes, visible);
			}
			object.needsWorldUpdate = true;
		},

		renderObjectHTML: function (object, container, transform, classes, visible) {
			if (!object.added) {
				var element = object.render().$el;
				element.attr('id', object.id);
				element.addClass(classes.join(' '));
				element.find('a').attr('draggable', 'false'); // TODO: move to linkify?
				container.append(element);
				this.loadStyles(object.styles).then(function () {
					object.trigger('loaded');
				});
				object.added = true;
				object.on('removechild', function () {
					$(object.id).remove();
					// TODO: remove style sheets
				});
			}
			object.$el.toggle(visible);
			this.applyTransform(object.$el, transform);
			return element;
		},

		/**
		 * Loads CSS external stylesheets.
		 *
		 * @param styles The list of styles to load.
		 * @private
		 */
		loadStyles: function (styles) {
			var promises = [];
			styles = styles ? Array.isArray(styles) ? styles : [styles] : [];
			// Get the head from the HTML page.
			var head = $('head');
			// Load necessary CSS files.
			for (var i = 0, len = styles.length; i < len; i++) {
				promises.push(new Promise(function (resolve) {
					var path = require.toUrl(styles[i]);
					var css = $('<link rel="stylesheet" type="text/css" href="' + path + '">');
					head.append(css);
					var img = $('<img>', {
						src: path
					});
					img.on('error', function () {
						resolve();
					});
				}.bind(this)));
			}
			return Promise.all(promises);
		},

		applyTransform: function (element, transform) {
			$(element).css({
				'transform': 'translate(calc(-50% + ' + transform.position.x + 'px), calc(-50% + ' + (-transform.position.y) + 'px))'
				+ ' rotateZ(' + (-transform.rotation / Math.TAU) + 'turn)'
				+ ' scale(' + transform.scale.x + ', ' + transform.scale.y + ')'
			});
		}
	});

	return CSS2DRenderer;
});

