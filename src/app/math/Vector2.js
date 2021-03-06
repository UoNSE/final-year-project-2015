define(function (require) {
	'use strict';

	// All credit to three.js, this is just wrapped for AMD.
	// Source: https://raw.githubusercontent.com/mrdoob/three.js/master/src/math/Vector2.js
	// Docs: http://threejs.org/docs/#Reference/Math/Vector2

	function Vector2 (x, y) {

		this.x = x || 0;
		this.y = y || 0;

	}

	Object.assign(Vector2, {
		ones: function () {
			return new Vector2(1, 1);
		},

		zeros: function () {
			return new Vector2(0, 0);
		},

		fromPolar: function (r, theta) {
			return new Vector2().setPolar(r, theta);
		}
	});

	Object.assign(Vector2.prototype, {

		constructor: Vector2,

		set: function (x, y) {

			this.x = x;
			this.y = y;

			return this;

		},

		setPolar: function (r, theta) {

			this.x = r * Math.cos(theta);
			this.y = r * Math.sin(theta);

			return this;

		},

		rotateZ: function (theta) {

			var ca = Math.cos(theta);
			var sa = Math.sin(theta);
			this.set(
				ca * this.x - sa * this.y,
				sa * this.x + ca * this.y
			);

			return this;

		},

		applyTransform: function (transform) {

			this.multiply(transform.scale).rotateZ(transform.rotation).add(transform.position);

			return this;

		},

		applyInverseTransform: function (transform) {

			return this.applyTransform(transform.getInverse());

		},

		setX: function (x) {

			this.x = x;

			return this;

		},

		setY: function (y) {

			this.y = y;

			return this;

		},

		setComponent: function (index, value) {

			switch (index) {

				case 0:
					this.x = value;
					break;
				case 1:
					this.y = value;
					break;
				default:
					throw new Error('index is out of range: ' + index);

			}

		},

		getComponent: function (index) {

			switch (index) {

				case 0:
					return this.x;
				case 1:
					return this.y;
				default:
					throw new Error('index is out of range: ' + index);

			}

		},

		copy: function (v) {

			this.x = v.x;
			this.y = v.y;

			return this;

		},

		add: function (v, w) {

			this.x += v.x;
			this.y += v.y;

			return this;

		},

		addScalar: function (s) {

			this.x += s;
			this.y += s;

			return this;

		},

		addVectors: function (a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		},

		sub: function (v, w) {

			this.x -= v.x;
			this.y -= v.y;

			return this;

		},

		subScalar: function (s) {

			this.x -= s;
			this.y -= s;

			return this;

		},

		subVectors: function (a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		},

		multiply: function (v) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		},

		multiplyVectors: function (a, b) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;

			return this;

		},

		multiplyScalar: function (s) {

			this.x *= s;
			this.y *= s;

			return this;

		},

		reciprocal: function (v) {

			this.x = 1 / this.x;
			this.y = 1 / this.y;

			return this;
		},

		divide: function (v) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		},

		divideVectors: function (a, b) {

			this.x = a.x / b.x;
			this.y = a.y / b.y;

			return this;

		},

		divideScalar: function (scalar) {

			if (scalar !== 0) {

				var invScalar = 1 / scalar;

				this.x *= invScalar;
				this.y *= invScalar;

			} else {

				this.x = 0;
				this.y = 0;

			}

			return this;

		},

		min: function (v) {

			if (this.x > v.x) {

				this.x = v.x;

			}

			if (this.y > v.y) {

				this.y = v.y;

			}

			return this;

		},

		max: function (v) {

			if (this.x < v.x) {

				this.x = v.x;

			}

			if (this.y < v.y) {

				this.y = v.y;

			}

			return this;

		},

		clamp: function (min, max) {

			// This function assumes min < max, if this assumption isn't true it will not operate correctly

			if (this.x < min.x) {

				this.x = min.x;

			} else if (this.x > max.x) {

				this.x = max.x;

			}

			if (this.y < min.y) {

				this.y = min.y;

			} else if (this.y > max.y) {

				this.y = max.y;

			}

			return this;
		},

		clampScalar: (function () {

			var min, max;

			return function (minVal, maxVal) {

				if (min === undefined) {

					min = new Vector2();
					max = new Vector2();

				}

				min.set(minVal, minVal);
				max.set(maxVal, maxVal);

				return this.clamp(min, max);

			};

		})(),

		floor: function () {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;

		},

		ceil: function () {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;

		},

		round: function () {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);

			return this;

		},

		roundToZero: function () {

			this.x = ( this.x < 0 ) ? Math.ceil(this.x) : Math.floor(this.x);
			this.y = ( this.y < 0 ) ? Math.ceil(this.y) : Math.floor(this.y);

			return this;

		},

		negate: function () {

			this.x = -this.x;
			this.y = -this.y;

			return this;

		},

		dot: function (v) {

			return this.x * v.x + this.y * v.y;

		},

		lengthSq: function () {

			return this.x * this.x + this.y * this.y;

		},

		length: function () {

			return Math.sqrt(this.x * this.x + this.y * this.y);

		},

		normalize: function () {

			return this.divideScalar(this.length());

		},

		distanceTo: function (v) {

			return Math.sqrt(this.distanceToSquared(v));

		},

		distanceToSquared: function (v) {

			var dx = this.x - v.x, dy = this.y - v.y;
			return dx * dx + dy * dy;

		},

		setLength: function (l) {

			var oldLength = this.length();

			if (oldLength !== 0 && l !== oldLength) {

				this.multiplyScalar(l / oldLength);
			}

			return this;

		},

		lerp: function (v, alpha) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;

			return this;

		},

		lerpVectors: function (v1, v2, alpha) {

			this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

			return this;

		},

		equals: function (v) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) );

		},

		fromArray: function (array, offset) {

			if (offset === undefined) offset = 0;

			this.x = array[offset];
			this.y = array[offset + 1];

			return this;

		},

		toArray: function (array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this.x;
			array[offset + 1] = this.y;

			return array;

		},

		fromAttribute: function (attribute, index, offset) {

			if (offset === undefined) offset = 0;

			index = index * attribute.itemSize + offset;

			this.x = attribute.array[index];
			this.y = attribute.array[index + 1];

			return this;

		},

		clone: function () {

			return new Vector2(this.x, this.y);

		}

	});

	return Vector2;
});

