define(function (require) {
	'use strict';

	var Vector2 = require('math/Vector2');
	var Transform = require('math/Transform');

	function MathUtil() {
	}

	Object.assign(MathUtil, {
		FLIP_Y: new Vector2(1, -1),

		pageToWorld: function (x, y) {
			var vector = x instanceof Vector2 ? x : new Vector2(x, y);
			var client = new Vector2(window.innerWidth, window.innerHeight);
			return new Vector2().subVectors(vector, client.divideScalar(2)).multiply(MathUtil.FLIP_Y);
		},

		pageToWorldTransform: function (x, y) {
			var transform = new Transform();
			transform.position.copy(MathUtil.pageToWorld(x, y));
			return transform;
		},

		generateUUID: (function () {

			// http://www.broofa.com/Tools/Math.uuid.htm

			var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

			return function (len, radix) {
				var chars = CHARS, uuid = [], i;
				radix = radix || chars.length;

				if (len) {
					// Compact form
					for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
				} else {
					// rfc4122, version 4 form
					var r;

					// rfc4122 requires these characters
					uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
					uuid[14] = '4';

					// Fill in random data.  At i==19 set the high bits of clock sequence as
					// per rfc4122, sec. 4.1.5
					for (i = 0; i < 36; i++) {
						if (!uuid[i]) {
							r = 0 | Math.random() * 16;
							uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
						}
					}
				}

				return uuid.join('');
			};

		}())
	});

	return MathUtil;
});
