define(function (require) {

	'use strict';

	var glm = require('glmatrix');

	function RotateTranslateScaleBehaviour (element) {

		this.element = element;
		this.touches = {};
		this.moving = false;
		this.translate = glm.vec3.create();
		this.rotation = 0;
		this.scale = glm.vec3.fromValues(1, 1, 1);
		this.minScale = glm.vec3.fromValues(0.5, 0.5, 1);

		requestAnimationFrame(this.onAnimationFrame.bind(this));

	}

	RotateTranslateScaleBehaviour.prototype.onTouchStart = function (element, event) {

		var changedTouches = event.originalEvent.changedTouches;
		for (var i = 0, len = changedTouches.length; i < len; i++) {
			var touch = changedTouches[i];
			this.touches[touch.identifier] = {
				startPoint: glm.vec3.fromValues(touch.pageX, touch.pageY, 0),
				lastPoint: glm.vec3.fromValues(touch.pageX, touch.pageY, 0),
				startMatrix: glm.mat4.clone(this.matrix)
			};
		}

	};

	RotateTranslateScaleBehaviour.prototype.onTouchMove = function (element, event) {

		var targetTouches = event.originalEvent.targetTouches;
		var len = targetTouches.length;
		if (len === 1) {
			var touch = targetTouches[0];
			var touchInfo = this.touches[touch.identifier];
			var touchPoint = glm.vec3.fromValues(touch.pageX, touch.pageY, 0);
			var translation = glm.vec3.sub(glm.vec3.create(), touchPoint, touchInfo.lastPoint);

			glm.vec3.add(this.translate, this.translate, translation);

			glm.vec3.copy(touchInfo.lastPoint, touchPoint);
		} else {
			var touch1 = targetTouches[0];
			var touch2 = targetTouches[1];
			var touchPoint1 = glm.vec3.fromValues(touch1.pageX, touch1.pageY, 0);
			var touchPoint2 = glm.vec3.fromValues(touch2.pageX, touch2.pageY, 0);
			var touchInfo1 = this.touches[touch1.identifier];
			var touchInfo2 = this.touches[touch2.identifier];

			var startDistanceSqr = glm.vec3.sqrDist(touchInfo1.lastPoint, touchInfo2.lastPoint);
			var distanceSqr = glm.vec3.sqrDist(touchPoint1, touchPoint2);
			var scale = distanceSqr / startDistanceSqr;

			var scaleVector = glm.vec3.fromValues(scale, scale, 1);

			glm.vec3.multiply(this.scale, this.scale, scaleVector);

			glm.vec3.max(this.scale, this.scale, this.minScale);

			var translation1 = glm.vec3.subtract(glm.vec3.create(), touchPoint1, touchInfo1.lastPoint);
			var translation2 = glm.vec3.subtract(glm.vec3.create(), touchPoint2, touchInfo2.lastPoint);
			var finalTranslation = glm.vec3.add(glm.vec3.create(), translation1, translation2);
			glm.vec3.scale(finalTranslation, finalTranslation, 0.5);
			glm.vec3.add(this.translate, this.translate, finalTranslation);

			var startAngle = Math.atan2(touchInfo1.lastPoint[1] - touchInfo2.lastPoint[1], touchInfo1.lastPoint[0] - touchInfo2.lastPoint[0]);
			var angle = Math.atan2(touchPoint1[1] - touchPoint2[1], touchPoint1[0] - touchPoint2[0]);

			this.rotation += angle - startAngle;

			glm.vec3.copy(touchInfo1.lastPoint, touchPoint1);
			glm.vec3.copy(touchInfo2.lastPoint, touchPoint2);
		}

	};

	RotateTranslateScaleBehaviour.prototype.onAnimationFrame = function () {

		requestAnimationFrame(this.onAnimationFrame.bind(this));

		this.updateTransform(this.element.element);

	};

	RotateTranslateScaleBehaviour.prototype.updateTransform = function (element) {

		element.css('transform',
			   'translate3d(' + this.translate[0] + 'px, ' + this.translate[1] + 'px, 0)'
			+ ' scale3d(' + this.scale[0] + ', ' + this.scale[1] + ', 1)'
		    + ' rotateZ(' + this.rotation + 'rad)'
		);

	};

	RotateTranslateScaleBehaviour.prototype.onTouchEnd = function (element, event) {


		var changedTouches = event.originalEvent.changedTouches;
		for (var i = 0, len = changedTouches.length; i < len; i++) {
			var touch = changedTouches[i];
			var touchId = touch.identifier;
			delete this.touches[touchId];
		}

	};

	return RotateTranslateScaleBehaviour;

});
