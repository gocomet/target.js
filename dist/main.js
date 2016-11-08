'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('app/core/utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

console.log(utils);

var Target = function () {
	function Target() {
		_classCallCheck(this, Target);
	}

	_createClass(Target, [{
		key: 'init',
		value: function init(options) {
			this.utils = utils;
		}
	}]);

	return Target;
}();

window.target = new Target();

/**
 * target.init
 *
 * override default settings (if specified)
 * initialize all services
 * initialize all components that exist on page
 */
// (function(target, undefined) {

// 	'use strict';

// 	target.init = function(options) {

// 		// override defaults with user settings
// 		target.utils.mixin(target.config, options);

// 		// init services
// 		target.events = new window.Mediator();
// 		target.window = target.Window.create(target);

// 		// for performance's sake, only observe dom if required
// 		if (target.config.observeDom) {

// 			target.domObserver = target.DomObserver.create(target);

// 		}

// 		target.componentFactory = target.ComponentFactory.create(target);
// 		target.api = target.API.create(target);

// 		// init components
// 		target.componentFactory.start();

// 	};

// })(window.target = window.target || {});