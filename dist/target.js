/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * main.js
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * define public Target object
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * create .init method for initialization by user
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * `target.init(settings);`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _classlistPolyfill = __webpack_require__(1);

	var _classlistPolyfill2 = _interopRequireDefault(_classlistPolyfill);

	var _mediatorJs = __webpack_require__(2);

	var _mediatorJs2 = _interopRequireDefault(_mediatorJs);

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _config = __webpack_require__(7);

	var _config2 = _interopRequireDefault(_config);

	var _window = __webpack_require__(8);

	var _window2 = _interopRequireDefault(_window);

	var _domobserver = __webpack_require__(10);

	var _domobserver2 = _interopRequireDefault(_domobserver);

	var _componentfactory = __webpack_require__(14);

	var _componentfactory2 = _interopRequireDefault(_componentfactory);

	var _api = __webpack_require__(30);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Target = function () {
		function Target(config) {
			_classCallCheck(this, Target);

			this.events = new _mediatorJs2.default();
			this.config = config;
		}

		_createClass(Target, [{
			key: 'init',
			value: function init(options) {

				_utils2.default.mixin(this.config, options);

				//init services
				this.window = new _window2.default(this.events, this.config.breakpoints, this.config.debounceDelay);

				// for performance's sake, don't observe dom by default
				if (this.config.observeDom) {

					this.domObserver = new _domobserver2.default(this.events, this.config);
				}

				this.componentFactory = new _componentfactory2.default(this.events, this.config);

				this.api = new _api2.default(this);

				return 'Target.js activated';
			}
		}]);

		return Target;
	}();

	window.target = new Target(_config2.default);

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*
	 * classList.js: Cross-browser full element.classList implementation.
	 * 2014-07-23
	 *
	 * By Eli Grey, http://eligrey.com
	 * Public Domain.
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 */

	/*global self, document, DOMException */

	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

	/* Copied from MDN:
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
	 */

	if ("document" in window.self) {

	  // Full polyfill for browsers with no classList support
	  // Including IE < Edge missing SVGElement.classList
	  if (!("classList" in document.createElement("_"))
	    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

	  (function (view) {

	    "use strict";

	    if (!('Element' in view)) return;

	    var
	        classListProp = "classList"
	      , protoProp = "prototype"
	      , elemCtrProto = view.Element[protoProp]
	      , objCtr = Object
	      , strTrim = String[protoProp].trim || function () {
	        return this.replace(/^\s+|\s+$/g, "");
	      }
	      , arrIndexOf = Array[protoProp].indexOf || function (item) {
	        var
	            i = 0
	          , len = this.length
	        ;
	        for (; i < len; i++) {
	          if (i in this && this[i] === item) {
	            return i;
	          }
	        }
	        return -1;
	      }
	      // Vendors: please allow content code to instantiate DOMExceptions
	      , DOMEx = function (type, message) {
	        this.name = type;
	        this.code = DOMException[type];
	        this.message = message;
	      }
	      , checkTokenAndGetIndex = function (classList, token) {
	        if (token === "") {
	          throw new DOMEx(
	              "SYNTAX_ERR"
	            , "An invalid or illegal string was specified"
	          );
	        }
	        if (/\s/.test(token)) {
	          throw new DOMEx(
	              "INVALID_CHARACTER_ERR"
	            , "String contains an invalid character"
	          );
	        }
	        return arrIndexOf.call(classList, token);
	      }
	      , ClassList = function (elem) {
	        var
	            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
	          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
	          , i = 0
	          , len = classes.length
	        ;
	        for (; i < len; i++) {
	          this.push(classes[i]);
	        }
	        this._updateClassName = function () {
	          elem.setAttribute("class", this.toString());
	        };
	      }
	      , classListProto = ClassList[protoProp] = []
	      , classListGetter = function () {
	        return new ClassList(this);
	      }
	    ;
	    // Most DOMException implementations don't allow calling DOMException's toString()
	    // on non-DOMExceptions. Error's toString() is sufficient here.
	    DOMEx[protoProp] = Error[protoProp];
	    classListProto.item = function (i) {
	      return this[i] || null;
	    };
	    classListProto.contains = function (token) {
	      token += "";
	      return checkTokenAndGetIndex(this, token) !== -1;
	    };
	    classListProto.add = function () {
	      var
	          tokens = arguments
	        , i = 0
	        , l = tokens.length
	        , token
	        , updated = false
	      ;
	      do {
	        token = tokens[i] + "";
	        if (checkTokenAndGetIndex(this, token) === -1) {
	          this.push(token);
	          updated = true;
	        }
	      }
	      while (++i < l);

	      if (updated) {
	        this._updateClassName();
	      }
	    };
	    classListProto.remove = function () {
	      var
	          tokens = arguments
	        , i = 0
	        , l = tokens.length
	        , token
	        , updated = false
	        , index
	      ;
	      do {
	        token = tokens[i] + "";
	        index = checkTokenAndGetIndex(this, token);
	        while (index !== -1) {
	          this.splice(index, 1);
	          updated = true;
	          index = checkTokenAndGetIndex(this, token);
	        }
	      }
	      while (++i < l);

	      if (updated) {
	        this._updateClassName();
	      }
	    };
	    classListProto.toggle = function (token, force) {
	      token += "";

	      var
	          result = this.contains(token)
	        , method = result ?
	          force !== true && "remove"
	        :
	          force !== false && "add"
	      ;

	      if (method) {
	        this[method](token);
	      }

	      if (force === true || force === false) {
	        return force;
	      } else {
	        return !result;
	      }
	    };
	    classListProto.toString = function () {
	      return this.join(" ");
	    };

	    if (objCtr.defineProperty) {
	      var classListPropDesc = {
	          get: classListGetter
	        , enumerable: true
	        , configurable: true
	      };
	      try {
	        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	      } catch (ex) { // IE 8 doesn't support enumerable:true
	        if (ex.number === -0x7FF5EC54) {
	          classListPropDesc.enumerable = false;
	          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	        }
	      }
	    } else if (objCtr[protoProp].__defineGetter__) {
	      elemCtrProto.__defineGetter__(classListProp, classListGetter);
	    }

	    }(window.self));

	    } else {
	    // There is full or partial native classList support, so just check if we need
	    // to normalize the add/remove and toggle APIs.

	    (function () {
	      "use strict";

	      var testElement = document.createElement("_");

	      testElement.classList.add("c1", "c2");

	      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
	      // classList.remove exist but support only one argument at a time.
	      if (!testElement.classList.contains("c2")) {
	        var createMethod = function(method) {
	          var original = DOMTokenList.prototype[method];

	          DOMTokenList.prototype[method] = function(token) {
	            var i, len = arguments.length;

	            for (i = 0; i < len; i++) {
	              token = arguments[i];
	              original.call(this, token);
	            }
	          };
	        };
	        createMethod('add');
	        createMethod('remove');
	      }

	      testElement.classList.toggle("c3", false);

	      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	      // support the second argument.
	      if (testElement.classList.contains("c3")) {
	        var _toggle = DOMTokenList.prototype.toggle;

	        DOMTokenList.prototype.toggle = function(token, force) {
	          if (1 in arguments && !this.contains(token) === !force) {
	            return force;
	          } else {
	            return _toggle.call(this, token);
	          }
	        };

	      }

	      testElement = null;
	    }());
	  }
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {module.exports = process.env.MEDIATOR_JS_COV
	  ? __webpack_require__(4)
	  : __webpack_require__(5);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* automatically generated by JSCoverage - do not edit */
	try {
	  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
	    // this is a browser window that was opened from another window

	    if (! top.opener._$jscoverage) {
	      top.opener._$jscoverage = {};
	    }
	  }
	}
	catch (e) {}

	try {
	  if (typeof top === 'object' && top !== null) {
	    // this is a browser window

	    try {
	      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
	        top._$jscoverage = top.opener._$jscoverage;
	      }
	    }
	    catch (e) {}

	    if (! top._$jscoverage) {
	      top._$jscoverage = {};
	    }
	  }
	}
	catch (e) {}

	try {
	  if (typeof top === 'object' && top !== null && top._$jscoverage) {
	    _$jscoverage = top._$jscoverage;
	  }
	}
	catch (e) {}
	if (typeof _$jscoverage !== 'object') {
	  _$jscoverage = {};
	}
	if (! _$jscoverage['mediator.js']) {
	  _$jscoverage['mediator.js'] = [];
	  _$jscoverage['mediator.js'][16] = 0;
	  _$jscoverage['mediator.js'][17] = 0;
	  _$jscoverage['mediator.js'][19] = 0;
	  _$jscoverage['mediator.js'][21] = 0;
	  _$jscoverage['mediator.js'][22] = 0;
	  _$jscoverage['mediator.js'][24] = 0;
	  _$jscoverage['mediator.js'][26] = 0;
	  _$jscoverage['mediator.js'][30] = 0;
	  _$jscoverage['mediator.js'][33] = 0;
	  _$jscoverage['mediator.js'][39] = 0;
	  _$jscoverage['mediator.js'][40] = 0;
	  _$jscoverage['mediator.js'][41] = 0;
	  _$jscoverage['mediator.js'][44] = 0;
	  _$jscoverage['mediator.js'][52] = 0;
	  _$jscoverage['mediator.js'][53] = 0;
	  _$jscoverage['mediator.js'][54] = 0;
	  _$jscoverage['mediator.js'][57] = 0;
	  _$jscoverage['mediator.js'][58] = 0;
	  _$jscoverage['mediator.js'][59] = 0;
	  _$jscoverage['mediator.js'][60] = 0;
	  _$jscoverage['mediator.js'][61] = 0;
	  _$jscoverage['mediator.js'][64] = 0;
	  _$jscoverage['mediator.js'][70] = 0;
	  _$jscoverage['mediator.js'][71] = 0;
	  _$jscoverage['mediator.js'][72] = 0;
	  _$jscoverage['mediator.js'][73] = 0;
	  _$jscoverage['mediator.js'][74] = 0;
	  _$jscoverage['mediator.js'][75] = 0;
	  _$jscoverage['mediator.js'][82] = 0;
	  _$jscoverage['mediator.js'][83] = 0;
	  _$jscoverage['mediator.js'][84] = 0;
	  _$jscoverage['mediator.js'][87] = 0;
	  _$jscoverage['mediator.js'][88] = 0;
	  _$jscoverage['mediator.js'][89] = 0;
	  _$jscoverage['mediator.js'][90] = 0;
	  _$jscoverage['mediator.js'][91] = 0;
	  _$jscoverage['mediator.js'][100] = 0;
	  _$jscoverage['mediator.js'][102] = 0;
	  _$jscoverage['mediator.js'][104] = 0;
	  _$jscoverage['mediator.js'][108] = 0;
	  _$jscoverage['mediator.js'][110] = 0;
	  _$jscoverage['mediator.js'][111] = 0;
	  _$jscoverage['mediator.js'][113] = 0;
	  _$jscoverage['mediator.js'][115] = 0;
	  _$jscoverage['mediator.js'][118] = 0;
	  _$jscoverage['mediator.js'][120] = 0;
	  _$jscoverage['mediator.js'][127] = 0;
	  _$jscoverage['mediator.js'][131] = 0;
	  _$jscoverage['mediator.js'][134] = 0;
	  _$jscoverage['mediator.js'][135] = 0;
	  _$jscoverage['mediator.js'][136] = 0;
	  _$jscoverage['mediator.js'][146] = 0;
	  _$jscoverage['mediator.js'][150] = 0;
	  _$jscoverage['mediator.js'][151] = 0;
	  _$jscoverage['mediator.js'][152] = 0;
	  _$jscoverage['mediator.js'][154] = 0;
	  _$jscoverage['mediator.js'][157] = 0;
	  _$jscoverage['mediator.js'][158] = 0;
	  _$jscoverage['mediator.js'][159] = 0;
	  _$jscoverage['mediator.js'][161] = 0;
	  _$jscoverage['mediator.js'][162] = 0;
	  _$jscoverage['mediator.js'][166] = 0;
	  _$jscoverage['mediator.js'][170] = 0;
	  _$jscoverage['mediator.js'][174] = 0;
	  _$jscoverage['mediator.js'][178] = 0;
	  _$jscoverage['mediator.js'][180] = 0;
	  _$jscoverage['mediator.js'][183] = 0;
	  _$jscoverage['mediator.js'][184] = 0;
	  _$jscoverage['mediator.js'][185] = 0;
	  _$jscoverage['mediator.js'][189] = 0;
	  _$jscoverage['mediator.js'][190] = 0;
	  _$jscoverage['mediator.js'][191] = 0;
	  _$jscoverage['mediator.js'][192] = 0;
	  _$jscoverage['mediator.js'][201] = 0;
	  _$jscoverage['mediator.js'][207] = 0;
	  _$jscoverage['mediator.js'][208] = 0;
	  _$jscoverage['mediator.js'][209] = 0;
	  _$jscoverage['mediator.js'][210] = 0;
	  _$jscoverage['mediator.js'][211] = 0;
	  _$jscoverage['mediator.js'][212] = 0;
	  _$jscoverage['mediator.js'][213] = 0;
	  _$jscoverage['mediator.js'][216] = 0;
	  _$jscoverage['mediator.js'][217] = 0;
	  _$jscoverage['mediator.js'][221] = 0;
	  _$jscoverage['mediator.js'][222] = 0;
	  _$jscoverage['mediator.js'][224] = 0;
	  _$jscoverage['mediator.js'][225] = 0;
	  _$jscoverage['mediator.js'][227] = 0;
	  _$jscoverage['mediator.js'][232] = 0;
	  _$jscoverage['mediator.js'][233] = 0;
	  _$jscoverage['mediator.js'][236] = 0;
	  _$jscoverage['mediator.js'][240] = 0;
	  _$jscoverage['mediator.js'][241] = 0;
	  _$jscoverage['mediator.js'][242] = 0;
	  _$jscoverage['mediator.js'][245] = 0;
	  _$jscoverage['mediator.js'][251] = 0;
	  _$jscoverage['mediator.js'][257] = 0;
	  _$jscoverage['mediator.js'][262] = 0;
	  _$jscoverage['mediator.js'][263] = 0;
	  _$jscoverage['mediator.js'][266] = 0;
	  _$jscoverage['mediator.js'][267] = 0;
	  _$jscoverage['mediator.js'][269] = 0;
	  _$jscoverage['mediator.js'][270] = 0;
	  _$jscoverage['mediator.js'][273] = 0;
	  _$jscoverage['mediator.js'][277] = 0;
	  _$jscoverage['mediator.js'][287] = 0;
	  _$jscoverage['mediator.js'][289] = 0;
	  _$jscoverage['mediator.js'][290] = 0;
	  _$jscoverage['mediator.js'][292] = 0;
	  _$jscoverage['mediator.js'][302] = 0;
	  _$jscoverage['mediator.js'][303] = 0;
	  _$jscoverage['mediator.js'][305] = 0;
	  _$jscoverage['mediator.js'][312] = 0;
	  _$jscoverage['mediator.js'][319] = 0;
	  _$jscoverage['mediator.js'][328] = 0;
	  _$jscoverage['mediator.js'][331] = 0;
	  _$jscoverage['mediator.js'][333] = 0;
	  _$jscoverage['mediator.js'][338] = 0;
	  _$jscoverage['mediator.js'][339] = 0;
	  _$jscoverage['mediator.js'][340] = 0;
	  _$jscoverage['mediator.js'][341] = 0;
	  _$jscoverage['mediator.js'][342] = 0;
	  _$jscoverage['mediator.js'][346] = 0;
	  _$jscoverage['mediator.js'][347] = 0;
	  _$jscoverage['mediator.js'][348] = 0;
	}
	_$jscoverage['mediator.js'].source = ["/*jslint bitwise: true, nomen: true, plusplus: true, white: true */","","/*!","* Mediator.js Library v0.9.0","* https://github.com/ajacksified/Mediator.js","*","* Copyright 2013, Jack Lawson","* MIT Licensed (http://www.opensource.org/licenses/mit-license.php)","*","* For more information: http://thejacklawson.com/2011/06/mediators-for-modularized-asynchronous-programming-in-javascript/index.html","* Project on GitHub: https://github.com/ajacksified/Mediator.js","*","* Last update: Jan 04 2013","*/","","(function(root, factory) {","  'use strict';","","  if(typeof root.exports === 'function') {","    // Node/CommonJS","    root.exports.Mediator = factory();","  } else if(typeof root.define === 'function' &amp;&amp; root.define.amd) {","    // AMD","    root.define([], function() {","      // Export to global too, for backward compatiblity","      root.Mediator = factory();","    });","  } else {","    // Browser global","    root.Mediator = factory();","  }","}(this, function() {","  'use strict';","","  // We'll generate guids for class instances for easy referencing later on.","  // Subscriber instances will have an id that can be refernced for quick","  // lookups.","","  function guidGenerator() {","    var S4 = function() {","       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);","    };","","    return (S4()+S4()+\"-\"+S4()+\"-\"+S4()+\"-\"+S4()+\"-\"+S4()+S4()+S4());","  }","","  // Subscribers are instances of Mediator Channel registrations. We generate","  // an object instance so that it can be updated later on without having to","  // unregister and re-register. Subscribers are constructed with a function","  // to be called, options object, and context.","","  function Subscriber(fn, options, context){","    if(!(this instanceof Subscriber)) {","      return new Subscriber(fn, options, context);","    }","","    this.id = guidGenerator();","    this.fn = fn;","    this.options = options;","    this.context = context;","    this.channel = null;","  }","","  Subscriber.prototype = {","    // Mediator.update on a subscriber instance can update its function,context,","    // or options object. It takes in an object and looks for fn, context, or","    // options keys.","","    update: function(options){","      if(options){","        this.fn = options.fn || this.fn;","        this.context = options.context || this.context;","        this.options = options.options || this.options;","        if(this.channel &amp;&amp; this.options &amp;&amp; this.options.priority !== undefined) {","            this.channel.setPriority(this.id, this.options.priority);","        }","      }","    }","  };","","","  function Channel(namespace, parent){","    if(!(this instanceof Channel)) {","      return new Channel(namespace);","    }","","    this.namespace = namespace || \"\";","    this._subscribers = [];","    this._channels = [];","    this._parent = parent;","    this.stopped = false;","  }","","  // A Mediator channel holds a list of sub-channels and subscribers to be fired","  // when Mediator.publish is called on the Mediator instance. It also contains","  // some methods to manipulate its lists of data; only setPriority and","  // StopPropagation are meant to be used. The other methods should be accessed","  // through the Mediator instance.","","  Channel.prototype = {","    addSubscriber: function(fn, options, context){","      var subscriber = new Subscriber(fn, options, context);","","      if(options &amp;&amp; options.priority !== undefined){","        // Cheap hack to either parse as an int or turn it into 0. Runs faster","        // in many browsers than parseInt with the benefit that it won't","        // return a NaN.","        options.priority = options.priority &gt;&gt; 0;","","        if(options.priority &lt; 0){ options.priority = 0; }","        if(options.priority &gt;= this._subscribers.length){ options.priority = this._subscribers.length-1; }","","        this._subscribers.splice(options.priority, 0, subscriber);","      }else{","        this._subscribers.push(subscriber);","      }","","      subscriber.channel = this;","","      return subscriber;","    },","","    // The channel instance is passed as an argument to the mediator subscriber,","    // and further subscriber propagation can be called with","    // channel.StopPropagation().","    stopPropagation: function(){","      this.stopped = true;","    },","","    getSubscriber: function(identifier){","      var x = 0,","          y = this._subscribers.length;","","      for(x, y; x &lt; y; x++){","        if(this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier){","          return this._subscribers[x];","        }","      }","    },","","    // Channel.setPriority is useful in updating the order in which Subscribers","    // are called, and takes an identifier (subscriber id or named function) and","    // an array index. It will not search recursively through subchannels.","","    setPriority: function(identifier, priority){","      var oldIndex = 0,","          x = 0,","          sub, firstHalf, lastHalf, y;","","      for(x = 0, y = this._subscribers.length; x &lt; y; x++){","        if(this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier){","          break;","        }","        oldIndex ++;","      }","","      sub = this._subscribers[oldIndex];","      firstHalf = this._subscribers.slice(0, oldIndex);","      lastHalf = this._subscribers.slice(oldIndex+1);","","      this._subscribers = firstHalf.concat(lastHalf);","      this._subscribers.splice(priority, 0, sub);","    },","","    addChannel: function(channel){","      this._channels[channel] = new Channel((this.namespace ? this.namespace + ':' : '') + channel, this);","    },","","    hasChannel: function(channel){","      return this._channels.hasOwnProperty(channel);","    },","","    returnChannel: function(channel){","      return this._channels[channel];","    },","","    removeSubscriber: function(identifier){","      var x = 0,","          y;","          y = this._subscribers.length;","","      // If we don't pass in an id, we're clearing all","      if(!identifier){","        this._subscribers = [];","        return;","      }","","      // Going backwards makes splicing a whole lot easier.","      for(x, y; y &gt; x; y--) {","        if(this._subscribers[x].fn === identifier || this._subscribers[x].id === identifier){","          this._subscribers[x].channel = null;","          this._subscribers.splice(x,1);","        }","      }","    },","","    // This will publish arbitrary arguments to a subscriber and then to parent","    // channels.","","    publish: function(data){","      var x = 0,","          y = this._subscribers.length,","          called = false,","          subscriber, l;","","      // Priority is preserved in the _subscribers index.","      for(x, y; x &lt; y; x++) {","        if(!this.stopped){","          subscriber = this._subscribers[x];","          if(subscriber.options !== undefined &amp;&amp; typeof subscriber.options.predicate === \"function\"){","            if(subscriber.options.predicate.apply(subscriber.context, data)){","              subscriber.fn.apply(subscriber.context, data);","              called = true;","            }","          }else{","            subscriber.fn.apply(subscriber.context, data);","            called = true;","          }","        }","","        if(called &amp;&amp; subscriber.options &amp;&amp; subscriber.options !== undefined){","          subscriber.options.calls--;","","          if(subscriber.options.calls &lt; 1){","            this.removeSubscriber(subscriber.id);","          }else{","            subscriber.update(subscriber.options);","          }","        }","      }","","      if(this._parent){","        this._parent.publish(data);","      }","","      this.stopped = false;","    }","  };","","  function Mediator() {","    if(!(this instanceof Mediator)) {","      return new Mediator();","    }","","    this._channels = new Channel('');","  }","","  // A Mediator instance is the interface through which events are registered","  // and removed from publish channels.","","  Mediator.prototype = {","","    // Returns a channel instance based on namespace, for example","    // application:chat:message:received","","    getChannel: function(namespace){","      var channel = this._channels,","          namespaceHierarchy = namespace.split(':'),","          x = 0, ","          y = namespaceHierarchy.length;","","      if(namespace === ''){","        return channel;","      }","","      if(namespaceHierarchy.length &gt; 0){","        for(x, y; x &lt; y; x++){","","          if(!channel.hasChannel(namespaceHierarchy[x])){","            channel.addChannel(namespaceHierarchy[x]);","          }","","          channel = channel.returnChannel(namespaceHierarchy[x]);","        }","      }","","      return channel;","    },","","    // Pass in a channel namespace, function to be called, options, and context","    // to call the function in to Subscribe. It will create a channel if one","    // does not exist. Options can include a predicate to determine if it","    // should be called (based on the data published to it) and a priority","    // index.","","    subscribe: function(channelName, fn, options, context){","      var channel = this.getChannel(channelName);","","      options = options || {};","      context = context || {};","","      return channel.addSubscriber(fn, options, context);","    },","","    // Pass in a channel namespace, function to be called, options, and context","    // to call the function in to Subscribe. It will create a channel if one","    // does not exist. Options can include a predicate to determine if it","    // should be called (based on the data published to it) and a priority","    // index.","","    once: function(channelName, fn, options, context){","      options = options || {};","      options.calls = 1;","","      return this.subscribe(channelName, fn, options, context);","    },","","    // Returns a subscriber for a given subscriber id / named function and","    // channel namespace","","    getSubscriber: function(identifier, channel){","      return this.getChannel(channel || \"\").getSubscriber(identifier);","    },","","    // Remove a subscriber from a given channel namespace recursively based on","    // a passed-in subscriber id or named function.","","    remove: function(channelName, identifier){","      this.getChannel(channelName).removeSubscriber(identifier);","    },","","    // Publishes arbitrary data to a given channel namespace. Channels are","    // called recursively downwards; a post to application:chat will post to","    // application:chat:receive and application:chat:derp:test:beta:bananas.","    // Called using Mediator.publish(\"application:chat\", [ args ]);","","    publish: function(channelName){","      var args = Array.prototype.slice.call(arguments, 1),","          channel = this.getChannel(channelName);","","      args.push(channel);","","      this.getChannel(channelName).publish(args);","    }","  };","","  // Alias some common names for easy interop","  Mediator.prototype.on = Mediator.prototype.subscribe;","  Mediator.prototype.bind = Mediator.prototype.subscribe;","  Mediator.prototype.emit = Mediator.prototype.publish;","  Mediator.prototype.trigger = Mediator.prototype.publish;","  Mediator.prototype.off = Mediator.prototype.remove;","","  // Finally, expose it all.","","  Mediator.Channel = Channel;","  Mediator.Subscriber = Subscriber;","  return Mediator;","}));"];
	_$jscoverage['mediator.js'][16]++;
	(function (root, factory) {
	  _$jscoverage['mediator.js'][17]++;
	  "use strict";
	  _$jscoverage['mediator.js'][19]++;
	  if (((typeof root.exports) === "function")) {
	    _$jscoverage['mediator.js'][21]++;
	    root.exports.Mediator = factory();
	  }
	  else {
	    _$jscoverage['mediator.js'][22]++;
	    if ((((typeof root.define) === "function") && root.define.amd)) {
	      _$jscoverage['mediator.js'][24]++;
	      root.define([], (function () {
	  _$jscoverage['mediator.js'][26]++;
	  root.Mediator = factory();
	}));
	    }
	    else {
	      _$jscoverage['mediator.js'][30]++;
	      root.Mediator = factory();
	    }
	  }
	})(this, (function () {
	  _$jscoverage['mediator.js'][33]++;
	  "use strict";
	  _$jscoverage['mediator.js'][39]++;
	  function guidGenerator() {
	    _$jscoverage['mediator.js'][40]++;
	    var S4 = (function () {
	  _$jscoverage['mediator.js'][41]++;
	  return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
	});
	    _$jscoverage['mediator.js'][44]++;
	    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}
	  _$jscoverage['mediator.js'][52]++;
	  function Subscriber(fn, options, context) {
	    _$jscoverage['mediator.js'][53]++;
	    if ((! (this instanceof Subscriber))) {
	      _$jscoverage['mediator.js'][54]++;
	      return new Subscriber(fn, options, context);
	    }
	    _$jscoverage['mediator.js'][57]++;
	    this.id = guidGenerator();
	    _$jscoverage['mediator.js'][58]++;
	    this.fn = fn;
	    _$jscoverage['mediator.js'][59]++;
	    this.options = options;
	    _$jscoverage['mediator.js'][60]++;
	    this.context = context;
	    _$jscoverage['mediator.js'][61]++;
	    this.channel = null;
	}
	  _$jscoverage['mediator.js'][64]++;
	  Subscriber.prototype = {update: (function (options) {
	  _$jscoverage['mediator.js'][70]++;
	  if (options) {
	    _$jscoverage['mediator.js'][71]++;
	    this.fn = (options.fn || this.fn);
	    _$jscoverage['mediator.js'][72]++;
	    this.context = (options.context || this.context);
	    _$jscoverage['mediator.js'][73]++;
	    this.options = (options.options || this.options);
	    _$jscoverage['mediator.js'][74]++;
	    if ((this.channel && this.options && (this.options.priority !== undefined))) {
	      _$jscoverage['mediator.js'][75]++;
	      this.channel.setPriority(this.id, this.options.priority);
	    }
	  }
	})};
	  _$jscoverage['mediator.js'][82]++;
	  function Channel(namespace, parent) {
	    _$jscoverage['mediator.js'][83]++;
	    if ((! (this instanceof Channel))) {
	      _$jscoverage['mediator.js'][84]++;
	      return new Channel(namespace);
	    }
	    _$jscoverage['mediator.js'][87]++;
	    this.namespace = (namespace || "");
	    _$jscoverage['mediator.js'][88]++;
	    this._subscribers = [];
	    _$jscoverage['mediator.js'][89]++;
	    this._channels = [];
	    _$jscoverage['mediator.js'][90]++;
	    this._parent = parent;
	    _$jscoverage['mediator.js'][91]++;
	    this.stopped = false;
	}
	  _$jscoverage['mediator.js'][100]++;
	  Channel.prototype = {addSubscriber: (function (fn, options, context) {
	  _$jscoverage['mediator.js'][102]++;
	  var subscriber = new Subscriber(fn, options, context);
	  _$jscoverage['mediator.js'][104]++;
	  if ((options && (options.priority !== undefined))) {
	    _$jscoverage['mediator.js'][108]++;
	    options.priority = (options.priority >> 0);
	    _$jscoverage['mediator.js'][110]++;
	    if ((options.priority < 0)) {
	      _$jscoverage['mediator.js'][110]++;
	      options.priority = 0;
	    }
	    _$jscoverage['mediator.js'][111]++;
	    if ((options.priority >= this._subscribers.length)) {
	      _$jscoverage['mediator.js'][111]++;
	      options.priority = (this._subscribers.length - 1);
	    }
	    _$jscoverage['mediator.js'][113]++;
	    this._subscribers.splice(options.priority, 0, subscriber);
	  }
	  else {
	    _$jscoverage['mediator.js'][115]++;
	    this._subscribers.push(subscriber);
	  }
	  _$jscoverage['mediator.js'][118]++;
	  subscriber.channel = this;
	  _$jscoverage['mediator.js'][120]++;
	  return subscriber;
	}), stopPropagation: (function () {
	  _$jscoverage['mediator.js'][127]++;
	  this.stopped = true;
	}), getSubscriber: (function (identifier) {
	  _$jscoverage['mediator.js'][131]++;
	  var x = 0, y = this._subscribers.length;
	  _$jscoverage['mediator.js'][134]++;
	  for ((x, y); (x < y); (x++)) {
	    _$jscoverage['mediator.js'][135]++;
	    if (((this._subscribers[x].id === identifier) || (this._subscribers[x].fn === identifier))) {
	      _$jscoverage['mediator.js'][136]++;
	      return this._subscribers[x];
	    }
	}
	}), setPriority: (function (identifier, priority) {
	  _$jscoverage['mediator.js'][146]++;
	  var oldIndex = 0, x = 0, sub, firstHalf, lastHalf, y;
	  _$jscoverage['mediator.js'][150]++;
	  for (((x = 0), (y = this._subscribers.length)); (x < y); (x++)) {
	    _$jscoverage['mediator.js'][151]++;
	    if (((this._subscribers[x].id === identifier) || (this._subscribers[x].fn === identifier))) {
	      _$jscoverage['mediator.js'][152]++;
	      break;
	    }
	    _$jscoverage['mediator.js'][154]++;
	    (oldIndex++);
	}
	  _$jscoverage['mediator.js'][157]++;
	  sub = this._subscribers[oldIndex];
	  _$jscoverage['mediator.js'][158]++;
	  firstHalf = this._subscribers.slice(0, oldIndex);
	  _$jscoverage['mediator.js'][159]++;
	  lastHalf = this._subscribers.slice((oldIndex + 1));
	  _$jscoverage['mediator.js'][161]++;
	  this._subscribers = firstHalf.concat(lastHalf);
	  _$jscoverage['mediator.js'][162]++;
	  this._subscribers.splice(priority, 0, sub);
	}), addChannel: (function (channel) {
	  _$jscoverage['mediator.js'][166]++;
	  this._channels[channel] = new Channel(((this.namespace? (this.namespace + ":"): "") + channel), this);
	}), hasChannel: (function (channel) {
	  _$jscoverage['mediator.js'][170]++;
	  return this._channels.hasOwnProperty(channel);
	}), returnChannel: (function (channel) {
	  _$jscoverage['mediator.js'][174]++;
	  return this._channels[channel];
	}), removeSubscriber: (function (identifier) {
	  _$jscoverage['mediator.js'][178]++;
	  var x = 0, y;
	  _$jscoverage['mediator.js'][180]++;
	  y = this._subscribers.length;
	  _$jscoverage['mediator.js'][183]++;
	  if ((! identifier)) {
	    _$jscoverage['mediator.js'][184]++;
	    this._subscribers = [];
	    _$jscoverage['mediator.js'][185]++;
	    return;
	  }
	  _$jscoverage['mediator.js'][189]++;
	  for ((x, y); (y > x); (y--)) {
	    _$jscoverage['mediator.js'][190]++;
	    if (((this._subscribers[x].fn === identifier) || (this._subscribers[x].id === identifier))) {
	      _$jscoverage['mediator.js'][191]++;
	      this._subscribers[x].channel = null;
	      _$jscoverage['mediator.js'][192]++;
	      this._subscribers.splice(x, 1);
	    }
	}
	}), publish: (function (data) {
	  _$jscoverage['mediator.js'][201]++;
	  var x = 0, y = this._subscribers.length, called = false, subscriber, l;
	  _$jscoverage['mediator.js'][207]++;
	  for ((x, y); (x < y); (x++)) {
	    _$jscoverage['mediator.js'][208]++;
	    if ((! this.stopped)) {
	      _$jscoverage['mediator.js'][209]++;
	      subscriber = this._subscribers[x];
	      _$jscoverage['mediator.js'][210]++;
	      if (((subscriber.options !== undefined) && ((typeof subscriber.options.predicate) === "function"))) {
	        _$jscoverage['mediator.js'][211]++;
	        if (subscriber.options.predicate.apply(subscriber.context, data)) {
	          _$jscoverage['mediator.js'][212]++;
	          subscriber.fn.apply(subscriber.context, data);
	          _$jscoverage['mediator.js'][213]++;
	          called = true;
	        }
	      }
	      else {
	        _$jscoverage['mediator.js'][216]++;
	        subscriber.fn.apply(subscriber.context, data);
	        _$jscoverage['mediator.js'][217]++;
	        called = true;
	      }
	    }
	    _$jscoverage['mediator.js'][221]++;
	    if ((called && subscriber.options && (subscriber.options !== undefined))) {
	      _$jscoverage['mediator.js'][222]++;
	      (subscriber.options.calls--);
	      _$jscoverage['mediator.js'][224]++;
	      if ((subscriber.options.calls < 1)) {
	        _$jscoverage['mediator.js'][225]++;
	        this.removeSubscriber(subscriber.id);
	      }
	      else {
	        _$jscoverage['mediator.js'][227]++;
	        subscriber.update(subscriber.options);
	      }
	    }
	}
	  _$jscoverage['mediator.js'][232]++;
	  if (this._parent) {
	    _$jscoverage['mediator.js'][233]++;
	    this._parent.publish(data);
	  }
	  _$jscoverage['mediator.js'][236]++;
	  this.stopped = false;
	})};
	  _$jscoverage['mediator.js'][240]++;
	  function Mediator() {
	    _$jscoverage['mediator.js'][241]++;
	    if ((! (this instanceof Mediator))) {
	      _$jscoverage['mediator.js'][242]++;
	      return new Mediator();
	    }
	    _$jscoverage['mediator.js'][245]++;
	    this._channels = new Channel("");
	}
	  _$jscoverage['mediator.js'][251]++;
	  Mediator.prototype = {getChannel: (function (namespace) {
	  _$jscoverage['mediator.js'][257]++;
	  var channel = this._channels, namespaceHierarchy = namespace.split(":"), x = 0, y = namespaceHierarchy.length;
	  _$jscoverage['mediator.js'][262]++;
	  if ((namespace === "")) {
	    _$jscoverage['mediator.js'][263]++;
	    return channel;
	  }
	  _$jscoverage['mediator.js'][266]++;
	  if ((namespaceHierarchy.length > 0)) {
	    _$jscoverage['mediator.js'][267]++;
	    for ((x, y); (x < y); (x++)) {
	      _$jscoverage['mediator.js'][269]++;
	      if ((! channel.hasChannel(namespaceHierarchy[x]))) {
	        _$jscoverage['mediator.js'][270]++;
	        channel.addChannel(namespaceHierarchy[x]);
	      }
	      _$jscoverage['mediator.js'][273]++;
	      channel = channel.returnChannel(namespaceHierarchy[x]);
	}
	  }
	  _$jscoverage['mediator.js'][277]++;
	  return channel;
	}), subscribe: (function (channelName, fn, options, context) {
	  _$jscoverage['mediator.js'][287]++;
	  var channel = this.getChannel(channelName);
	  _$jscoverage['mediator.js'][289]++;
	  options = (options || {});
	  _$jscoverage['mediator.js'][290]++;
	  context = (context || {});
	  _$jscoverage['mediator.js'][292]++;
	  return channel.addSubscriber(fn, options, context);
	}), once: (function (channelName, fn, options, context) {
	  _$jscoverage['mediator.js'][302]++;
	  options = (options || {});
	  _$jscoverage['mediator.js'][303]++;
	  options.calls = 1;
	  _$jscoverage['mediator.js'][305]++;
	  return this.subscribe(channelName, fn, options, context);
	}), getSubscriber: (function (identifier, channel) {
	  _$jscoverage['mediator.js'][312]++;
	  return this.getChannel((channel || "")).getSubscriber(identifier);
	}), remove: (function (channelName, identifier) {
	  _$jscoverage['mediator.js'][319]++;
	  this.getChannel(channelName).removeSubscriber(identifier);
	}), publish: (function (channelName) {
	  _$jscoverage['mediator.js'][328]++;
	  var args = Array.prototype.slice.call(arguments, 1), channel = this.getChannel(channelName);
	  _$jscoverage['mediator.js'][331]++;
	  args.push(channel);
	  _$jscoverage['mediator.js'][333]++;
	  this.getChannel(channelName).publish(args);
	})};
	  _$jscoverage['mediator.js'][338]++;
	  Mediator.prototype.on = Mediator.prototype.subscribe;
	  _$jscoverage['mediator.js'][339]++;
	  Mediator.prototype.bind = Mediator.prototype.subscribe;
	  _$jscoverage['mediator.js'][340]++;
	  Mediator.prototype.emit = Mediator.prototype.publish;
	  _$jscoverage['mediator.js'][341]++;
	  Mediator.prototype.trigger = Mediator.prototype.publish;
	  _$jscoverage['mediator.js'][342]++;
	  Mediator.prototype.off = Mediator.prototype.remove;
	  _$jscoverage['mediator.js'][346]++;
	  Mediator.Channel = Channel;
	  _$jscoverage['mediator.js'][347]++;
	  Mediator.Subscriber = Subscriber;
	  _$jscoverage['mediator.js'][348]++;
	  return Mediator;
	}));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint bitwise: true, nomen: true, plusplus: true, white: true */

	/*!
	* Mediator.js Library v0.9.8
	* https://github.com/ajacksified/Mediator.js
	*
	* Copyright 2013, Jack Lawson
	* MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
	*
	* For more information: http://thejacklawson.com/2011/06/mediators-for-modularized-asynchronous-programming-in-javascript/index.html
	* Project on GitHub: https://github.com/ajacksified/Mediator.js
	*
	* Last update: October 19 2013
	*/

	(function(global, factory) {
	  'use strict';

	  if (true) {
	    // AMD
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      global.Mediator = factory();
	      return global.Mediator;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports !== 'undefined') {
	    // Node/CommonJS
	    exports.Mediator = factory();
	  } else {
	    // Browser global
	    global.Mediator = factory();
	  }
	}(this, function() {
	  'use strict';

	  // We'll generate guids for class instances for easy referencing later on.
	  // Subscriber instances will have an id that can be refernced for quick
	  // lookups.

	  function guidGenerator() {
	    var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };

	    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	  }

	  // Subscribers are instances of Mediator Channel registrations. We generate
	  // an object instance so that it can be updated later on without having to
	  // unregister and re-register. Subscribers are constructed with a function
	  // to be called, options object, and context.

	  function Subscriber(fn, options, context) {
	    if (!(this instanceof Subscriber)) {
	      return new Subscriber(fn, options, context);
	    }

	    this.id = guidGenerator();
	    this.fn = fn;
	    this.options = options;
	    this.context = context;
	    this.channel = null;
	  }

	  // Mediator.update on a subscriber instance can update its function,context,
	  // or options object. It takes in an object and looks for fn, context, or
	  // options keys.
	  Subscriber.prototype.update = function(options) {
	    if (options) {
	      this.fn = options.fn || this.fn;
	      this.context = options.context || this.context;
	      this.options = options.options || this.options;
	      if (this.channel && this.options && this.options.priority !== undefined) {
	          this.channel.setPriority(this.id, this.options.priority);
	      }
	    }
	  }


	  function Channel(namespace, parent) {
	    if (!(this instanceof Channel)) {
	      return new Channel(namespace);
	    }

	    this.namespace = namespace || "";
	    this._subscribers = [];
	    this._channels = {};
	    this._parent = parent;
	    this.stopped = false;
	  }

	  // A Mediator channel holds a list of sub-channels and subscribers to be fired
	  // when Mediator.publish is called on the Mediator instance. It also contains
	  // some methods to manipulate its lists of data; only setPriority and
	  // StopPropagation are meant to be used. The other methods should be accessed
	  // through the Mediator instance.
	  Channel.prototype.addSubscriber = function(fn, options, context) {
	    var subscriber = new Subscriber(fn, options, context);

	    if (options && options.priority !== undefined) {
	      // Cheap hack to either parse as an int or turn it into 0. Runs faster
	      // in many browsers than parseInt with the benefit that it won't
	      // return a NaN.
	      options.priority = options.priority >> 0;

	      if (options.priority < 0) { options.priority = 0; }
	      if (options.priority >= this._subscribers.length) { options.priority = this._subscribers.length-1; }

	      this._subscribers.splice(options.priority, 0, subscriber);
	    }else{
	      this._subscribers.push(subscriber);
	    }

	    subscriber.channel = this;

	    return subscriber;
	  }

	  // The channel instance is passed as an argument to the mediator subscriber,
	  // and further subscriber propagation can be called with
	  // channel.StopPropagation().
	  Channel.prototype.stopPropagation = function() {
	    this.stopped = true;
	  }

	  Channel.prototype.getSubscriber = function(identifier) {
	    var x = 0,
	        y = this._subscribers.length;

	    for(x, y; x < y; x++) {
	      if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
	        return this._subscribers[x];
	      }
	    }
	  }

	  // Channel.setPriority is useful in updating the order in which Subscribers
	  // are called, and takes an identifier (subscriber id or named function) and
	  // an array index. It will not search recursively through subchannels.

	  Channel.prototype.setPriority = function(identifier, priority) {
	    var oldIndex = 0,
	        x = 0,
	        sub, firstHalf, lastHalf, y;

	    for(x = 0, y = this._subscribers.length; x < y; x++) {
	      if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
	        break;
	      }
	      oldIndex ++;
	    }

	    sub = this._subscribers[oldIndex];
	    firstHalf = this._subscribers.slice(0, oldIndex);
	    lastHalf = this._subscribers.slice(oldIndex+1);

	    this._subscribers = firstHalf.concat(lastHalf);
	    this._subscribers.splice(priority, 0, sub);
	  }

	  Channel.prototype.addChannel = function(channel) {
	    this._channels[channel] = new Channel((this.namespace ? this.namespace + ':' : '') + channel, this);
	  }

	  Channel.prototype.hasChannel = function(channel) {
	    return this._channels.hasOwnProperty(channel);
	  }

	  Channel.prototype.returnChannel = function(channel) {
	    return this._channels[channel];
	  }

	  Channel.prototype.removeSubscriber = function(identifier) {
	    var x = this._subscribers.length - 1;

	    // If we don't pass in an id, we're clearing all
	    if (!identifier) {
	      this._subscribers = [];
	      return;
	    }

	    // Going backwards makes splicing a whole lot easier.
	    for(x; x >= 0; x--) {
	      if (this._subscribers[x].fn === identifier || this._subscribers[x].id === identifier) {
	        this._subscribers[x].channel = null;
	        this._subscribers.splice(x,1);
	      }
	    }
	  }

	    // This will publish arbitrary arguments to a subscriber and then to parent
	    // channels.

	  Channel.prototype.publish = function(data) {
	    var x = 0,
	        y = this._subscribers.length,
	        shouldCall = false,
	        subscriber, l,
	        subsBefore,subsAfter;

	    // Priority is preserved in the _subscribers index.
	    for(x, y; x < y; x++) {
	      // By default set the flag to false
	      shouldCall = false;
	      subscriber = this._subscribers[x];

	      if (!this.stopped) {
	        subsBefore = this._subscribers.length;
	        if (subscriber.options !== undefined && typeof subscriber.options.predicate === "function") {
	          if (subscriber.options.predicate.apply(subscriber.context, data)) {
	            // The predicate matches, the callback function should be called
	            shouldCall = true;
	          }
	        }else{
	          // There is no predicate to match, the callback should always be called
	          shouldCall = true;
	        }
	      }

	      // Check if the callback should be called
	      if (shouldCall) {
	        // Check if the subscriber has options and if this include the calls options
	        if (subscriber.options && subscriber.options.calls !== undefined) {
	          // Decrease the number of calls left by one
	          subscriber.options.calls--;
	          // Once the number of calls left reaches zero or less we need to remove the subscriber
	          if (subscriber.options.calls < 1) {
	            this.removeSubscriber(subscriber.id);
	          }
	        }
	        // Now we call the callback, if this in turns publishes to the same channel it will no longer
	        // cause the callback to be called as we just removed it as a subscriber
	        subscriber.fn.apply(subscriber.context, data);

	        subsAfter = this._subscribers.length;
	        y = subsAfter;
	        if (subsAfter === subsBefore - 1) {
	          x--;
	        }
	      }
	    }

	    if (this._parent) {
	      this._parent.publish(data);
	    }

	    this.stopped = false;
	  }

	  function Mediator() {
	    if (!(this instanceof Mediator)) {
	      return new Mediator();
	    }

	    this._channels = new Channel('');
	  }

	  // A Mediator instance is the interface through which events are registered
	  // and removed from publish channels.

	  // Returns a channel instance based on namespace, for example
	  // application:chat:message:received. If readOnly is true we
	  // will refrain from creating non existing channels.
	  Mediator.prototype.getChannel = function(namespace, readOnly) {
	    var channel = this._channels,
	        namespaceHierarchy = namespace.split(':'),
	        x = 0,
	        y = namespaceHierarchy.length;

	    if (namespace === '') {
	      return channel;
	    }

	    if (namespaceHierarchy.length > 0) {
	      for(x, y; x < y; x++) {

	        if (!channel.hasChannel(namespaceHierarchy[x])) {
	          if (readOnly) {
	            break;
	          } else {
	            channel.addChannel(namespaceHierarchy[x]);
	          }
	        }

	        channel = channel.returnChannel(namespaceHierarchy[x]);
	      }
	    }

	    return channel;
	  }

	  // Pass in a channel namespace, function to be called, options, and context
	  // to call the function in to Subscribe. It will create a channel if one
	  // does not exist. Options can include a predicate to determine if it
	  // should be called (based on the data published to it) and a priority
	  // index.

	  Mediator.prototype.subscribe = function(channelName, fn, options, context) {
	    var channel = this.getChannel(channelName || "", false);

	    options = options || {};
	    context = context || {};

	    return channel.addSubscriber(fn, options, context);
	  }

	  // Pass in a channel namespace, function to be called, options, and context
	  // to call the function in to Subscribe. It will create a channel if one
	  // does not exist. Options can include a predicate to determine if it
	  // should be called (based on the data published to it) and a priority
	  // index.

	  Mediator.prototype.once = function(channelName, fn, options, context) {
	    options = options || {};
	    options.calls = 1;

	    return this.subscribe(channelName, fn, options, context);
	  }

	  // Returns a subscriber for a given subscriber id / named function and
	  // channel namespace

	  Mediator.prototype.getSubscriber = function(identifier, channelName) {
	    var channel = this.getChannel(channelName || "", true);
	    // We have to check if channel within the hierarchy exists and if it is
	    // an exact match for the requested channel
	    if (channel.namespace !== channelName) {
	      return null;
	    }

	    return channel.getSubscriber(identifier);
	  }

	  // Remove a subscriber from a given channel namespace recursively based on
	  // a passed-in subscriber id or named function.

	  Mediator.prototype.remove = function(channelName, identifier) {
	    var channel = this.getChannel(channelName || "", true);
	    if (channel.namespace !== channelName) {
	      return false;
	    }

	    channel.removeSubscriber(identifier);
	  }

	  // Publishes arbitrary data to a given channel namespace. Channels are
	  // called recursively downwards; a post to application:chat will post to
	  // application:chat:receive and application:chat:derp:test:beta:bananas.
	  // Called using Mediator.publish("application:chat", [ args ]);

	  Mediator.prototype.publish = function(channelName) {
	    var channel = this.getChannel(channelName || "", true);
	    if (channel.namespace !== channelName) {
	      return null;
	    }

	    var args = Array.prototype.slice.call(arguments, 1);

	    args.push(channel);

	    channel.publish(args);
	  }

	  // Alias some common names for easy interop
	  Mediator.prototype.on = Mediator.prototype.subscribe;
	  Mediator.prototype.bind = Mediator.prototype.subscribe;
	  Mediator.prototype.emit = Mediator.prototype.publish;
	  Mediator.prototype.trigger = Mediator.prototype.publish;
	  Mediator.prototype.off = Mediator.prototype.remove;

	  // Finally, expose it all.

	  Mediator.Channel = Channel;
	  Mediator.Subscriber = Subscriber;
	  Mediator.version = "0.9.8";

	  return Mediator;
	}));


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var _arguments = arguments;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * target.utils
	 *
	 * utility methods for use throughout library
	 */
	var utils = {

		/**
	  * shallow-ish mixins on objects
	  */
		mixin: function mixin(origObj, newObj) {

			for (var k in newObj) {

				if (newObj.hasOwnProperty(k)) {

					var newV = newObj[k];
					var origV = origObj[k];

					origObj[k] = newObj[k];

					if ((typeof origV === 'undefined' ? 'undefined' : _typeof(origV)) === 'object' && (typeof newV === 'undefined' ? 'undefined' : _typeof(newV)) === 'object') {

						for (var kk in newV) {

							if (newV.hasOwnProperty(k)) {

								origV[kk] = newV[kk];
							}
						}
					}
				}
			}
		},

		/**
	  * use array.prototype.forEach on nodelists
	  */
		forEach: Array.prototype.forEach,

		/**
	  * convenience method for finding an element in a node list
	  */
		contains: function contains(list, el) {

			var i = Array.prototype.indexOf.apply(list, [el]);
			var doesContain;

			if (i === -1) {

				doesContain = false;
			} else {

				doesContain = true;
			}

			return doesContain;
		},

		/**
	  * debounce function
	  * http://davidwalsh.name/javascript-debounce-function
	  */
		debounce: function debounce(func, wait, immediate) {

			var timeout;

			return function () {

				var context = undefined;
				var args = _arguments;

				var later = function later() {
					timeout = null;
					if (!immediate) {
						func.apply(context, args);
					}
				};

				var callNow = immediate && !timeout;

				clearTimeout(timeout);

				timeout = setTimeout(later, wait);

				if (callNow) {

					func.apply(context, args);
				}
			};
		},

		/**
	  * map values of object to array
	  */
		values: function values(obj) {

			var array = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var val = _step.value;


					array.push(val);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return array;
		},

		/**
	  * create shorter alias for QS
	  */
		qs: document.querySelector.bind(document),

		/**
	  * create shorter alias for QSA
	  */
		qsa: document.querySelectorAll.bind(document),

		/**
	  * strip brackets from attribute selectors
	  * for getting the actual attribute
	  * using element.getAttribute()
	  */
		stripBrackets: function stripBrackets(att) {

			att.replace('[', '').replace(']', '');
		},

		/**
	  * capitalize first letter of string
	  */
		capitalize: function capitalize(str) {

			str.charAt(0).toUpperCase() + str.slice(1);
		},

		/**
	  * check if child is descendent of parent
	  * http://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-contained-within-another
	  */
		isDescendant: function isDescendant(parent, child) {

			var node = child.parentNode;

			while (node !== null) {

				if (node === parent) {

					return true;
				}

				node = node.parentNode;
			}

			return false;
		},

		/**
	  * for those special times
	  * when you just really wanna do nothing
	  */
		noop: function noop() {},

		/**
	  * for in loop
	  * check if object has prop
	  */
		forIn: function forIn(obj, cb) {

			var prop;

			for (prop in obj) {

				if (obj.hasOwnProperty(prop)) {

					cb(prop, obj);
				}
			}
		},

		render: function (rAF) {

			if (rAF) {

				return function (cb) {

					rAF(function () {

						cb();
					});
				};
			} else {

				return function (cb) {

					cb();
				};
			}
		}(window.requestAnimationFrame),

		isIOS: function (ua) {

			return ua.match(/iphone/gi) || ua.match(/ipad/gi);
		}(window.navigator.userAgent)

	};

	module.exports = utils;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * config
	 *
	 * initial default settings
	 *
	 * can be overridden on initialization
	 * `target.init(mySettingsObjectHere);`
	 */
	module.exports = {

		activeClass: 'target-active',

		attributes: {

			Toggle: 'data-target-toggle',
			Show: 'data-target-show',
			Hide: 'data-target-hide',
			Clickoff: 'data-target-clickoff',
			Increment: 'data-target-increment',
			Decrement: 'data-target-decrement',
			Filetext: 'data-target-filetext',
			Accordion: 'data-target-accordion',
			Scrollbox: 'data-target-scrollbox',
			Scroll: 'data-target-scroll',
			Height: 'data-target-height',
			Grid: 'data-target-grid',
			Src: 'data-target-src',
			disable: 'data-target-disable',
			max: 'data-target-max',
			min: 'data-target-min'

		},

		breakpoints: {

			tablet: 768,
			desktop: 1025,
			large: 1440

		},

		observeDom: false,

		debounceDelay: 100

	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Window
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * store the window dimensions
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * as well as the current breakpoint
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * fire events on window.resize
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * allowing UI to update and enable/disable themselves
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * according to breakpoints
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _layout = __webpack_require__(9);

	var _layout2 = _interopRequireDefault(_layout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Window = function () {
		function Window(events, breakpoints, debounceDelay) {
			var _this = this;

			_classCallCheck(this, Window);

			this.events = events;
			this.body = document.body;
			this.html = document.documentElement;

			this.updateDims();

			// "is" object
			// allows UI components to update their functionality
			// based on layout
			// usage:
			// if (is.mobile)
			// or, dynamically, for example:
			// for (layout in this.layouts)
			//   if (is[layout])
			this.is = new _layout2.default(this, breakpoints);

			window.addEventListener('resize', _utils2.default.debounce(function (e) {

				_this.onResize();
			}, debounceDelay), false);

			window.addEventListener('scroll', function (e) {

				_this.onScroll();
			});

			// on browser load,
			// run another update
			// to ensure all our scrolling stuff is calculating correctly
			// after images have been loaded
			window.addEventListener('load', function () {

				_this.onResize();
			});

			// listen for when UI elements initialize or update
			// they will request layout data
			// pass to the via resize event
			this.events.subscribe('update', function (componentID) {

				_this.update(componentID);
			});

			this.update();
		}

		/**
	  * updateDims
	  * update internal dimensions with
	  * cross-browser window width and height
	  */


		_createClass(Window, [{
			key: 'updateDims',
			value: function updateDims() {

				this._w = this.html.clientWidth;
				this._h = this.html.clientHeight;

				this._docH = Math.max(this.body.scrollHeight, this.body.offsetHeight, this.html.clientHeight, this.html.scrollHeight, this.html.offsetHeight);
			}

			/**
	   * width
	   */

		}, {
			key: 'onScroll',


			/**
	   * onScroll
	   * on window.scroll
	   * get scroll top and pass on
	   */
			value: function onScroll(e) {

				this.events.publish('scroll', window.pageYOffset);
			}

			/**
	   * onResize
	   * on window.resize
	   * update internal window properties
	   * update application
	   */

		}, {
			key: 'onResize',
			value: function onResize() {

				this.updateDims();
				this.update();
			}

			/**
	   * update
	   * fire event for UI components to update themselves
	   * pass "is" layout object for responsive changes
	   */

		}, {
			key: 'update',
			value: function update(componentID) {

				var newLayout = '';

				if (!componentID) {

					componentID = '';
				}

				// couldn't get for..of to work here
				// kept getting "this.is[Symbol.iterator] is not a function"
				_utils2.default.forIn(this.is, function (layout, is) {

					if (is[layout]) {

						newLayout = layout;
					}
				});

				this.currentLayout = newLayout;

				this.events.publish('resize' + componentID, this.is, this.width, this.height);

				if (newLayout !== this.currentLayout) {

					this.events.publish(newLayout, this.width, this.height, this.docHeight);
				}
			}
		}, {
			key: 'width',
			get: function get() {

				return this._w;
			}

			/**
	   * height
	   */

		}, {
			key: 'height',
			get: function get() {

				return this._h;
			}

			/**
	   * get height of document
	   */

		}, {
			key: 'docHeight',
			get: function get() {

				return this._docH;
			}
		}]);

		return Window;
	}();

	module.exports = Window;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Layout
	 *
	 * provide convenient syntax
	 * for determining layout of page
	 * used only by Window
	 */
	var Layout = function () {
	  function Layout(refObj, breakpoints) {
	    _classCallCheck(this, Layout);

	    this.refObj = refObj;
	    this.breakpoints = breakpoints;
	  }

	  _createClass(Layout, [{
	    key: "mobile",
	    get: function get() {

	      return this.refObj._w < this.breakpoints.tablet;
	    }
	  }, {
	    key: "tablet",
	    get: function get() {

	      return this.refObj._w >= this.breakpoints.tablet && this.refObj._w < this.breakpoints.desktop;
	    }
	  }, {
	    key: "desktop",
	    get: function get() {

	      return this.refObj._w >= this.breakpoints.desktop;
	    }
	  }, {
	    key: "large",
	    get: function get() {

	      return this.refObj._w >= this.breakpoints.large;
	    }
	  }]);

	  return Layout;
	}();

	module.exports = Layout;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * target.DomObserver
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * watches DOM for changes
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * triggers events
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * to initialize, update, or destroy components
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * NOTE: currently a performance hog
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * TODO: look into optimizing
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * scope smaller?
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _weakMap = __webpack_require__(11);

	var _weakMap2 = _interopRequireDefault(_weakMap);

	var _mutationObserver = __webpack_require__(13);

	var _mutationObserver2 = _interopRequireDefault(_mutationObserver);

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TEXT_NODE = 3;
	var COMMENT_NODE = 8;

	var DomObserver = function () {
		function DomObserver(events, config) {
			var _this = this;

			_classCallCheck(this, DomObserver);

			this.events = events;
			this.config = config;

			this.observer = new _mutationObserver2.default(function (mutations, observer) {

				_this.onMutation(mutations, observer);
			});

			// define what element should be observed by the observer
			// and what types of mutations trigger the callback
			this.observer.observe(document.body, {

				subtree: true,
				childList: true,
				attributes: true,

				// return an array of only the attributes we use
				attributeFilter: _utils2.default.values(this.config.attributes)

			});
		}

		/**
	  * when a node is added
	  * strip out text nodes
	  * then fire event
	  * for componentfactory service to pickup
	  * and initialize new components if required
	  */


		_createClass(DomObserver, [{
			key: 'publishAddedNodes',
			value: function publishAddedNodes(nodes) {
				var _this2 = this;

				_utils2.default.forEach.call(nodes, function (node) {

					if (node.nodeType === TEXT_NODE || node.nodeType === COMMENT_NODE) {

						return;
					}

					// parse attributes for target components
					_utils2.default.forIn(_this2.config.attributes, function (prop, obj) {

						var attName = obj[prop];

						if (node.getAttribute(attName)) {

							_this2.events.publish('nodeadded.mutation', prop, node);
						}
					});
				});
			}

			/**
	   * when a DOM mutation happens
	   * determine the type of mutation
	   * and fire the appropriate event
	   */

		}, {
			key: 'onMutation',
			value: function onMutation(mutations, observer) {
				var _this3 = this;

				mutations.forEach(function (mutation) {

					switch (mutation.type) {

						case 'attributes':
							_this3.events.publish('attributes.mutation', mutation.target);
							break;

						case 'childList':
							_this3.publishAddedNodes(mutation.addedNodes);
							break;

						default:
							_utils2.default.noop();
							break;

					}
				});
			}
		}]);

		return DomObserver;
	}();

	module.exports = DomObserver;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(WeakMap) {// Copyright (C) 2011 Google Inc.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	/**
	 * @fileoverview Install a leaky WeakMap emulation on platforms that
	 * don't provide a built-in one.
	 *
	 * <p>Assumes that an ES5 platform where, if {@code WeakMap} is
	 * already present, then it conforms to the anticipated ES6
	 * specification. To run this file on an ES5 or almost ES5
	 * implementation where the {@code WeakMap} specification does not
	 * quite conform, run <code>repairES5.js</code> first.
	 *
	 * <p>Even though WeakMapModule is not global, the linter thinks it
	 * is, which is why it is in the overrides list below.
	 *
	 * <p>NOTE: Before using this WeakMap emulation in a non-SES
	 * environment, see the note below about hiddenRecord.
	 *
	 * @author Mark S. Miller
	 * @requires crypto, ArrayBuffer, Uint8Array, navigator, console
	 * @overrides WeakMap, ses, Proxy
	 * @overrides WeakMapModule
	 */

	/**
	 * This {@code WeakMap} emulation is observably equivalent to the
	 * ES-Harmony WeakMap, but with leakier garbage collection properties.
	 *
	 * <p>As with true WeakMaps, in this emulation, a key does not
	 * retain maps indexed by that key and (crucially) a map does not
	 * retain the keys it indexes. A map by itself also does not retain
	 * the values associated with that map.
	 *
	 * <p>However, the values associated with a key in some map are
	 * retained so long as that key is retained and those associations are
	 * not overridden. For example, when used to support membranes, all
	 * values exported from a given membrane will live for the lifetime
	 * they would have had in the absence of an interposed membrane. Even
	 * when the membrane is revoked, all objects that would have been
	 * reachable in the absence of revocation will still be reachable, as
	 * far as the GC can tell, even though they will no longer be relevant
	 * to ongoing computation.
	 *
	 * <p>The API implemented here is approximately the API as implemented
	 * in FF6.0a1 and agreed to by MarkM, Andreas Gal, and Dave Herman,
	 * rather than the offially approved proposal page. TODO(erights):
	 * upgrade the ecmascript WeakMap proposal page to explain this API
	 * change and present to EcmaScript committee for their approval.
	 *
	 * <p>The first difference between the emulation here and that in
	 * FF6.0a1 is the presence of non enumerable {@code get___, has___,
	 * set___, and delete___} methods on WeakMap instances to represent
	 * what would be the hidden internal properties of a primitive
	 * implementation. Whereas the FF6.0a1 WeakMap.prototype methods
	 * require their {@code this} to be a genuine WeakMap instance (i.e.,
	 * an object of {@code [[Class]]} "WeakMap}), since there is nothing
	 * unforgeable about the pseudo-internal method names used here,
	 * nothing prevents these emulated prototype methods from being
	 * applied to non-WeakMaps with pseudo-internal methods of the same
	 * names.
	 *
	 * <p>Another difference is that our emulated {@code
	 * WeakMap.prototype} is not itself a WeakMap. A problem with the
	 * current FF6.0a1 API is that WeakMap.prototype is itself a WeakMap
	 * providing ambient mutability and an ambient communications
	 * channel. Thus, if a WeakMap is already present and has this
	 * problem, repairES5.js wraps it in a safe wrappper in order to
	 * prevent access to this channel. (See
	 * PATCH_MUTABLE_FROZEN_WEAKMAP_PROTO in repairES5.js).
	 */

	/**
	 * If this is a full <a href=
	 * "http://code.google.com/p/es-lab/wiki/SecureableES5"
	 * >secureable ES5</a> platform and the ES-Harmony {@code WeakMap} is
	 * absent, install an approximate emulation.
	 *
	 * <p>If WeakMap is present but cannot store some objects, use our approximate
	 * emulation as a wrapper.
	 *
	 * <p>If this is almost a secureable ES5 platform, then WeakMap.js
	 * should be run after repairES5.js.
	 *
	 * <p>See {@code WeakMap} for documentation of the garbage collection
	 * properties of this WeakMap emulation.
	 */
	(function WeakMapModule() {
	  "use strict";

	  if (typeof ses !== 'undefined' && ses.ok && !ses.ok()) {
	    // already too broken, so give up
	    return;
	  }

	  /**
	   * In some cases (current Firefox), we must make a choice betweeen a
	   * WeakMap which is capable of using all varieties of host objects as
	   * keys and one which is capable of safely using proxies as keys. See
	   * comments below about HostWeakMap and DoubleWeakMap for details.
	   *
	   * This function (which is a global, not exposed to guests) marks a
	   * WeakMap as permitted to do what is necessary to index all host
	   * objects, at the cost of making it unsafe for proxies.
	   *
	   * Do not apply this function to anything which is not a genuine
	   * fresh WeakMap.
	   */
	  function weakMapPermitHostObjects(map) {
	    // identity of function used as a secret -- good enough and cheap
	    if (map.permitHostObjects___) {
	      map.permitHostObjects___(weakMapPermitHostObjects);
	    }
	  }
	  if (typeof ses !== 'undefined') {
	    ses.weakMapPermitHostObjects = weakMapPermitHostObjects;
	  }

	  // IE 11 has no Proxy but has a broken WeakMap such that we need to patch
	  // it using DoubleWeakMap; this flag tells DoubleWeakMap so.
	  var doubleWeakMapCheckSilentFailure = false;

	  // Check if there is already a good-enough WeakMap implementation, and if so
	  // exit without replacing it.
	  if (typeof WeakMap === 'function') {
	    var HostWeakMap = WeakMap;
	    // There is a WeakMap -- is it good enough?
	    if (typeof navigator !== 'undefined' &&
	        /Firefox/.test(navigator.userAgent)) {
	      // We're now *assuming not*, because as of this writing (2013-05-06)
	      // Firefox's WeakMaps have a miscellany of objects they won't accept, and
	      // we don't want to make an exhaustive list, and testing for just one
	      // will be a problem if that one is fixed alone (as they did for Event).

	      // If there is a platform that we *can* reliably test on, here's how to
	      // do it:
	      //  var problematic = ... ;
	      //  var testHostMap = new HostWeakMap();
	      //  try {
	      //    testHostMap.set(problematic, 1);  // Firefox 20 will throw here
	      //    if (testHostMap.get(problematic) === 1) {
	      //      return;
	      //    }
	      //  } catch (e) {}

	    } else {
	      // IE 11 bug: WeakMaps silently fail to store frozen objects.
	      var testMap = new HostWeakMap();
	      var testObject = Object.freeze({});
	      testMap.set(testObject, 1);
	      if (testMap.get(testObject) !== 1) {
	        doubleWeakMapCheckSilentFailure = true;
	        // Fall through to installing our WeakMap.
	      } else {
	        module.exports = WeakMap;
	        return;
	      }
	    }
	  }

	  var hop = Object.prototype.hasOwnProperty;
	  var gopn = Object.getOwnPropertyNames;
	  var defProp = Object.defineProperty;
	  var isExtensible = Object.isExtensible;

	  /**
	   * Security depends on HIDDEN_NAME being both <i>unguessable</i> and
	   * <i>undiscoverable</i> by untrusted code.
	   *
	   * <p>Given the known weaknesses of Math.random() on existing
	   * browsers, it does not generate unguessability we can be confident
	   * of.
	   *
	   * <p>It is the monkey patching logic in this file that is intended
	   * to ensure undiscoverability. The basic idea is that there are
	   * three fundamental means of discovering properties of an object:
	   * The for/in loop, Object.keys(), and Object.getOwnPropertyNames(),
	   * as well as some proposed ES6 extensions that appear on our
	   * whitelist. The first two only discover enumerable properties, and
	   * we only use HIDDEN_NAME to name a non-enumerable property, so the
	   * only remaining threat should be getOwnPropertyNames and some
	   * proposed ES6 extensions that appear on our whitelist. We monkey
	   * patch them to remove HIDDEN_NAME from the list of properties they
	   * returns.
	   *
	   * <p>TODO(erights): On a platform with built-in Proxies, proxies
	   * could be used to trap and thereby discover the HIDDEN_NAME, so we
	   * need to monkey patch Proxy.create, Proxy.createFunction, etc, in
	   * order to wrap the provided handler with the real handler which
	   * filters out all traps using HIDDEN_NAME.
	   *
	   * <p>TODO(erights): Revisit Mike Stay's suggestion that we use an
	   * encapsulated function at a not-necessarily-secret name, which
	   * uses the Stiegler shared-state rights amplification pattern to
	   * reveal the associated value only to the WeakMap in which this key
	   * is associated with that value. Since only the key retains the
	   * function, the function can also remember the key without causing
	   * leakage of the key, so this doesn't violate our general gc
	   * goals. In addition, because the name need not be a guarded
	   * secret, we could efficiently handle cross-frame frozen keys.
	   */
	  var HIDDEN_NAME_PREFIX = 'weakmap:';
	  var HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'ident:' + Math.random() + '___';

	  if (typeof crypto !== 'undefined' &&
	      typeof crypto.getRandomValues === 'function' &&
	      typeof ArrayBuffer === 'function' &&
	      typeof Uint8Array === 'function') {
	    var ab = new ArrayBuffer(25);
	    var u8s = new Uint8Array(ab);
	    crypto.getRandomValues(u8s);
	    HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'rand:' +
	      Array.prototype.map.call(u8s, function(u8) {
	        return (u8 % 36).toString(36);
	      }).join('') + '___';
	  }

	  function isNotHiddenName(name) {
	    return !(
	        name.substr(0, HIDDEN_NAME_PREFIX.length) == HIDDEN_NAME_PREFIX &&
	        name.substr(name.length - 3) === '___');
	  }

	  /**
	   * Monkey patch getOwnPropertyNames to avoid revealing the
	   * HIDDEN_NAME.
	   *
	   * <p>The ES5.1 spec requires each name to appear only once, but as
	   * of this writing, this requirement is controversial for ES6, so we
	   * made this code robust against this case. If the resulting extra
	   * search turns out to be expensive, we can probably relax this once
	   * ES6 is adequately supported on all major browsers, iff no browser
	   * versions we support at that time have relaxed this constraint
	   * without providing built-in ES6 WeakMaps.
	   */
	  defProp(Object, 'getOwnPropertyNames', {
	    value: function fakeGetOwnPropertyNames(obj) {
	      return gopn(obj).filter(isNotHiddenName);
	    }
	  });

	  /**
	   * getPropertyNames is not in ES5 but it is proposed for ES6 and
	   * does appear in our whitelist, so we need to clean it too.
	   */
	  if ('getPropertyNames' in Object) {
	    var originalGetPropertyNames = Object.getPropertyNames;
	    defProp(Object, 'getPropertyNames', {
	      value: function fakeGetPropertyNames(obj) {
	        return originalGetPropertyNames(obj).filter(isNotHiddenName);
	      }
	    });
	  }

	  /**
	   * <p>To treat objects as identity-keys with reasonable efficiency
	   * on ES5 by itself (i.e., without any object-keyed collections), we
	   * need to add a hidden property to such key objects when we
	   * can. This raises several issues:
	   * <ul>
	   * <li>Arranging to add this property to objects before we lose the
	   *     chance, and
	   * <li>Hiding the existence of this new property from most
	   *     JavaScript code.
	   * <li>Preventing <i>certification theft</i>, where one object is
	   *     created falsely claiming to be the key of an association
	   *     actually keyed by another object.
	   * <li>Preventing <i>value theft</i>, where untrusted code with
	   *     access to a key object but not a weak map nevertheless
	   *     obtains access to the value associated with that key in that
	   *     weak map.
	   * </ul>
	   * We do so by
	   * <ul>
	   * <li>Making the name of the hidden property unguessable, so "[]"
	   *     indexing, which we cannot intercept, cannot be used to access
	   *     a property without knowing the name.
	   * <li>Making the hidden property non-enumerable, so we need not
	   *     worry about for-in loops or {@code Object.keys},
	   * <li>monkey patching those reflective methods that would
	   *     prevent extensions, to add this hidden property first,
	   * <li>monkey patching those methods that would reveal this
	   *     hidden property.
	   * </ul>
	   * Unfortunately, because of same-origin iframes, we cannot reliably
	   * add this hidden property before an object becomes
	   * non-extensible. Instead, if we encounter a non-extensible object
	   * without a hidden record that we can detect (whether or not it has
	   * a hidden record stored under a name secret to us), then we just
	   * use the key object itself to represent its identity in a brute
	   * force leaky map stored in the weak map, losing all the advantages
	   * of weakness for these.
	   */
	  function getHiddenRecord(key) {
	    if (key !== Object(key)) {
	      throw new TypeError('Not an object: ' + key);
	    }
	    var hiddenRecord = key[HIDDEN_NAME];
	    if (hiddenRecord && hiddenRecord.key === key) { return hiddenRecord; }
	    if (!isExtensible(key)) {
	      // Weak map must brute force, as explained in doc-comment above.
	      return void 0;
	    }

	    // The hiddenRecord and the key point directly at each other, via
	    // the "key" and HIDDEN_NAME properties respectively. The key
	    // field is for quickly verifying that this hidden record is an
	    // own property, not a hidden record from up the prototype chain.
	    //
	    // NOTE: Because this WeakMap emulation is meant only for systems like
	    // SES where Object.prototype is frozen without any numeric
	    // properties, it is ok to use an object literal for the hiddenRecord.
	    // This has two advantages:
	    // * It is much faster in a performance critical place
	    // * It avoids relying on Object.create(null), which had been
	    //   problematic on Chrome 28.0.1480.0. See
	    //   https://code.google.com/p/google-caja/issues/detail?id=1687
	    hiddenRecord = { key: key };

	    // When using this WeakMap emulation on platforms where
	    // Object.prototype might not be frozen and Object.create(null) is
	    // reliable, use the following two commented out lines instead.
	    // hiddenRecord = Object.create(null);
	    // hiddenRecord.key = key;

	    // Please contact us if you need this to work on platforms where
	    // Object.prototype might not be frozen and
	    // Object.create(null) might not be reliable.

	    try {
	      defProp(key, HIDDEN_NAME, {
	        value: hiddenRecord,
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	      return hiddenRecord;
	    } catch (error) {
	      // Under some circumstances, isExtensible seems to misreport whether
	      // the HIDDEN_NAME can be defined.
	      // The circumstances have not been isolated, but at least affect
	      // Node.js v0.10.26 on TravisCI / Linux, but not the same version of
	      // Node.js on OS X.
	      return void 0;
	    }
	  }

	  /**
	   * Monkey patch operations that would make their argument
	   * non-extensible.
	   *
	   * <p>The monkey patched versions throw a TypeError if their
	   * argument is not an object, so it should only be done to functions
	   * that should throw a TypeError anyway if their argument is not an
	   * object.
	   */
	  (function(){
	    var oldFreeze = Object.freeze;
	    defProp(Object, 'freeze', {
	      value: function identifyingFreeze(obj) {
	        getHiddenRecord(obj);
	        return oldFreeze(obj);
	      }
	    });
	    var oldSeal = Object.seal;
	    defProp(Object, 'seal', {
	      value: function identifyingSeal(obj) {
	        getHiddenRecord(obj);
	        return oldSeal(obj);
	      }
	    });
	    var oldPreventExtensions = Object.preventExtensions;
	    defProp(Object, 'preventExtensions', {
	      value: function identifyingPreventExtensions(obj) {
	        getHiddenRecord(obj);
	        return oldPreventExtensions(obj);
	      }
	    });
	  })();

	  function constFunc(func) {
	    func.prototype = null;
	    return Object.freeze(func);
	  }

	  var calledAsFunctionWarningDone = false;
	  function calledAsFunctionWarning() {
	    // Future ES6 WeakMap is currently (2013-09-10) expected to reject WeakMap()
	    // but we used to permit it and do it ourselves, so warn only.
	    if (!calledAsFunctionWarningDone && typeof console !== 'undefined') {
	      calledAsFunctionWarningDone = true;
	      console.warn('WeakMap should be invoked as new WeakMap(), not ' +
	          'WeakMap(). This will be an error in the future.');
	    }
	  }

	  var nextId = 0;

	  var OurWeakMap = function() {
	    if (!(this instanceof OurWeakMap)) {  // approximate test for new ...()
	      calledAsFunctionWarning();
	    }

	    // We are currently (12/25/2012) never encountering any prematurely
	    // non-extensible keys.
	    var keys = []; // brute force for prematurely non-extensible keys.
	    var values = []; // brute force for corresponding values.
	    var id = nextId++;

	    function get___(key, opt_default) {
	      var index;
	      var hiddenRecord = getHiddenRecord(key);
	      if (hiddenRecord) {
	        return id in hiddenRecord ? hiddenRecord[id] : opt_default;
	      } else {
	        index = keys.indexOf(key);
	        return index >= 0 ? values[index] : opt_default;
	      }
	    }

	    function has___(key) {
	      var hiddenRecord = getHiddenRecord(key);
	      if (hiddenRecord) {
	        return id in hiddenRecord;
	      } else {
	        return keys.indexOf(key) >= 0;
	      }
	    }

	    function set___(key, value) {
	      var index;
	      var hiddenRecord = getHiddenRecord(key);
	      if (hiddenRecord) {
	        hiddenRecord[id] = value;
	      } else {
	        index = keys.indexOf(key);
	        if (index >= 0) {
	          values[index] = value;
	        } else {
	          // Since some browsers preemptively terminate slow turns but
	          // then continue computing with presumably corrupted heap
	          // state, we here defensively get keys.length first and then
	          // use it to update both the values and keys arrays, keeping
	          // them in sync.
	          index = keys.length;
	          values[index] = value;
	          // If we crash here, values will be one longer than keys.
	          keys[index] = key;
	        }
	      }
	      return this;
	    }

	    function delete___(key) {
	      var hiddenRecord = getHiddenRecord(key);
	      var index, lastIndex;
	      if (hiddenRecord) {
	        return id in hiddenRecord && delete hiddenRecord[id];
	      } else {
	        index = keys.indexOf(key);
	        if (index < 0) {
	          return false;
	        }
	        // Since some browsers preemptively terminate slow turns but
	        // then continue computing with potentially corrupted heap
	        // state, we here defensively get keys.length first and then use
	        // it to update both the keys and the values array, keeping
	        // them in sync. We update the two with an order of assignments,
	        // such that any prefix of these assignments will preserve the
	        // key/value correspondence, either before or after the delete.
	        // Note that this needs to work correctly when index === lastIndex.
	        lastIndex = keys.length - 1;
	        keys[index] = void 0;
	        // If we crash here, there's a void 0 in the keys array, but
	        // no operation will cause a "keys.indexOf(void 0)", since
	        // getHiddenRecord(void 0) will always throw an error first.
	        values[index] = values[lastIndex];
	        // If we crash here, values[index] cannot be found here,
	        // because keys[index] is void 0.
	        keys[index] = keys[lastIndex];
	        // If index === lastIndex and we crash here, then keys[index]
	        // is still void 0, since the aliasing killed the previous key.
	        keys.length = lastIndex;
	        // If we crash here, keys will be one shorter than values.
	        values.length = lastIndex;
	        return true;
	      }
	    }

	    return Object.create(OurWeakMap.prototype, {
	      get___:    { value: constFunc(get___) },
	      has___:    { value: constFunc(has___) },
	      set___:    { value: constFunc(set___) },
	      delete___: { value: constFunc(delete___) }
	    });
	  };

	  OurWeakMap.prototype = Object.create(Object.prototype, {
	    get: {
	      /**
	       * Return the value most recently associated with key, or
	       * opt_default if none.
	       */
	      value: function get(key, opt_default) {
	        return this.get___(key, opt_default);
	      },
	      writable: true,
	      configurable: true
	    },

	    has: {
	      /**
	       * Is there a value associated with key in this WeakMap?
	       */
	      value: function has(key) {
	        return this.has___(key);
	      },
	      writable: true,
	      configurable: true
	    },

	    set: {
	      /**
	       * Associate value with key in this WeakMap, overwriting any
	       * previous association if present.
	       */
	      value: function set(key, value) {
	        return this.set___(key, value);
	      },
	      writable: true,
	      configurable: true
	    },

	    'delete': {
	      /**
	       * Remove any association for key in this WeakMap, returning
	       * whether there was one.
	       *
	       * <p>Note that the boolean return here does not work like the
	       * {@code delete} operator. The {@code delete} operator returns
	       * whether the deletion succeeds at bringing about a state in
	       * which the deleted property is absent. The {@code delete}
	       * operator therefore returns true if the property was already
	       * absent, whereas this {@code delete} method returns false if
	       * the association was already absent.
	       */
	      value: function remove(key) {
	        return this.delete___(key);
	      },
	      writable: true,
	      configurable: true
	    }
	  });

	  if (typeof HostWeakMap === 'function') {
	    (function() {
	      // If we got here, then the platform has a WeakMap but we are concerned
	      // that it may refuse to store some key types. Therefore, make a map
	      // implementation which makes use of both as possible.

	      // In this mode we are always using double maps, so we are not proxy-safe.
	      // This combination does not occur in any known browser, but we had best
	      // be safe.
	      if (doubleWeakMapCheckSilentFailure && typeof Proxy !== 'undefined') {
	        Proxy = undefined;
	      }

	      function DoubleWeakMap() {
	        if (!(this instanceof OurWeakMap)) {  // approximate test for new ...()
	          calledAsFunctionWarning();
	        }

	        // Preferable, truly weak map.
	        var hmap = new HostWeakMap();

	        // Our hidden-property-based pseudo-weak-map. Lazily initialized in the
	        // 'set' implementation; thus we can avoid performing extra lookups if
	        // we know all entries actually stored are entered in 'hmap'.
	        var omap = undefined;

	        // Hidden-property maps are not compatible with proxies because proxies
	        // can observe the hidden name and either accidentally expose it or fail
	        // to allow the hidden property to be set. Therefore, we do not allow
	        // arbitrary WeakMaps to switch to using hidden properties, but only
	        // those which need the ability, and unprivileged code is not allowed
	        // to set the flag.
	        //
	        // (Except in doubleWeakMapCheckSilentFailure mode in which case we
	        // disable proxies.)
	        var enableSwitching = false;

	        function dget(key, opt_default) {
	          if (omap) {
	            return hmap.has(key) ? hmap.get(key)
	                : omap.get___(key, opt_default);
	          } else {
	            return hmap.get(key, opt_default);
	          }
	        }

	        function dhas(key) {
	          return hmap.has(key) || (omap ? omap.has___(key) : false);
	        }

	        var dset;
	        if (doubleWeakMapCheckSilentFailure) {
	          dset = function(key, value) {
	            hmap.set(key, value);
	            if (!hmap.has(key)) {
	              if (!omap) { omap = new OurWeakMap(); }
	              omap.set(key, value);
	            }
	            return this;
	          };
	        } else {
	          dset = function(key, value) {
	            if (enableSwitching) {
	              try {
	                hmap.set(key, value);
	              } catch (e) {
	                if (!omap) { omap = new OurWeakMap(); }
	                omap.set___(key, value);
	              }
	            } else {
	              hmap.set(key, value);
	            }
	            return this;
	          };
	        }

	        function ddelete(key) {
	          var result = !!hmap['delete'](key);
	          if (omap) { return omap.delete___(key) || result; }
	          return result;
	        }

	        return Object.create(OurWeakMap.prototype, {
	          get___:    { value: constFunc(dget) },
	          has___:    { value: constFunc(dhas) },
	          set___:    { value: constFunc(dset) },
	          delete___: { value: constFunc(ddelete) },
	          permitHostObjects___: { value: constFunc(function(token) {
	            if (token === weakMapPermitHostObjects) {
	              enableSwitching = true;
	            } else {
	              throw new Error('bogus call to permitHostObjects___');
	            }
	          })}
	        });
	      }
	      DoubleWeakMap.prototype = OurWeakMap.prototype;
	      module.exports = DoubleWeakMap;

	      // define .constructor to hide OurWeakMap ctor
	      Object.defineProperty(WeakMap.prototype, 'constructor', {
	        value: WeakMap,
	        enumerable: false,  // as default .constructor is
	        configurable: true,
	        writable: true
	      });
	    })();
	  } else {
	    // There is no host WeakMap, so we must use the emulation.

	    // Emulated WeakMaps are incompatible with native proxies (because proxies
	    // can observe the hidden name), so we must disable Proxy usage (in
	    // ArrayLike and Domado, currently).
	    if (typeof Proxy !== 'undefined') {
	      Proxy = undefined;
	    }

	    module.exports = OurWeakMap;
	  }
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(WeakMap, global) {/*** IMPORTS FROM imports-loader ***/
	(function() {

	// Copyright (C) 2011 Google Inc.
	//
	// Licensed under the Apache License, Version 2.0 (the "License");
	// you may not use this file except in compliance with the License.
	// You may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	// See the License for the specific language governing permissions and
	// limitations under the License.

	/**
	 * @fileoverview Install a leaky WeakMap emulation on platforms that
	 * don't provide a built-in one.
	 *
	 * <p>Assumes that an ES5 platform where, if {@code WeakMap} is
	 * already present, then it conforms to the anticipated ES6
	 * specification. To run this file on an ES5 or almost ES5
	 * implementation where the {@code WeakMap} specification does not
	 * quite conform, run <code>repairES5.js</code> first.
	 *
	 * <p>Even though WeakMapModule is not global, the linter thinks it
	 * is, which is why it is in the overrides list below.
	 *
	 * <p>NOTE: Before using this WeakMap emulation in a non-SES
	 * environment, see the note below about hiddenRecord.
	 *
	 * @author Mark S. Miller
	 * @requires crypto, ArrayBuffer, Uint8Array, navigator, console
	 * @overrides WeakMap, ses, Proxy
	 * @overrides WeakMapModule
	 */

	/**
	 * This {@code WeakMap} emulation is observably equivalent to the
	 * ES-Harmony WeakMap, but with leakier garbage collection properties.
	 *
	 * <p>As with true WeakMaps, in this emulation, a key does not
	 * retain maps indexed by that key and (crucially) a map does not
	 * retain the keys it indexes. A map by itself also does not retain
	 * the values associated with that map.
	 *
	 * <p>However, the values associated with a key in some map are
	 * retained so long as that key is retained and those associations are
	 * not overridden. For example, when used to support membranes, all
	 * values exported from a given membrane will live for the lifetime
	 * they would have had in the absence of an interposed membrane. Even
	 * when the membrane is revoked, all objects that would have been
	 * reachable in the absence of revocation will still be reachable, as
	 * far as the GC can tell, even though they will no longer be relevant
	 * to ongoing computation.
	 *
	 * <p>The API implemented here is approximately the API as implemented
	 * in FF6.0a1 and agreed to by MarkM, Andreas Gal, and Dave Herman,
	 * rather than the offially approved proposal page. TODO(erights):
	 * upgrade the ecmascript WeakMap proposal page to explain this API
	 * change and present to EcmaScript committee for their approval.
	 *
	 * <p>The first difference between the emulation here and that in
	 * FF6.0a1 is the presence of non enumerable {@code get___, has___,
	 * set___, and delete___} methods on WeakMap instances to represent
	 * what would be the hidden internal properties of a primitive
	 * implementation. Whereas the FF6.0a1 WeakMap.prototype methods
	 * require their {@code this} to be a genuine WeakMap instance (i.e.,
	 * an object of {@code [[Class]]} "WeakMap}), since there is nothing
	 * unforgeable about the pseudo-internal method names used here,
	 * nothing prevents these emulated prototype methods from being
	 * applied to non-WeakMaps with pseudo-internal methods of the same
	 * names.
	 *
	 * <p>Another difference is that our emulated {@code
	 * WeakMap.prototype} is not itself a WeakMap. A problem with the
	 * current FF6.0a1 API is that WeakMap.prototype is itself a WeakMap
	 * providing ambient mutability and an ambient communications
	 * channel. Thus, if a WeakMap is already present and has this
	 * problem, repairES5.js wraps it in a safe wrappper in order to
	 * prevent access to this channel. (See
	 * PATCH_MUTABLE_FROZEN_WEAKMAP_PROTO in repairES5.js).
	 */

	/**
	 * If this is a full <a href=
	 * "http://code.google.com/p/es-lab/wiki/SecureableES5"
	 * >secureable ES5</a> platform and the ES-Harmony {@code WeakMap} is
	 * absent, install an approximate emulation.
	 *
	 * <p>If WeakMap is present but cannot store some objects, use our approximate
	 * emulation as a wrapper.
	 *
	 * <p>If this is almost a secureable ES5 platform, then WeakMap.js
	 * should be run after repairES5.js.
	 *
	 * <p>See {@code WeakMap} for documentation of the garbage collection
	 * properties of this WeakMap emulation.
	 */
	(function WeakMapModule() {
	  "use strict";

	  if (typeof ses !== 'undefined' && ses.ok && !ses.ok()) {
	    // already too broken, so give up
	    return;
	  }

	  /**
	   * In some cases (current Firefox), we must make a choice betweeen a
	   * WeakMap which is capable of using all varieties of host objects as
	   * keys and one which is capable of safely using proxies as keys. See
	   * comments below about HostWeakMap and DoubleWeakMap for details.
	   *
	   * This function (which is a global, not exposed to guests) marks a
	   * WeakMap as permitted to do what is necessary to index all host
	   * objects, at the cost of making it unsafe for proxies.
	   *
	   * Do not apply this function to anything which is not a genuine
	   * fresh WeakMap.
	   */
	  function weakMapPermitHostObjects(map) {
	    // identity of function used as a secret -- good enough and cheap
	    if (map.permitHostObjects___) {
	      map.permitHostObjects___(weakMapPermitHostObjects);
	    }
	  }
	  if (typeof ses !== 'undefined') {
	    ses.weakMapPermitHostObjects = weakMapPermitHostObjects;
	  }

	  // IE 11 has no Proxy but has a broken WeakMap such that we need to patch
	  // it using DoubleWeakMap; this flag tells DoubleWeakMap so.
	  var doubleWeakMapCheckSilentFailure = false;

	  // Check if there is already a good-enough WeakMap implementation, and if so
	  // exit without replacing it.
	  if (typeof WeakMap === 'function') {
	    var HostWeakMap = WeakMap;
	    // There is a WeakMap -- is it good enough?
	    if (typeof navigator !== 'undefined' &&
	        /Firefox/.test(navigator.userAgent)) {
	      // We're now *assuming not*, because as of this writing (2013-05-06)
	      // Firefox's WeakMaps have a miscellany of objects they won't accept, and
	      // we don't want to make an exhaustive list, and testing for just one
	      // will be a problem if that one is fixed alone (as they did for Event).

	      // If there is a platform that we *can* reliably test on, here's how to
	      // do it:
	      //  var problematic = ... ;
	      //  var testHostMap = new HostWeakMap();
	      //  try {
	      //    testHostMap.set(problematic, 1);  // Firefox 20 will throw here
	      //    if (testHostMap.get(problematic) === 1) {
	      //      return;
	      //    }
	      //  } catch (e) {}

	    } else {
	      // IE 11 bug: WeakMaps silently fail to store frozen objects.
	      var testMap = new HostWeakMap();
	      var testObject = Object.freeze({});
	      testMap.set(testObject, 1);
	      if (testMap.get(testObject) !== 1) {
	        doubleWeakMapCheckSilentFailure = true;
	        // Fall through to installing our WeakMap.
	      } else {
	        module.exports = WeakMap;
	        return;
	      }
	    }
	  }

	  var hop = Object.prototype.hasOwnProperty;
	  var gopn = Object.getOwnPropertyNames;
	  var defProp = Object.defineProperty;
	  var isExtensible = Object.isExtensible;

	  /**
	   * Security depends on HIDDEN_NAME being both <i>unguessable</i> and
	   * <i>undiscoverable</i> by untrusted code.
	   *
	   * <p>Given the known weaknesses of Math.random() on existing
	   * browsers, it does not generate unguessability we can be confident
	   * of.
	   *
	   * <p>It is the monkey patching logic in this file that is intended
	   * to ensure undiscoverability. The basic idea is that there are
	   * three fundamental means of discovering properties of an object:
	   * The for/in loop, Object.keys(), and Object.getOwnPropertyNames(),
	   * as well as some proposed ES6 extensions that appear on our
	   * whitelist. The first two only discover enumerable properties, and
	   * we only use HIDDEN_NAME to name a non-enumerable property, so the
	   * only remaining threat should be getOwnPropertyNames and some
	   * proposed ES6 extensions that appear on our whitelist. We monkey
	   * patch them to remove HIDDEN_NAME from the list of properties they
	   * returns.
	   *
	   * <p>TODO(erights): On a platform with built-in Proxies, proxies
	   * could be used to trap and thereby discover the HIDDEN_NAME, so we
	   * need to monkey patch Proxy.create, Proxy.createFunction, etc, in
	   * order to wrap the provided handler with the real handler which
	   * filters out all traps using HIDDEN_NAME.
	   *
	   * <p>TODO(erights): Revisit Mike Stay's suggestion that we use an
	   * encapsulated function at a not-necessarily-secret name, which
	   * uses the Stiegler shared-state rights amplification pattern to
	   * reveal the associated value only to the WeakMap in which this key
	   * is associated with that value. Since only the key retains the
	   * function, the function can also remember the key without causing
	   * leakage of the key, so this doesn't violate our general gc
	   * goals. In addition, because the name need not be a guarded
	   * secret, we could efficiently handle cross-frame frozen keys.
	   */
	  var HIDDEN_NAME_PREFIX = 'weakmap:';
	  var HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'ident:' + Math.random() + '___';

	  if (typeof crypto !== 'undefined' &&
	      typeof crypto.getRandomValues === 'function' &&
	      typeof ArrayBuffer === 'function' &&
	      typeof Uint8Array === 'function') {
	    var ab = new ArrayBuffer(25);
	    var u8s = new Uint8Array(ab);
	    crypto.getRandomValues(u8s);
	    HIDDEN_NAME = HIDDEN_NAME_PREFIX + 'rand:' +
	      Array.prototype.map.call(u8s, function(u8) {
	        return (u8 % 36).toString(36);
	      }).join('') + '___';
	  }

	  function isNotHiddenName(name) {
	    return !(
	        name.substr(0, HIDDEN_NAME_PREFIX.length) == HIDDEN_NAME_PREFIX &&
	        name.substr(name.length - 3) === '___');
	  }

	  /**
	   * Monkey patch getOwnPropertyNames to avoid revealing the
	   * HIDDEN_NAME.
	   *
	   * <p>The ES5.1 spec requires each name to appear only once, but as
	   * of this writing, this requirement is controversial for ES6, so we
	   * made this code robust against this case. If the resulting extra
	   * search turns out to be expensive, we can probably relax this once
	   * ES6 is adequately supported on all major browsers, iff no browser
	   * versions we support at that time have relaxed this constraint
	   * without providing built-in ES6 WeakMaps.
	   */
	  defProp(Object, 'getOwnPropertyNames', {
	    value: function fakeGetOwnPropertyNames(obj) {
	      return gopn(obj).filter(isNotHiddenName);
	    }
	  });

	  /**
	   * getPropertyNames is not in ES5 but it is proposed for ES6 and
	   * does appear in our whitelist, so we need to clean it too.
	   */
	  if ('getPropertyNames' in Object) {
	    var originalGetPropertyNames = Object.getPropertyNames;
	    defProp(Object, 'getPropertyNames', {
	      value: function fakeGetPropertyNames(obj) {
	        return originalGetPropertyNames(obj).filter(isNotHiddenName);
	      }
	    });
	  }

	  /**
	   * <p>To treat objects as identity-keys with reasonable efficiency
	   * on ES5 by itself (i.e., without any object-keyed collections), we
	   * need to add a hidden property to such key objects when we
	   * can. This raises several issues:
	   * <ul>
	   * <li>Arranging to add this property to objects before we lose the
	   *     chance, and
	   * <li>Hiding the existence of this new property from most
	   *     JavaScript code.
	   * <li>Preventing <i>certification theft</i>, where one object is
	   *     created falsely claiming to be the key of an association
	   *     actually keyed by another object.
	   * <li>Preventing <i>value theft</i>, where untrusted code with
	   *     access to a key object but not a weak map nevertheless
	   *     obtains access to the value associated with that key in that
	   *     weak map.
	   * </ul>
	   * We do so by
	   * <ul>
	   * <li>Making the name of the hidden property unguessable, so "[]"
	   *     indexing, which we cannot intercept, cannot be used to access
	   *     a property without knowing the name.
	   * <li>Making the hidden property non-enumerable, so we need not
	   *     worry about for-in loops or {@code Object.keys},
	   * <li>monkey patching those reflective methods that would
	   *     prevent extensions, to add this hidden property first,
	   * <li>monkey patching those methods that would reveal this
	   *     hidden property.
	   * </ul>
	   * Unfortunately, because of same-origin iframes, we cannot reliably
	   * add this hidden property before an object becomes
	   * non-extensible. Instead, if we encounter a non-extensible object
	   * without a hidden record that we can detect (whether or not it has
	   * a hidden record stored under a name secret to us), then we just
	   * use the key object itself to represent its identity in a brute
	   * force leaky map stored in the weak map, losing all the advantages
	   * of weakness for these.
	   */
	  function getHiddenRecord(key) {
	    if (key !== Object(key)) {
	      throw new TypeError('Not an object: ' + key);
	    }
	    var hiddenRecord = key[HIDDEN_NAME];
	    if (hiddenRecord && hiddenRecord.key === key) { return hiddenRecord; }
	    if (!isExtensible(key)) {
	      // Weak map must brute force, as explained in doc-comment above.
	      return void 0;
	    }

	    // The hiddenRecord and the key point directly at each other, via
	    // the "key" and HIDDEN_NAME properties respectively. The key
	    // field is for quickly verifying that this hidden record is an
	    // own property, not a hidden record from up the prototype chain.
	    //
	    // NOTE: Because this WeakMap emulation is meant only for systems like
	    // SES where Object.prototype is frozen without any numeric
	    // properties, it is ok to use an object literal for the hiddenRecord.
	    // This has two advantages:
	    // * It is much faster in a performance critical place
	    // * It avoids relying on Object.create(null), which had been
	    //   problematic on Chrome 28.0.1480.0. See
	    //   https://code.google.com/p/google-caja/issues/detail?id=1687
	    hiddenRecord = { key: key };

	    // When using this WeakMap emulation on platforms where
	    // Object.prototype might not be frozen and Object.create(null) is
	    // reliable, use the following two commented out lines instead.
	    // hiddenRecord = Object.create(null);
	    // hiddenRecord.key = key;

	    // Please contact us if you need this to work on platforms where
	    // Object.prototype might not be frozen and
	    // Object.create(null) might not be reliable.

	    try {
	      defProp(key, HIDDEN_NAME, {
	        value: hiddenRecord,
	        writable: false,
	        enumerable: false,
	        configurable: false
	      });
	      return hiddenRecord;
	    } catch (error) {
	      // Under some circumstances, isExtensible seems to misreport whether
	      // the HIDDEN_NAME can be defined.
	      // The circumstances have not been isolated, but at least affect
	      // Node.js v0.10.26 on TravisCI / Linux, but not the same version of
	      // Node.js on OS X.
	      return void 0;
	    }
	  }

	  /**
	   * Monkey patch operations that would make their argument
	   * non-extensible.
	   *
	   * <p>The monkey patched versions throw a TypeError if their
	   * argument is not an object, so it should only be done to functions
	   * that should throw a TypeError anyway if their argument is not an
	   * object.
	   */
	  (function(){
	    var oldFreeze = Object.freeze;
	    defProp(Object, 'freeze', {
	      value: function identifyingFreeze(obj) {
	        getHiddenRecord(obj);
	        return oldFreeze(obj);
	      }
	    });
	    var oldSeal = Object.seal;
	    defProp(Object, 'seal', {
	      value: function identifyingSeal(obj) {
	        getHiddenRecord(obj);
	        return oldSeal(obj);
	      }
	    });
	    var oldPreventExtensions = Object.preventExtensions;
	    defProp(Object, 'preventExtensions', {
	      value: function identifyingPreventExtensions(obj) {
	        getHiddenRecord(obj);
	        return oldPreventExtensions(obj);
	      }
	    });
	  })();

	  function constFunc(func) {
	    func.prototype = null;
	    return Object.freeze(func);
	  }

	  var calledAsFunctionWarningDone = false;
	  function calledAsFunctionWarning() {
	    // Future ES6 WeakMap is currently (2013-09-10) expected to reject WeakMap()
	    // but we used to permit it and do it ourselves, so warn only.
	    if (!calledAsFunctionWarningDone && typeof console !== 'undefined') {
	      calledAsFunctionWarningDone = true;
	      console.warn('WeakMap should be invoked as new WeakMap(), not ' +
	          'WeakMap(). This will be an error in the future.');
	    }
	  }

	  var nextId = 0;

	  var OurWeakMap = function() {
	    if (!(this instanceof OurWeakMap)) {  // approximate test for new ...()
	      calledAsFunctionWarning();
	    }

	    // We are currently (12/25/2012) never encountering any prematurely
	    // non-extensible keys.
	    var keys = []; // brute force for prematurely non-extensible keys.
	    var values = []; // brute force for corresponding values.
	    var id = nextId++;

	    function get___(key, opt_default) {
	      var index;
	      var hiddenRecord = getHiddenRecord(key);
	      if (hiddenRecord) {
	        return id in hiddenRecord ? hiddenRecord[id] : opt_default;
	      } else {
	        index = keys.indexOf(key);
	        return index >= 0 ? values[index] : opt_default;
	      }
	    }

	    function has___(key) {
	      var hiddenRecord = getHiddenRecord(key);
	      if (hiddenRecord) {
	        return id in hiddenRecord;
	      } else {
	        return keys.indexOf(key) >= 0;
	      }
	    }

	    function set___(key, value) {
	      var index;
	      var hiddenRecord = getHiddenRecord(key);
	      if (hiddenRecord) {
	        hiddenRecord[id] = value;
	      } else {
	        index = keys.indexOf(key);
	        if (index >= 0) {
	          values[index] = value;
	        } else {
	          // Since some browsers preemptively terminate slow turns but
	          // then continue computing with presumably corrupted heap
	          // state, we here defensively get keys.length first and then
	          // use it to update both the values and keys arrays, keeping
	          // them in sync.
	          index = keys.length;
	          values[index] = value;
	          // If we crash here, values will be one longer than keys.
	          keys[index] = key;
	        }
	      }
	      return this;
	    }

	    function delete___(key) {
	      var hiddenRecord = getHiddenRecord(key);
	      var index, lastIndex;
	      if (hiddenRecord) {
	        return id in hiddenRecord && delete hiddenRecord[id];
	      } else {
	        index = keys.indexOf(key);
	        if (index < 0) {
	          return false;
	        }
	        // Since some browsers preemptively terminate slow turns but
	        // then continue computing with potentially corrupted heap
	        // state, we here defensively get keys.length first and then use
	        // it to update both the keys and the values array, keeping
	        // them in sync. We update the two with an order of assignments,
	        // such that any prefix of these assignments will preserve the
	        // key/value correspondence, either before or after the delete.
	        // Note that this needs to work correctly when index === lastIndex.
	        lastIndex = keys.length - 1;
	        keys[index] = void 0;
	        // If we crash here, there's a void 0 in the keys array, but
	        // no operation will cause a "keys.indexOf(void 0)", since
	        // getHiddenRecord(void 0) will always throw an error first.
	        values[index] = values[lastIndex];
	        // If we crash here, values[index] cannot be found here,
	        // because keys[index] is void 0.
	        keys[index] = keys[lastIndex];
	        // If index === lastIndex and we crash here, then keys[index]
	        // is still void 0, since the aliasing killed the previous key.
	        keys.length = lastIndex;
	        // If we crash here, keys will be one shorter than values.
	        values.length = lastIndex;
	        return true;
	      }
	    }

	    return Object.create(OurWeakMap.prototype, {
	      get___:    { value: constFunc(get___) },
	      has___:    { value: constFunc(has___) },
	      set___:    { value: constFunc(set___) },
	      delete___: { value: constFunc(delete___) }
	    });
	  };

	  OurWeakMap.prototype = Object.create(Object.prototype, {
	    get: {
	      /**
	       * Return the value most recently associated with key, or
	       * opt_default if none.
	       */
	      value: function get(key, opt_default) {
	        return this.get___(key, opt_default);
	      },
	      writable: true,
	      configurable: true
	    },

	    has: {
	      /**
	       * Is there a value associated with key in this WeakMap?
	       */
	      value: function has(key) {
	        return this.has___(key);
	      },
	      writable: true,
	      configurable: true
	    },

	    set: {
	      /**
	       * Associate value with key in this WeakMap, overwriting any
	       * previous association if present.
	       */
	      value: function set(key, value) {
	        return this.set___(key, value);
	      },
	      writable: true,
	      configurable: true
	    },

	    'delete': {
	      /**
	       * Remove any association for key in this WeakMap, returning
	       * whether there was one.
	       *
	       * <p>Note that the boolean return here does not work like the
	       * {@code delete} operator. The {@code delete} operator returns
	       * whether the deletion succeeds at bringing about a state in
	       * which the deleted property is absent. The {@code delete}
	       * operator therefore returns true if the property was already
	       * absent, whereas this {@code delete} method returns false if
	       * the association was already absent.
	       */
	      value: function remove(key) {
	        return this.delete___(key);
	      },
	      writable: true,
	      configurable: true
	    }
	  });

	  if (typeof HostWeakMap === 'function') {
	    (function() {
	      // If we got here, then the platform has a WeakMap but we are concerned
	      // that it may refuse to store some key types. Therefore, make a map
	      // implementation which makes use of both as possible.

	      // In this mode we are always using double maps, so we are not proxy-safe.
	      // This combination does not occur in any known browser, but we had best
	      // be safe.
	      if (doubleWeakMapCheckSilentFailure && typeof Proxy !== 'undefined') {
	        Proxy = undefined;
	      }

	      function DoubleWeakMap() {
	        if (!(this instanceof OurWeakMap)) {  // approximate test for new ...()
	          calledAsFunctionWarning();
	        }

	        // Preferable, truly weak map.
	        var hmap = new HostWeakMap();

	        // Our hidden-property-based pseudo-weak-map. Lazily initialized in the
	        // 'set' implementation; thus we can avoid performing extra lookups if
	        // we know all entries actually stored are entered in 'hmap'.
	        var omap = undefined;

	        // Hidden-property maps are not compatible with proxies because proxies
	        // can observe the hidden name and either accidentally expose it or fail
	        // to allow the hidden property to be set. Therefore, we do not allow
	        // arbitrary WeakMaps to switch to using hidden properties, but only
	        // those which need the ability, and unprivileged code is not allowed
	        // to set the flag.
	        //
	        // (Except in doubleWeakMapCheckSilentFailure mode in which case we
	        // disable proxies.)
	        var enableSwitching = false;

	        function dget(key, opt_default) {
	          if (omap) {
	            return hmap.has(key) ? hmap.get(key)
	                : omap.get___(key, opt_default);
	          } else {
	            return hmap.get(key, opt_default);
	          }
	        }

	        function dhas(key) {
	          return hmap.has(key) || (omap ? omap.has___(key) : false);
	        }

	        var dset;
	        if (doubleWeakMapCheckSilentFailure) {
	          dset = function(key, value) {
	            hmap.set(key, value);
	            if (!hmap.has(key)) {
	              if (!omap) { omap = new OurWeakMap(); }
	              omap.set(key, value);
	            }
	            return this;
	          };
	        } else {
	          dset = function(key, value) {
	            if (enableSwitching) {
	              try {
	                hmap.set(key, value);
	              } catch (e) {
	                if (!omap) { omap = new OurWeakMap(); }
	                omap.set___(key, value);
	              }
	            } else {
	              hmap.set(key, value);
	            }
	            return this;
	          };
	        }

	        function ddelete(key) {
	          var result = !!hmap['delete'](key);
	          if (omap) { return omap.delete___(key) || result; }
	          return result;
	        }

	        return Object.create(OurWeakMap.prototype, {
	          get___:    { value: constFunc(dget) },
	          has___:    { value: constFunc(dhas) },
	          set___:    { value: constFunc(dset) },
	          delete___: { value: constFunc(ddelete) },
	          permitHostObjects___: { value: constFunc(function(token) {
	            if (token === weakMapPermitHostObjects) {
	              enableSwitching = true;
	            } else {
	              throw new Error('bogus call to permitHostObjects___');
	            }
	          })}
	        });
	      }
	      DoubleWeakMap.prototype = OurWeakMap.prototype;
	      module.exports = DoubleWeakMap;

	      // define .constructor to hide OurWeakMap ctor
	      Object.defineProperty(WeakMap.prototype, 'constructor', {
	        value: WeakMap,
	        enumerable: false,  // as default .constructor is
	        configurable: true,
	        writable: true
	      });
	    })();
	  } else {
	    // There is no host WeakMap, so we must use the emulation.

	    // Emulated WeakMaps are incompatible with native proxies (because proxies
	    // can observe the hidden name), so we must disable Proxy usage (in
	    // ArrayLike and Domado, currently).
	    if (typeof Proxy !== 'undefined') {
	      Proxy = undefined;
	    }

	    module.exports = OurWeakMap;
	  }
	})();


	/*** EXPORTS FROM exports-loader ***/
	module.exports = global.WeakMap;
	}.call(global));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12), (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports) {

	var MutationObserver = window.MutationObserver
	  || window.WebKitMutationObserver
	  || window.MozMutationObserver;

	/*
	 * Copyright 2012 The Polymer Authors. All rights reserved.
	 * Use of this source code is goverened by a BSD-style
	 * license that can be found in the LICENSE file.
	 */

	var WeakMap = window.WeakMap;

	if (typeof WeakMap === 'undefined') {
	  var defineProperty = Object.defineProperty;
	  var counter = Date.now() % 1e9;

	  WeakMap = function() {
	    this.name = '__st' + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
	  };

	  WeakMap.prototype = {
	    set: function(key, value) {
	      var entry = key[this.name];
	      if (entry && entry[0] === key)
	        entry[1] = value;
	      else
	        defineProperty(key, this.name, {value: [key, value], writable: true});
	      return this;
	    },
	    get: function(key) {
	      var entry;
	      return (entry = key[this.name]) && entry[0] === key ?
	          entry[1] : undefined;
	    },
	    'delete': function(key) {
	      var entry = key[this.name];
	      if (!entry) return false;
	      var hasValue = entry[0] === key;
	      entry[0] = entry[1] = undefined;
	      return hasValue;
	    },
	    has: function(key) {
	      var entry = key[this.name];
	      if (!entry) return false;
	      return entry[0] === key;
	    }
	  };
	}

	var registrationsTable = new WeakMap();

	// We use setImmediate or postMessage for our future callback.
	var setImmediate = window.msSetImmediate;

	// Use post message to emulate setImmediate.
	if (!setImmediate) {
	  var setImmediateQueue = [];
	  var sentinel = String(Math.random());
	  window.addEventListener('message', function(e) {
	    if (e.data === sentinel) {
	      var queue = setImmediateQueue;
	      setImmediateQueue = [];
	      queue.forEach(function(func) {
	        func();
	      });
	    }
	  });
	  setImmediate = function(func) {
	    setImmediateQueue.push(func);
	    window.postMessage(sentinel, '*');
	  };
	}

	// This is used to ensure that we never schedule 2 callas to setImmediate
	var isScheduled = false;

	// Keep track of observers that needs to be notified next time.
	var scheduledObservers = [];

	/**
	 * Schedules |dispatchCallback| to be called in the future.
	 * @param {MutationObserver} observer
	 */
	function scheduleCallback(observer) {
	  scheduledObservers.push(observer);
	  if (!isScheduled) {
	    isScheduled = true;
	    setImmediate(dispatchCallbacks);
	  }
	}

	function wrapIfNeeded(node) {
	  return window.ShadowDOMPolyfill &&
	      window.ShadowDOMPolyfill.wrapIfNeeded(node) ||
	      node;
	}

	function dispatchCallbacks() {
	  // http://dom.spec.whatwg.org/#mutation-observers

	  isScheduled = false; // Used to allow a new setImmediate call above.

	  var observers = scheduledObservers;
	  scheduledObservers = [];
	  // Sort observers based on their creation UID (incremental).
	  observers.sort(function(o1, o2) {
	    return o1.uid_ - o2.uid_;
	  });

	  var anyNonEmpty = false;
	  observers.forEach(function(observer) {

	    // 2.1, 2.2
	    var queue = observer.takeRecords();
	    // 2.3. Remove all transient registered observers whose observer is mo.
	    removeTransientObserversFor(observer);

	    // 2.4
	    if (queue.length) {
	      observer.callback_(queue, observer);
	      anyNonEmpty = true;
	    }
	  });

	  // 3.
	  if (anyNonEmpty)
	    dispatchCallbacks();
	}

	function removeTransientObserversFor(observer) {
	  observer.nodes_.forEach(function(node) {
	    var registrations = registrationsTable.get(node);
	    if (!registrations)
	      return;
	    registrations.forEach(function(registration) {
	      if (registration.observer === observer)
	        registration.removeTransientObservers();
	    });
	  });
	}

	/**
	 * This function is used for the "For each registered observer observer (with
	 * observer's options as options) in target's list of registered observers,
	 * run these substeps:" and the "For each ancestor ancestor of target, and for
	 * each registered observer observer (with options options) in ancestor's list
	 * of registered observers, run these substeps:" part of the algorithms. The
	 * |options.subtree| is checked to ensure that the callback is called
	 * correctly.
	 *
	 * @param {Node} target
	 * @param {function(MutationObserverInit):MutationRecord} callback
	 */
	function forEachAncestorAndObserverEnqueueRecord(target, callback) {
	  for (var node = target; node; node = node.parentNode) {
	    var registrations = registrationsTable.get(node);

	    if (registrations) {
	      for (var j = 0; j < registrations.length; j++) {
	        var registration = registrations[j];
	        var options = registration.options;

	        // Only target ignores subtree.
	        if (node !== target && !options.subtree)
	          continue;

	        var record = callback(options);
	        if (record)
	          registration.enqueue(record);
	      }
	    }
	  }
	}

	var uidCounter = 0;

	/**
	 * The class that maps to the DOM MutationObserver interface.
	 * @param {Function} callback.
	 * @constructor
	 */
	function JsMutationObserver(callback) {
	  this.callback_ = callback;
	  this.nodes_ = [];
	  this.records_ = [];
	  this.uid_ = ++uidCounter;
	}

	JsMutationObserver.prototype = {
	  observe: function(target, options) {
	    target = wrapIfNeeded(target);

	    // 1.1
	    if (!options.childList && !options.attributes && !options.characterData ||

	        // 1.2
	        options.attributeOldValue && !options.attributes ||

	        // 1.3
	        options.attributeFilter && options.attributeFilter.length &&
	            !options.attributes ||

	        // 1.4
	        options.characterDataOldValue && !options.characterData) {

	      throw new SyntaxError();
	    }

	    var registrations = registrationsTable.get(target);
	    if (!registrations)
	      registrationsTable.set(target, registrations = []);

	    // 2
	    // If target's list of registered observers already includes a registered
	    // observer associated with the context object, replace that registered
	    // observer's options with options.
	    var registration;
	    for (var i = 0; i < registrations.length; i++) {
	      if (registrations[i].observer === this) {
	        registration = registrations[i];
	        registration.removeListeners();
	        registration.options = options;
	        break;
	      }
	    }

	    // 3.
	    // Otherwise, add a new registered observer to target's list of registered
	    // observers with the context object as the observer and options as the
	    // options, and add target to context object's list of nodes on which it
	    // is registered.
	    if (!registration) {
	      registration = new Registration(this, target, options);
	      registrations.push(registration);
	      this.nodes_.push(target);
	    }

	    registration.addListeners();
	  },

	  disconnect: function() {
	    this.nodes_.forEach(function(node) {
	      var registrations = registrationsTable.get(node);
	      for (var i = 0; i < registrations.length; i++) {
	        var registration = registrations[i];
	        if (registration.observer === this) {
	          registration.removeListeners();
	          registrations.splice(i, 1);
	          // Each node can only have one registered observer associated with
	          // this observer.
	          break;
	        }
	      }
	    }, this);
	    this.records_ = [];
	  },

	  takeRecords: function() {
	    var copyOfRecords = this.records_;
	    this.records_ = [];
	    return copyOfRecords;
	  }
	};

	/**
	 * @param {string} type
	 * @param {Node} target
	 * @constructor
	 */
	function MutationRecord(type, target) {
	  this.type = type;
	  this.target = target;
	  this.addedNodes = [];
	  this.removedNodes = [];
	  this.previousSibling = null;
	  this.nextSibling = null;
	  this.attributeName = null;
	  this.attributeNamespace = null;
	  this.oldValue = null;
	}

	function copyMutationRecord(original) {
	  var record = new MutationRecord(original.type, original.target);
	  record.addedNodes = original.addedNodes.slice();
	  record.removedNodes = original.removedNodes.slice();
	  record.previousSibling = original.previousSibling;
	  record.nextSibling = original.nextSibling;
	  record.attributeName = original.attributeName;
	  record.attributeNamespace = original.attributeNamespace;
	  record.oldValue = original.oldValue;
	  return record;
	};

	// We keep track of the two (possibly one) records used in a single mutation.
	var currentRecord, recordWithOldValue;

	/**
	 * Creates a record without |oldValue| and caches it as |currentRecord| for
	 * later use.
	 * @param {string} oldValue
	 * @return {MutationRecord}
	 */
	function getRecord(type, target) {
	  return currentRecord = new MutationRecord(type, target);
	}

	/**
	 * Gets or creates a record with |oldValue| based in the |currentRecord|
	 * @param {string} oldValue
	 * @return {MutationRecord}
	 */
	function getRecordWithOldValue(oldValue) {
	  if (recordWithOldValue)
	    return recordWithOldValue;
	  recordWithOldValue = copyMutationRecord(currentRecord);
	  recordWithOldValue.oldValue = oldValue;
	  return recordWithOldValue;
	}

	function clearRecords() {
	  currentRecord = recordWithOldValue = undefined;
	}

	/**
	 * @param {MutationRecord} record
	 * @return {boolean} Whether the record represents a record from the current
	 * mutation event.
	 */
	function recordRepresentsCurrentMutation(record) {
	  return record === recordWithOldValue || record === currentRecord;
	}

	/**
	 * Selects which record, if any, to replace the last record in the queue.
	 * This returns |null| if no record should be replaced.
	 *
	 * @param {MutationRecord} lastRecord
	 * @param {MutationRecord} newRecord
	 * @param {MutationRecord}
	 */
	function selectRecord(lastRecord, newRecord) {
	  if (lastRecord === newRecord)
	    return lastRecord;

	  // Check if the the record we are adding represents the same record. If
	  // so, we keep the one with the oldValue in it.
	  if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord))
	    return recordWithOldValue;

	  return null;
	}

	/**
	 * Class used to represent a registered observer.
	 * @param {MutationObserver} observer
	 * @param {Node} target
	 * @param {MutationObserverInit} options
	 * @constructor
	 */
	function Registration(observer, target, options) {
	  this.observer = observer;
	  this.target = target;
	  this.options = options;
	  this.transientObservedNodes = [];
	}

	Registration.prototype = {
	  enqueue: function(record) {
	    var records = this.observer.records_;
	    var length = records.length;

	    // There are cases where we replace the last record with the new record.
	    // For example if the record represents the same mutation we need to use
	    // the one with the oldValue. If we get same record (this can happen as we
	    // walk up the tree) we ignore the new record.
	    if (records.length > 0) {
	      var lastRecord = records[length - 1];
	      var recordToReplaceLast = selectRecord(lastRecord, record);
	      if (recordToReplaceLast) {
	        records[length - 1] = recordToReplaceLast;
	        return;
	      }
	    } else {
	      scheduleCallback(this.observer);
	    }

	    records[length] = record;
	  },

	  addListeners: function() {
	    this.addListeners_(this.target);
	  },

	  addListeners_: function(node) {
	    var options = this.options;
	    if (options.attributes)
	      node.addEventListener('DOMAttrModified', this, true);

	    if (options.characterData)
	      node.addEventListener('DOMCharacterDataModified', this, true);

	    if (options.childList)
	      node.addEventListener('DOMNodeInserted', this, true);

	    if (options.childList || options.subtree)
	      node.addEventListener('DOMNodeRemoved', this, true);
	  },

	  removeListeners: function() {
	    this.removeListeners_(this.target);
	  },

	  removeListeners_: function(node) {
	    var options = this.options;
	    if (options.attributes)
	      node.removeEventListener('DOMAttrModified', this, true);

	    if (options.characterData)
	      node.removeEventListener('DOMCharacterDataModified', this, true);

	    if (options.childList)
	      node.removeEventListener('DOMNodeInserted', this, true);

	    if (options.childList || options.subtree)
	      node.removeEventListener('DOMNodeRemoved', this, true);
	  },

	  /**
	   * Adds a transient observer on node. The transient observer gets removed
	   * next time we deliver the change records.
	   * @param {Node} node
	   */
	  addTransientObserver: function(node) {
	    // Don't add transient observers on the target itself. We already have all
	    // the required listeners set up on the target.
	    if (node === this.target)
	      return;

	    this.addListeners_(node);
	    this.transientObservedNodes.push(node);
	    var registrations = registrationsTable.get(node);
	    if (!registrations)
	      registrationsTable.set(node, registrations = []);

	    // We know that registrations does not contain this because we already
	    // checked if node === this.target.
	    registrations.push(this);
	  },

	  removeTransientObservers: function() {
	    var transientObservedNodes = this.transientObservedNodes;
	    this.transientObservedNodes = [];

	    transientObservedNodes.forEach(function(node) {
	      // Transient observers are never added to the target.
	      this.removeListeners_(node);

	      var registrations = registrationsTable.get(node);
	      for (var i = 0; i < registrations.length; i++) {
	        if (registrations[i] === this) {
	          registrations.splice(i, 1);
	          // Each node can only have one registered observer associated with
	          // this observer.
	          break;
	        }
	      }
	    }, this);
	  },

	  handleEvent: function(e) {
	    // Stop propagation since we are managing the propagation manually.
	    // This means that other mutation events on the page will not work
	    // correctly but that is by design.
	    e.stopImmediatePropagation();

	    switch (e.type) {
	      case 'DOMAttrModified':
	        // http://dom.spec.whatwg.org/#concept-mo-queue-attributes

	        var name = e.attrName;
	        var namespace = e.relatedNode.namespaceURI;
	        var target = e.target;

	        // 1.
	        var record = new getRecord('attributes', target);
	        record.attributeName = name;
	        record.attributeNamespace = namespace;

	        // 2.
	        var oldValue =
	            e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;

	        forEachAncestorAndObserverEnqueueRecord(target, function(options) {
	          // 3.1, 4.2
	          if (!options.attributes)
	            return;

	          // 3.2, 4.3
	          if (options.attributeFilter && options.attributeFilter.length &&
	              options.attributeFilter.indexOf(name) === -1 &&
	              options.attributeFilter.indexOf(namespace) === -1) {
	            return;
	          }
	          // 3.3, 4.4
	          if (options.attributeOldValue)
	            return getRecordWithOldValue(oldValue);

	          // 3.4, 4.5
	          return record;
	        });

	        break;

	      case 'DOMCharacterDataModified':
	        // http://dom.spec.whatwg.org/#concept-mo-queue-characterdata
	        var target = e.target;

	        // 1.
	        var record = getRecord('characterData', target);

	        // 2.
	        var oldValue = e.prevValue;


	        forEachAncestorAndObserverEnqueueRecord(target, function(options) {
	          // 3.1, 4.2
	          if (!options.characterData)
	            return;

	          // 3.2, 4.3
	          if (options.characterDataOldValue)
	            return getRecordWithOldValue(oldValue);

	          // 3.3, 4.4
	          return record;
	        });

	        break;

	      case 'DOMNodeRemoved':
	        this.addTransientObserver(e.target);
	        // Fall through.
	      case 'DOMNodeInserted':
	        // http://dom.spec.whatwg.org/#concept-mo-queue-childlist
	        var target = e.relatedNode;
	        var changedNode = e.target;
	        var addedNodes, removedNodes;
	        if (e.type === 'DOMNodeInserted') {
	          addedNodes = [changedNode];
	          removedNodes = [];
	        } else {

	          addedNodes = [];
	          removedNodes = [changedNode];
	        }
	        var previousSibling = changedNode.previousSibling;
	        var nextSibling = changedNode.nextSibling;

	        // 1.
	        var record = getRecord('childList', target);
	        record.addedNodes = addedNodes;
	        record.removedNodes = removedNodes;
	        record.previousSibling = previousSibling;
	        record.nextSibling = nextSibling;

	        forEachAncestorAndObserverEnqueueRecord(target, function(options) {
	          // 2.1, 3.2
	          if (!options.childList)
	            return;

	          // 2.2, 3.3
	          return record;
	        });

	    }

	    clearRecords();
	  }
	};

	if (!MutationObserver) {
	  MutationObserver = JsMutationObserver;
	}

	module.exports = MutationObserver;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * ComponentFactory
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * generates and manages components
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _show = __webpack_require__(15);

	var _show2 = _interopRequireDefault(_show);

	var _hide = __webpack_require__(17);

	var _hide2 = _interopRequireDefault(_hide);

	var _toggle = __webpack_require__(18);

	var _toggle2 = _interopRequireDefault(_toggle);

	var _clickoff = __webpack_require__(19);

	var _clickoff2 = _interopRequireDefault(_clickoff);

	var _accordion = __webpack_require__(20);

	var _accordion2 = _interopRequireDefault(_accordion);

	var _increment = __webpack_require__(21);

	var _increment2 = _interopRequireDefault(_increment);

	var _decrement = __webpack_require__(22);

	var _decrement2 = _interopRequireDefault(_decrement);

	var _filetext = __webpack_require__(23);

	var _filetext2 = _interopRequireDefault(_filetext);

	var _scrollbox = __webpack_require__(24);

	var _scrollbox2 = _interopRequireDefault(_scrollbox);

	var _height = __webpack_require__(25);

	var _height2 = _interopRequireDefault(_height);

	var _grid = __webpack_require__(26);

	var _grid2 = _interopRequireDefault(_grid);

	var _scroll = __webpack_require__(27);

	var _scroll2 = _interopRequireDefault(_scroll);

	var _src = __webpack_require__(28);

	var _src2 = _interopRequireDefault(_src);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var COMPONENTS = {
		Show: _show2.default,
		Hide: _hide2.default,
		Toggle: _toggle2.default,
		Clickoff: _clickoff2.default,
		Accordion: _accordion2.default,
		Increment: _increment2.default,
		Decrement: _decrement2.default,
		Filetext: _filetext2.default,
		Scrollbox: _scrollbox2.default,
		Height: _height2.default,
		Grid: _grid2.default,
		Scroll: _scroll2.default,
		Src: _src2.default
	};

	var ComponentFactory = function () {
		function ComponentFactory(events, config) {
			var _this = this;

			_classCallCheck(this, ComponentFactory);

			this.events = events;
			this.config = config;

			this.topId = 0;
			this.components = {};

			this.IGNORE_ATTS = ['disable', 'min', 'max'];
			this.COMPONENT_CLASSES = Object.keys(this.config.attributes).filter(function (val) {
				return !_utils2.default.contains(_this.IGNORE_ATTS, val);
			});

			if (this.config.observeDom) {

				this.events.subscribe('nodeadded.mutation', this.build, {}, this);
			}

			this.start();
		}

		/**
	  * create an element after a DOM mutation
	  * need to check if this element is already created
	  */


		_createClass(ComponentFactory, [{
			key: 'build',
			value: function build(name, el) {

				// don't initialise a component because of an att
				// we should ignore: (disable, min, max)
				if (this.IGNORE_ATTS.indexOf(name) !== -1) {

					return;
				}

				// if the component is already initialised
				// on the element,
				// exit
				if (el.getAttribute('data-target-' + name + '-id') !== null) {

					return;
				}

				this.topId++;

				this.components[this.topId] = new COMPONENTS[name](el, this.topId, name, this.events, this.config);
			}

			/**
	   * initComponent
	   * by name
	   * for each Target element that currently exists
	   * in DOM
	   * if scope is used, only get elements contained within scope
	   */

		}, {
			key: 'initComponent',
			value: function initComponent(name, scope) {
				var _this2 = this;

				var selector = '[' + this.config.attributes[name] + ']';
				var elList = void 0;

				if (scope) {

					elList = scope.querySelectorAll(selector);
				} else {

					elList = _utils2.default.qsa(selector);
				}

				_utils2.default.forEach.call(elList, function (el, i) {

					_this2.topId++;

					_this2.components[_this2.topId] = new COMPONENTS[name](el, _this2.topId, name, _this2.events, _this2.config);
				});
			}

			/**
	   * find component by DOM element
	   * used by Target.API
	   */

		}, {
			key: 'find',
			value: function find(el) {

				var component = false;

				_utils2.default.forIn(this.components, function (id, components) {

					if (components[id].el === el) {

						component = components[id];
					}
				});

				return component;
			}

			/**
	   * get component by ID
	   * used by target.API
	   */

		}, {
			key: 'get',
			value: function get(id) {

				return this.components[id];
			}

			/**
	   * component for one-time use
	   * used by API
	   */

		}, {
			key: 'use',
			value: function use(name, targets) {

				var el = document.createElement('div');

				var Component = COMPONENTS[name];

				var component = new Component(el, 'tmp', name, this.events, this.config);

				component.targets = targets;

				return component;
			}

			/**
	   * start function run manually
	   * after object instantiation
	   */

		}, {
			key: 'start',
			value: function start(scope) {
				var _this3 = this;

				this.COMPONENT_CLASSES.forEach(function (name) {
					return _this3.initComponent(name, scope);
				});
			}
		}]);

		return ComponentFactory;
	}();

	module.exports = ComponentFactory;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Show
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * UI element that shows another element onclick
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<a data-target-show="#show-this">Click to show #show-this</a>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Show = function (_UI) {
		_inherits(Show, _UI);

		function Show(el, _id, name, events, config) {
			_classCallCheck(this, Show);

			var _this = _possibleConstructorReturn(this, (Show.__proto__ || Object.getPrototypeOf(Show)).call(this, el, _id, name, events, config));

			_this.targets = _utils2.default.qsa(_this.el.getAttribute(_this.config.attributes.Show));

			_this.addDomEventHandler('click', _this.onClick);

			return _this;
		}

		/**
	  * when the element is clicked,
	  * show the target element
	  * (using css)
	  */


		_createClass(Show, [{
			key: 'onClick',
			value: function onClick(e) {
				var _this2 = this;

				if (this.isDisabled) {

					return;
				}

				if (this.NODE_NAME === 'A') {

					e.preventDefault();
				}

				_utils2.default.forEach.call(this.targets, function (target) {
					return _this2.show(target);
				});
			}
		}]);

		return Show;
	}(_ui2.default);

	module.exports = Show;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * target.UI
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Base class component object
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * define default functionality that all UI components will share
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UI = function () {
		function UI(el, _id, name, events, config) {
			_classCallCheck(this, UI);

			var _this = this;

			this.id = _id;
			this.componentType = name;

			this.config = config;
			this.events = events;

			// element variables
			this.el = el;
			this.NODE_NAME = el.nodeName;
			this.disabled = false;

			// bind id
			this.el.setAttribute('data-target-' + name + '-id', this.id);

			// event handlers
			this.eventHandlers = {};
			this.addEventHandler('resize', this.setDisabled);

			if (this.config.observeDom) {

				this.addEventHandler('attributes.mutation', this.handleAttMutation);
			}

			this.addEventHandler('show', this.onShow);
			this.addEventHandler('hide', this.onHide);

			// DOM event handlers
			this.domEventHandlers = {};

			// initialize
			this.updateAtts();
		}

		/**
	  * add an event handler to a UI element
	  * using Target's internal event buss
	  * scope callback to this object
	  * store for removal by this.destroy
	  */


		_createClass(UI, [{
			key: 'addEventHandler',
			value: function addEventHandler(eventName, cb) {

				this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);
			}

			/**
	   * attach a callback to a DOM event handler
	   * scope the callback to this object
	   * store for removal by this.destroy
	   */

		}, {
			key: 'addDomEventHandler',
			value: function addDomEventHandler(eventName, cb, el) {
				var _this2 = this;

				var attachedCb = function attachedCb(e) {

					cb.apply(_this2, [e]);
				};

				if (!el) {

					el = this.el;
				}

				this.domEventHandlers[eventName] = {

					cb: attachedCb,

					el: el

				};

				el.addEventListener(eventName, attachedCb, false);
			}
		}, {
			key: 'removeEventHandler',
			value: function removeEventHandler(handler) {

				this.events.remove(handler, this.eventHandlers[handler].id);
			}
		}, {
			key: 'removeDomEventHandler',
			value: function removeDomEventHandler(domHandler) {

				this.domEventHandlers[domHandler] = this.domEventHandlers[domHandler].el.removeEventListener(domHandler, this.domEventHandlers[domHandler].cb);
			}

			/**
	   * remove all events used by internal pub/sub
	   * remove all dom events
	   */

		}, {
			key: 'destroy',
			value: function destroy() {
				var _this3 = this;

				_utils2.default.forIn(this.eventHandlers, function (handler) {
					return _this3.removeEventHandler(handler);
				});
				_utils2.default.forIn(this.domEventHandlers, function (domHandler) {
					return _this3.removeEventHandler(domHandler);
				});
			}

			/**
	   * when attributes are changed in the DOM
	   * the DOM observer watches and will run this callback
	   * ensure our element has been modified
	   * if so, update the component's properties
	   * based on the new attribute values
	   */

		}, {
			key: 'handleAttMutation',
			value: function handleAttMutation(target) {

				if (target === this.el) {

					this.updateAtts();
				}
			}

			/**
	   * request layout update from Window service
	   */

		}, {
			key: 'update',
			value: function update() {

				this.events.publish('update', this.id);
			}

			/**
	   * get attributes on element
	   * set internal properties based on attributes
	   * these properties are used by other methods
	   */

		}, {
			key: 'updateAtts',
			value: function updateAtts() {

				this.disableLayouts = this.el.getAttribute(this.config.attributes.disable);

				if (this.disableLayouts) {

					this.disableLayouts = this.disableLayouts.split(' ');
				} else {

					this.disableLayouts = [];
				}

				this.update();
			}

			/**
	   * on window.resize
	   * determine whether or not a component should be disabled
	   * if so, disable it
	   * if not, enable it
	   */

		}, {
			key: 'setDisabled',
			value: function setDisabled(is) {

				var disable = false;

				for (var i = 0, len = this.disableLayouts.length; i < len; i++) {

					var layout = this.disableLayouts[i];

					if (is[layout] && !this.overrideLayouts) {

						disable = true;
						this.disable(true);
						break;
					}
				}

				if (!disable && !this.overrideLayouts) {

					this.enable(true);
				}
			}

			/**
	   * get "disabled" property
	   */

		}, {
			key: 'disable',


			/**
	   * set "disabled" property to true
	   * deactivates element
	   * when called via api, no arg passed
	   * therefore override
	   * so that windoe resizing doesn't
	   * override enabled/disabled state
	   * when set via api
	   */
			value: function disable(doNotOverride) {

				this.overrideLayouts = !doNotOverride;

				this.disabled = true;

				return this;
			}

			/**
	   * set "disabled" property to false
	   * activates element
	   * when called via api, no arg passed
	   * therefore override
	   * so that windoe resizing doesn't
	   * override enabled/disabled state
	   * when set via api
	   */

		}, {
			key: 'enable',
			value: function enable(doNotOverride) {

				this.overrideLayouts = !doNotOverride;

				this.disabled = false;

				return this;
			}

			/**
	   * show an element using css
	   * could be this UI element, could be another target
	   */

		}, {
			key: 'show',
			value: function show(el) {
				var _this4 = this;

				if (!el.classList.contains(this.config.activeClass)) {

					_utils2.default.render(function () {

						el.classList.add(_this4.config.activeClass);

						_this4.events.publish('show', el);
					});
				}
			}

			/**
	   * hide an element using css
	   * could be this UI element, could be another target
	   */

		}, {
			key: 'hide',
			value: function hide(el) {
				var _this5 = this;

				if (el.classList.contains(this.config.activeClass)) {

					_utils2.default.render(function () {

						el.classList.remove(_this5.config.activeClass);

						_this5.events.publish('hide', el);
					});
				}
			}

			/**
	   * when a target element is shown,
	   * update this element's state
	   */

		}, {
			key: 'onShow',
			value: function onShow(el) {

				// some UI elements don't have targets
				if (this.targets && _utils2.default.contains(this.targets, el)) {

					this.show(this.el);
				}
			}

			/**
	   * when a target element is shown,
	   * update this element's state
	   */

		}, {
			key: 'onHide',
			value: function onHide(el) {

				// some UI elements don't have targets
				if (this.targets && _utils2.default.contains(this.targets, el)) {

					this.hide(this.el);
				}
			}
		}, {
			key: 'isDisabled',
			get: function get() {

				return this.disabled;
			}
		}]);

		return UI;
	}();

	module.exports = UI;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Hide
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * UI element that hides another element onclick
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<a data-target-hide="#my-target">Click to hide #my-target</a>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var Hide = function (_UI) {
		_inherits(Hide, _UI);

		function Hide(el, _id, name, events, config) {
			_classCallCheck(this, Hide);

			var _this = _possibleConstructorReturn(this, (Hide.__proto__ || Object.getPrototypeOf(Hide)).call(this, el, _id, name, events, config));

			_this.targets = _utils2.default.qsa(_this.el.getAttribute(_this.config.attributes.Hide));

			_this.addDomEventHandler('click', _this.onClick);

			_this.update();

			return _this;
		}

		/**
	  * when the element is clicked,
	  * hide the target element
	  * (using css)
	  */


		_createClass(Hide, [{
			key: 'onClick',
			value: function onClick(e) {
				var _this2 = this;

				if (this.isDisabled) {

					return;
				}

				if (this.NODE_NAME === 'A') {

					e.preventDefault();
				}

				_utils2.default.forEach.call(this.targets, function (target) {
					return _this2.hide(target);
				});
			}
		}]);

		return Hide;
	}(_ui2.default);

	module.exports = Hide;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Toggle
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * UI element that shows/hides another element on click
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<a data-target-toggle="#my-target">Click to toggle #my-target</a>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * TODO: add support for checkbox inputs
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * if element.type === checkbox
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  bind to onchange event instead of onclick
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Toggle = function (_UI) {
		_inherits(Toggle, _UI);

		function Toggle(el, _id, name, events, config) {
			_classCallCheck(this, Toggle);

			var _this = _possibleConstructorReturn(this, (Toggle.__proto__ || Object.getPrototypeOf(Toggle)).call(this, el, _id, name, events, config));

			_this.targets = _utils2.default.qsa(_this.el.getAttribute(_this.config.attributes.Toggle));

			_this.addDomEventHandler('click', _this.onClick);

			return _this;
		}

		/**
	  * when the element is clicked
	  * toggle the target element's visibility
	  */


		_createClass(Toggle, [{
			key: 'onClick',
			value: function onClick(e) {
				var _this2 = this;

				if (this.isDisabled) {

					return;
				}

				if (this.NODE_NAME === 'A') {

					e.preventDefault();
				}

				_utils2.default.forEach.call(this.targets, function (target) {
					return _this2.toggle(target);
				});
			}

			/**
	   * if the target is shown, hide it
	   * if the target is hidden, show it
	   * all using css
	   * also toggle state of toggle button itself
	   */

		}, {
			key: 'toggle',
			value: function toggle(el) {

				if (!el.classList.contains(this.config.activeClass)) {

					this.show(el);
				} else {

					this.hide(el);
				}
			}
		}]);

		return Toggle;
	}(_ui2.default);

	module.exports = Toggle;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Clickoff
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * close an element by clicking away from it
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<a data-target-clickoff>Click away from this to close</a>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Clickoff = function (_UI) {
		_inherits(Clickoff, _UI);

		function Clickoff(el, _id, name, events, config) {
			_classCallCheck(this, Clickoff);

			var _this = _possibleConstructorReturn(this, (Clickoff.__proto__ || Object.getPrototypeOf(Clickoff)).call(this, el, _id, name, events, config));

			_this.addDomEventHandler('click', _this.onClick, document);

			return _this;
		}

		/**
	  * when the user clicks anywhere in the document
	  * determine if the click came from outside this element
	  * if so, close this element
	  */


		_createClass(Clickoff, [{
			key: 'onClick',
			value: function onClick(e) {

				var hide = true;

				// return if disabled
				// or if element already hidden
				if (this.isDisabled || !this.el.classList.contains(this.config.activeClass)) {

					return true;
				}

				// check event source
				// check if source is or is contained within clickoff element
				// also be sure to not conflict with other targets
				var showAtt = e.srcElement.getAttribute(this.config.attributes.Show);
				var toggleAtt = e.srcElement.getAttribute(this.config.attributes.Toggle);

				if (e.srcElement === this.el || _utils2.default.isDescendant(this.el, e.srcElement) || showAtt === '#' + this.el.id || showAtt === '.' + this.el.className || toggleAtt === '#' + this.el.id || toggleAtt === '.' + this.el.className) {
					hide = false;
				}

				// if so, close element
				if (hide && this.el.classList.contains(this.config.activeClass)) {

					this.hide(this.el);
				}
			}
		}]);

		return Clickoff;
	}(_ui2.default);

	module.exports = Clickoff;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Accordion
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * UI consisting of group of toggles that work together
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ```
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * <div data-target-accordion=".js-toggle, .js-content">
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <h2 class="js-toggle">Click to Toggle Content</h2>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <div class="js-content">Content here</div>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <h2 class="js-toggle">Click to Toggle Content</h2>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <div class="js-content">Content here</div>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * </div>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ```
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * TODO: proper event handling
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * currently, only one reference for each event name is stored
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the accordion will require multiple event handlers of the same name to be stored
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Accordion = function (_UI) {
		_inherits(Accordion, _UI);

		function Accordion(el, _id, name, events, config) {
			_classCallCheck(this, Accordion);

			var _this = _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call(this, el, _id, name, events, config));

			_this.setArgs();

			_this.setToggles();

			_this.setContents();

			if (_this.toggles.length !== _this.contents.length) {

				throw 'Target.js Error on Accordion component: component must contain an equal number of toggles and contents';
			}

			_this.current = null;

			_utils2.default.forEach.call(_this.toggles, function (toggle, i) {

				_this.addDomEventHandler('click', _this.toggle(toggle, i), toggle);
			});

			return _this;
		}

		_createClass(Accordion, [{
			key: 'setArgs',
			value: function setArgs() {

				var args = this.el.getAttribute(this.config.attributes.Accordion);

				args = args.split(',');

				this.args = args;

				if (this.args.length !== 2) {

					throw 'Target.js Error on Accordion component: the value of "' + this.utils.stripBrackets(this.config.attributes.Accordion) + '" must contain two comma-separated CSS selectors';
				}

				return this.args;
			}
		}, {
			key: 'setToggles',
			value: function setToggles() {

				this.toggles = this.el.querySelectorAll(this.args[0]);

				return this.toggles;
			}
		}, {
			key: 'setContents',
			value: function setContents() {

				this.contents = this.el.querySelectorAll(this.args[1]);

				return this.contents;
			}
		}, {
			key: 'toggle',
			value: function toggle(_toggle, i) {
				var _this2 = this;

				return function (e) {

					if (_this2.isDisabled) {

						return;
					}

					if (_toggle.nodeType === 'A') {

						e.preventDefault();
					}

					if (_this2.current === i) {

						_this2.current = null;

						_this2.hide(_this2.toggles[i]);
						_this2.hide(_this2.contents[i]);
					} else {

						_this2.current = i;

						_utils2.default.forEach.call(_this2.contents, function (content, i) {

							_this2.hide(_this2.toggles[i]);
							_this2.hide(content);
						});

						_this2.show(_this2.toggles[i]);
						_this2.show(_this2.contents[i]);
					}
				};
			}
		}]);

		return Accordion;
	}(_ui2.default);

	module.exports = Accordion;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Increment
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * UI element that increments the value of an input
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<a data-target-increment="#qty" data-target-max="99">+1 to #qty</a>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Increment = function (_UI) {
		_inherits(Increment, _UI);

		function Increment(el, _id, name, events, config) {
			_classCallCheck(this, Increment);

			var _this = _possibleConstructorReturn(this, (Increment.__proto__ || Object.getPrototypeOf(Increment)).call(this, el, _id, name, events, config));

			_this.targets = _utils2.default.qsa(_this.el.getAttribute(_this.config.attributes.Increment));

			_utils2.default.forEach.call(_this.targets, function (target) {

				if (target.nodeName !== 'INPUT') {

					throw 'Target.js Error on Increment component: the selector in "' + _this.config.attributes.Increment + '" must target an <input> element';
				}
			});

			_this.setLimits();

			_this.addDomEventHandler('click', _this.onClick);

			return _this;
		}

		/**
	  * get min and max values
	  * declared on the element itself
	  * use defaults if not declared
	  */


		_createClass(Increment, [{
			key: 'setLimits',
			value: function setLimits() {

				this.max = this.el.getAttribute(this.config.attributes.max);
				this.min = this.el.getAttribute(this.config.attributes.min);

				if (this.min === null) {

					this.min = 0;
				}

				if (this.max !== null) {

					this.max = parseInt(this.max, 10);
				}
			}

			/**
	   * increment the value of the target input
	   * only if lower than the specified maximum value
	   */

		}, {
			key: 'increment',
			value: function increment(target) {

				var curVal = parseInt(target.value, 10);
				var val = curVal + 1;

				if (this.max !== null) {

					if (this.max >= val) {

						this.events.publish('max', target);
					}

					val = Math.min(val, this.max);
				}

				target.value = val;
			}

			/**
	   * when the incrementer is clicked,
	   * increment the target input element
	   */

		}, {
			key: 'onClick',
			value: function onClick(e) {
				var _this2 = this;

				if (this.isDisabled) {

					return;
				}

				_utils2.default.forEach.call(this.targets, function (target) {
					return _this2.increment(target);
				});
			}
		}]);

		return Increment;
	}(_ui2.default);

	module.exports = Increment;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Decrement
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * decrements the value of a target input
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<a data-target-decrement="#qty" data-target-min="0">-1 to #qty</a>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Decrement = function (_UI) {
		_inherits(Decrement, _UI);

		function Decrement(el, _id, name, events, config) {
			_classCallCheck(this, Decrement);

			var _this = _possibleConstructorReturn(this, (Decrement.__proto__ || Object.getPrototypeOf(Decrement)).call(this, el, _id, name, events, config));

			_this.targets = _utils2.default.qsa(_this.el.getAttribute(_this.config.attributes.Decrement));

			_utils2.default.forEach.call(_this.targets, function (target) {

				if (target.nodeName !== 'INPUT') {

					throw 'Target.js Error on Decrement component: the selector in "' + _this.config.attributes.Decrement + '" must target an <input> element';
				}
			});

			_this.setLimits();

			_this.addDomEventHandler('click', _this.onClick);

			return _this;
		}

		/**
	  * get min and max values
	  * declared on the element itself
	  * use defaults if not declared
	  */


		_createClass(Decrement, [{
			key: 'setLimits',
			value: function setLimits() {

				this.max = this.el.getAttribute(this.config.attributes.max);
				this.min = this.el.getAttribute(this.config.attributes.min);

				if (this.min === null) {

					this.min = 0;
				} else {

					this.min = parseInt(this.min, 10);
				}

				if (this.max !== null) {

					this.max = parseInt(this.max, 10);
				}
			}

			/**
	   * decrement the value of the target input
	   * only if higher than the specified minimum value
	   */

		}, {
			key: 'decrement',
			value: function decrement(target) {

				var curVal = parseInt(target.value, 10);
				var val = curVal - 1;

				if (val <= this.min) {

					this.events.publish('min', target);
				}

				val = Math.max(val, this.min);

				target.value = val;
			}

			/**
	   * when the decrementer is clicked,
	   * decrement the target input element
	   */

		}, {
			key: 'onClick',
			value: function onClick(e) {
				var _this2 = this;

				if (this.isDisabled) {

					return;
				}

				_utils2.default.forEach.call(this.targets, function (target) {
					return _this2.decrement(target);
				});
			}
		}]);

		return Decrement;
	}(_ui2.default);

	module.exports = Decrement;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Filetext
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * gives you the text of a file input
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * allows you to style file inputs any way you like
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<input type="file" data-target-filetext="#my-filetext-element" />`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Filetext = function (_UI) {
		_inherits(Filetext, _UI);

		function Filetext(el, _id, name, events, config) {
			_classCallCheck(this, Filetext);

			var _this = _possibleConstructorReturn(this, (Filetext.__proto__ || Object.getPrototypeOf(Filetext)).call(this, el, _id, name, events, config));

			if (_this.NODE_NAME !== 'INPUT' || _this.el.getAttribute('type') !== 'file') {

				throw 'Error on Target.Filetext component: "' + _this.config.attributes.Filetext + '" must be applied to an <input> element with \'type="file"\'';
			}

			_this.targets = _utils2.default.qsa(_this.el.getAttribute(_this.config.attributes.Filetext));

			_this.addDomEventHandler('change', _this.onChange);

			return _this;
		}

		/**
	  * when the file input is changed
	  * get filename
	  * and set as text of target element
	  */


		_createClass(Filetext, [{
			key: 'onChange',
			value: function onChange(e) {

				var filename = this.el.files && this.el.files[0];

				if (this.isDisabled) {

					return;
				}

				if (this.el.files.length) {

					filename = this.el.files[0].name;

					_utils2.default.forEach.call(this.targets, function (target) {
						return target.innerHTML = filename;
					});
				}
			}
		}]);

		return Filetext;
	}(_ui2.default);

	module.exports = Filetext;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Scrollbox
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * creates a box that automatically gets scrollbars
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * when it gets too tall
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * and loses them when it isn't
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<div data-target-scrollbox="500">This will scroll when it's 501px tall</div>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * or
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<div data-target-scrollbox="-500">This will scroll when it's taller than window.height - 500px</div>` 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Scrollbox = function (_UI) {
		_inherits(Scrollbox, _UI);

		function Scrollbox(el, _id, name, events, config) {
			_classCallCheck(this, Scrollbox);

			var _this = _possibleConstructorReturn(this, (Scrollbox.__proto__ || Object.getPrototypeOf(Scrollbox)).call(this, el, _id, name, events, config));

			_this.maxHeight = _this.el.getAttribute(_this.config.attributes.Scrollbox);
			_this.maxHeight = parseInt(_this.maxHeight, 10);

			if (_this.el.hasChildNodes()) {

				_this.children = _this.el.childNodes;
			}

			_this.addEventHandler('resize', _this.onResize);
			_this.addEventHandler('resize' + _this.id, _this.onResize);

			_this.update();

			return _this;
		}

		/**
	  * get the user-declared max height threshold
	  */


		_createClass(Scrollbox, [{
			key: 'getMaxHeight',
			value: function getMaxHeight() {

				if (this.maxHeight >= 0) {

					return this.maxHeight;
				} else {

					return this.h + this.maxHeight;
				}
			}

			/**
	   * get the total height of all the contents
	   * within our scrollbox element
	   */

		}, {
			key: 'getContentsHeight',
			value: function getContentsHeight() {

				var height = 0;

				_utils2.default.forEach.call(this.children, function (child) {
					return height += child.offsetHeight;
				});

				return height;
			}

			/**
	   * determine if we need to add a scrollbar to our element
	   * if so, add it
	   * if not, remove it
	   */

		}, {
			key: 'setOverflow',
			value: function setOverflow() {

				if (this.getContentsHeight() > this.getMaxHeight() && !this.isDisabled) {

					this.el.style.overflowY = 'scroll';
				} else {

					this.el.style.overflowY = 'auto';
				}
			}

			/**
	   * determine whether or not we need to set a maxHeight property
	   * on element
	   * if so, set it
	   * if not, remove it
	   */

		}, {
			key: 'setMaxHeight',
			value: function setMaxHeight() {

				if (this.isDisabled) {

					this.el.style.maxHeight = '';
				} else {

					this.el.style.maxHeight = this.getMaxHeight() + 'px';
				}
			}

			/**
	   * on window.resize
	   * determine if we need a max height on our element
	   * determine if we need a scrollbar on our element
	   * if so, set them
	   */

		}, {
			key: 'onResize',
			value: function onResize(is, w, h) {

				this.h = h;
				this.setMaxHeight();
				this.setOverflow();
			}
		}]);

		return Scrollbox;
	}(_ui2.default);

	module.exports = Scrollbox;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Height
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * sets the height of an element programmatically
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * defaults to window height (cross-browser)
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * updates on window.resize
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<div data-target-height="window">Is always window height</div>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * or
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<div data-target-height="-100">is always window height - 100px</div>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Height = function (_UI) {
		_inherits(Height, _UI);

		function Height(el, _id, name, events, config) {
			_classCallCheck(this, Height);

			var _this = _possibleConstructorReturn(this, (Height.__proto__ || Object.getPrototypeOf(Height)).call(this, el, _id, name, events, config));

			_this.initHeight();

			_this.addEventHandler('resize', _this.setHeight);
			_this.addEventHandler('resize' + _this.id, _this.setHeight);

			_this.update();

			return _this;
		}

		/**
	  * create initial height settings
	  * based on attributes
	  */


		_createClass(Height, [{
			key: 'initHeight',
			value: function initHeight() {

				this.height = this.el.getAttribute(this.config.attributes.Height);

				if (!this.height || this.height === 'window') {

					this.height = 0;
				} else {

					this.height = parseInt(this.height, 10);
				}
			}

			/**
	   * get the user-declared max height threshold
	   */

		}, {
			key: 'getHeight',
			value: function getHeight() {

				if (this.height > 0) {

					return this.height;
				} else {

					return this.windowHeight + this.height;
				}
			}

			/**
	   * on window.resize
	   * if enabled, set element height
	   * else reset height
	   */

		}, {
			key: 'setHeight',
			value: function setHeight(is, w, h) {

				this.windowHeight = h;

				if (this.isDisabled) {

					this.el.style.height = '';
				} else {

					this.el.style.height = this.getHeight() + 'px';
				}
			}
		}]);

		return Height;
	}(_ui2.default);

	module.exports = Height;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Grid
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * gives element the same height as the other items on its row
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * provide a space-separated list of numbers in the data-target-grid attribute
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * this list is the number of columns per row
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * by layout -- first: mobile, second: tablet, third: desktop
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * example:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<div data-target-grid="2 3 4">
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 	 <div>Product thumbnail here</div>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <div>Product thumbnail here</div>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <div>Product thumbnail here (these will all have equal height)</div>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   <div>Product thumbnail here</div>
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * </div>`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * NOTE: this is a performance hog.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Just too much iterating through the DOM,
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * setting and unsetting element heights on each iteration
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * TODO: look into a better approach
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Grid = function (_UI) {
		_inherits(Grid, _UI);

		function Grid(el, _id, name, events, config) {
			_classCallCheck(this, Grid);

			var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, el, _id, name, events, config));

			_this.TEXT_NODE = 3;
			_this.COMMENT_NODE = 8;

			_this.published = false;

			_this.setChildren();

			_this.setBreakpoints();

			_this.addEventHandler('resize', _this.onResize);
			_this.addEventHandler('resize' + _this.id, _this.onResize);

			_this.update();

			// since the grid may contain images,
			// let's update the layout on window.load as well
			_this.addDomEventHandler('load', _this.onLoad, window);

			return _this;
		}

		/**
	  * set breakpoints
	  * this will determine how many items are in a row
	  * at various breakpoints (mobile, tablet, desktop, large)
	  * also, if the breakpoint is "disable", instead of an int,
	  * disable at that breakpoint
	  */


		_createClass(Grid, [{
			key: 'setBreakpoints',
			value: function setBreakpoints() {

				var breakpoints = this.el.getAttribute(this.config.attributes.Grid).split(' ');

				var disableLayouts = [];

				var layouts = ['mobile', 'tablet', 'desktop', 'large'];

				breakpoints.forEach(function (breakpoint, i) {

					if (breakpoint === 'disable') {

						disableLayouts.push(layouts[i]);

						breakpoint = 0;
					} else {

						breakpoint = parseInt(breakpoint, 10);
					}
				});

				this.breakpoints = {

					mobile: breakpoints[0],
					tablet: breakpoints[1],
					desktop: breakpoints[2],
					large: breakpoints[3]

				};

				if (disableLayouts.length) {

					this.el.setAttribute(this.config.attributes.disable, disableLayouts.join(' '));
				}
			}
		}, {
			key: 'onLoad',
			value: function onLoad(e) {

				this.removeDomEventHandler('load');
				this.update();
			}

			/**
	   * find child nodes of element
	   * filter out any text nodes
	   */

		}, {
			key: 'setChildren',
			value: function setChildren() {
				var _this2 = this;

				this.children = [];

				if (!this.el.hasChildNodes()) {

					return [];
				}

				var childNodes = this.el.childNodes;

				_utils2.default.forEach.call(childNodes, function (child) {

					if (child.nodeType !== _this2.TEXT_NODE && child.nodeType !== _this2.COMMENT_NODE) {

						_this2.children.push(child);
					}
				});
			}

			/**
	   * determine how many thumbnails per row
	   * based on responsive layout
	   * "is" object passed from our "window" service
	   * via events
	   */

		}, {
			key: 'setPerRow',
			value: function setPerRow(is) {
				var _this3 = this;

				// set default
				this.perRow = this.breakpoints.mobile;

				// update with relevant media query if applicable
				Object.keys(this.breakpoints).forEach(function (layout) {

					if (_this3.breakpoints[layout] && is[layout]) {

						_this3.perRow = _this3.breakpoints[layout];
					}
				});

				return this.perRow;
			}

			/**
	   * set which thumbnails are in a row together
	   * based on the number of thumbs per row
	   * which is based on the current responsive layout
	   */

		}, {
			key: 'buildRows',
			value: function buildRows() {
				var _this4 = this;

				var lastChild = this.children[this.children.length - 1];
				var row = [];
				var i = 0;

				this.rows = [];

				// loop through children
				// and add element to row
				// or if row is full
				// add row to rows array
				_utils2.default.forEach.call(this.children, function (child) {

					if (i >= _this4.perRow) {

						_this4.rows.push(row);

						i = 0;

						row = [];
					}

					row.push(child);

					i++;

					if (child === lastChild) {

						_this4.rows.push(row);
					}
				});

				return this.rows;
			}

			/**
	   * on window.resize
	   * if enabled
	   * determine how many thumbs per row
	   * group those thumbs together in rows
	   * reset the height of thumbs to their default
	   * get, calculate, and set the correct height
	   * so thumbs in the same row have the same height
	   */

		}, {
			key: 'calculateGrid',
			value: function calculateGrid(is) {

				this.setPerRow(is);

				this.buildRows();

				this.rows.forEach(function (row) {

					var maxHeight = 0;

					row.forEach(function (item) {

						item.style.height = '';

						maxHeight = Math.max(item.offsetHeight, maxHeight);
					});

					row.forEach(function (item) {

						item.style.height = maxHeight + 'px';
					});
				});
			}

			/**
	   * on window.resize
	   * if disabled
	   * reset heights of all children
	   */

		}, {
			key: 'resetGrid',
			value: function resetGrid() {

				_utils2.default.forEach.call(this.children, function (child) {
					return child.style.height = '';
				});
			}

			/**
	   * on window.resize
	   * either build grid
	   * or reset
	   * depending on if enabled or disabled
	   */

		}, {
			key: 'onResize',
			value: function onResize(is) {

				if (!this.isDisabled) {

					this.calculateGrid(is);
				} else {

					this.resetGrid();
				}
			}
		}]);

		return Grid;
	}(_ui2.default);

	module.exports = Grid;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Scroll
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * show an element when it scrolls into view
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * calculate an offset on the element by the attribute value, if it exists
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var PAGE_FACTOR = 0.2;

	var Scroll = function (_UI) {
		_inherits(Scroll, _UI);

		function Scroll(el, _id, name, events, config) {
			_classCallCheck(this, Scroll);

			var _this = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this, el, _id, name, events, config));

			_this.getOffset();

			_this.addEventHandler('resize', _this.onResize);
			_this.addEventHandler('resize' + _this.id, _this.onResize);
			_this.addEventHandler('scroll', _this.onScroll);

			_this.update();

			return _this;
		}

		_createClass(Scroll, [{
			key: 'getOffset',
			value: function getOffset() {

				this.offset = this.el.getAttribute(this.config.attributes.Scroll);

				if (this.offset) {

					this.offset = parseInt(this.offset, 10);
				} else {

					this.offset = 0;
				}

				this.top = 0;
			}
		}, {
			key: 'calculateThreshold',
			value: function calculateThreshold(h) {

				var rect = this.el.getBoundingClientRect();

				this.threshold = rect.top + this.top - h * (1 - PAGE_FACTOR);
			}
		}, {
			key: 'onScroll',
			value: function onScroll(top) {

				this.top = top;

				// if we're past threshold,
				// or at bottom of document
				// show el
				if (this.top >= this.threshold + this.offset || this.top >= this.docH - this.windowH) {

					this.show(this.el);
				} else {

					this.hide(this.el);
				}
			}

			/**
	   * on window.resize
	   * calculate or recalculate
	   * when our element should be shown or hidden
	   */

		}, {
			key: 'onResize',
			value: function onResize(is, w, h, dh) {

				this.docH = dh;

				this.windowH = h;

				this.calculateThreshold(h);
			}
		}]);

		return Scroll;
	}(_ui2.default);

	module.exports = Scroll;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	var _ui = __webpack_require__(16);

	var _ui2 = _interopRequireDefault(_ui);

	var _imagecache = __webpack_require__(29);

	var _imagecache2 = _interopRequireDefault(_imagecache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * target.Src
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Responsively loads images
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * based on current layout
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * usage:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * add space-separated list of image urls:
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the first is for mobile
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the second is for tablet
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the third is for desktop
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the fourth is for large
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<img src="my_blang_img.gif" data-target-src="/mobile-img.jpg /tablet-img.jpg /desktop-img.jpg">`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you can use only one or two sources
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<img src="my_blang_img.gif" data-target-src="/mobile-img.jpg /tablet-and-desktop-img.jpg">`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you can specify to use the previous image by passing a null argument
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * `<img src="my_blang_img.gif" data-target-src="/mobile-and-tablet-img.jpg null /desktop-img.jpg">`
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var Src = function (_UI) {
		_inherits(Src, _UI);

		function Src(el, _id, name, events, config) {
			_classCallCheck(this, Src);

			var _this = _possibleConstructorReturn(this, (Src.__proto__ || Object.getPrototypeOf(Src)).call(this, el, _id, name, events, config));

			if (_this.NODE_NAME !== 'IMG' && _this.NODE_NAME !== 'DIV') {

				throw 'Target.js Error on Src component: "' + _this.config.attributes.Src + '" must be applied to an <img> or <div> element';
			}

			_this.published = false;

			_this.isLoading = false;

			// TODO: only load when in view
			// this.inview = false;
			// this.queue = target.Queue.create();

			_this.getSrcs();

			_this.imageCache = _imagecache2.default;
			_this.img = _this.imageCache.img;

			_this.addEventHandler('resize', _this.onResize);
			_this.addEventHandler('resize' + _this.id, _this.onResize);
			// TODO: only load when in view
			//this.addEventHandler('scroll', this.onScroll);

			// request an update from target.Window
			_this.update();

			return _this;
		}

		/**
	  * get list of image urls from element attribute
	  * loop through and assign each image to a layout
	  * make mobile-first,
	  * so that if a layout doesn't have an image explicity assigned
	  * it will inherit the image from the next layout down
	  *
	  * ex. if only two images defined, desktop layout can inherit image from tablet layout
	  */


		_createClass(Src, [{
			key: 'getSrcs',
			value: function getSrcs() {
				var _this2 = this;

				var srcAtt = this.el.getAttribute(this.config.attributes.Src);
				var srcs = srcAtt.split(' ');
				var latestSrc = null;

				this.srcs = {

					mobile: '',
					tablet: '',
					desktop: '',
					large: ''

				};

				this.currentSrc = '';

				Object.keys(this.srcs).forEach(function (layout, i) {

					var src = srcs[i];

					if (src && src.indexOf('/') !== -1) {

						latestSrc = src;
					}

					_this2.srcs[layout] = latestSrc;
				});
			}
		}, {
			key: 'showImage',
			value: function showImage(src) {

				this.currentSrc = src;

				if (this.NODE_NAME === 'IMG') {

					this.el.src = src;
				} else if (this.NODE_NAME === 'DIV') {

					this.el.style.backgroundImage = 'url("' + src + '")';

					this.show(this.el);
				}
			}

			/**
	   * once image is loaded
	   * remove event handler
	   * if this is an <img>
	   * in a grid, request a layout update
	   */

		}, {
			key: 'onLoad',
			value: function onLoad() {

				if (this.domEventHandlers.load) {

					this.removeDomEventHandler('load');
				}

				if (this.isLoading) {

					this.isLoading = false;
				}

				this.imageCache.add(this.loadingImg);

				this.showImage(this.loadingImg);
			}

			/**
	   * add event handler to load image
	   */

		}, {
			key: 'load',
			value: function load(src) {
				var _this3 = this;

				this.isLoading = true;

				this.loadingImg = src;

				this.addDomEventHandler('load', this.onLoad, this.img);

				this.loadingFallback = setTimeout(function () {

					if (_this3.isLoading) {

						_this3.onLoad();

						clearTimeout(_this3.loadingFallback);
					}
				}, 5000);

				this.img.src = src;
			}

			/**
	   * when the window is resized,
	   * check which layout we're currently at
	   * and load the appropriate image
	   */

		}, {
			key: 'onResize',
			value: function onResize(is, w, h) {
				var _this4 = this;

				Object.keys(this.srcs).forEach(function (layout) {

					var src = _this4.srcs[layout];

					if (is[layout] && src !== _this4.currentSrc) {

						if (!_this4.imageCache.contains(src)) {

							if (_this4.NODE_NAME === 'DIV') {

								_this4.hide(_this4.el);
							}

							_this4.load(src);
						} else {

							_this4.showImage(src);
						}
					}
				});
			}
		}]);

		return Src;
	}(_ui2.default);

	module.exports = Src;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CACHE_NAME = 'targetJsImgsLoaded'; // utility object for tracking which images are already cached
	// track localStorage to prevent bug
	// in which an image stored in cache
	// would not be loaded
	// because target will try to load it and wait for onload event
	// but browser will not load cached images


	var imageCache = {
	  init: function init() {

	    if (!_utils2.default.isIOS && localStorage && localStorage[CACHE_NAME]) {

	      this.images = localStorage[CACHE_NAME];
	    } else {

	      this.images = '';
	    }

	    this.img = document.createElement('img');
	  },
	  contains: function contains(item) {

	    return this.images.indexOf(item) !== -1;
	  },
	  add: function add(item) {

	    if (!this.contains(item)) {

	      this.images += item;
	    }

	    if (!_utils2.default.isIOS && localStorage) {

	      localStorage[CACHE_NAME] = this.images;
	    }
	  }
	};

	imageCache.init();

	module.exports = imageCache;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * target.API
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * make programmatic methods accessible
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * in simplified api
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * mix public methods back into global "target" object
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _utils = __webpack_require__(6);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var API = function () {
		function API(entry) {
			var _this = this;

			_classCallCheck(this, API);

			this.events = entry.events;
			this.componentFactory = entry.componentFactory;

			this.eventHandlers = {};

			// mixin public methods into global target object
			['get', 'on', 'off', 'show', 'hide', 'toggle', 'bind'].forEach(function (method) {
				return entry[method] = _this[method].bind(_this);
			});
		}

		/**
	  * normalize
	  * return one element
	  * to search for component
	  */


		_createClass(API, [{
			key: 'normalize',
			value: function normalize(el) {

				if (typeof el === 'string') {

					el = _utils2.default.qs(el);
				}

				return el;
			}

			/**
	   * normalize els
	   * return Array or NodeList
	   * of elements
	   * (to be used as targets)
	   */

		}, {
			key: 'normalizeEls',
			value: function normalizeEls(els) {

				if (typeof els === 'string') {

					els = _utils2.default.qsa(els);
				} else if (els.length) {

					els = els;
				} else {

					els = [els];
				}

				return els;
			}

			/**
	   * get component by element
	   * accepts only one DOM element
	   * or css selector to return only one DOM element
	   */

		}, {
			key: 'get',
			value: function get(el) {

				el = this.normalize(el);

				var component = this.componentFactory.find(el);

				if (!component) {

					throw 'Target.js Error at target.get(): ' + el.toString() + ' is not a Target.js element.';
				}

				return component;
			}

			/**
	   * show a target (or targets) programmatically
	   */

		}, {
			key: 'show',
			value: function show(els) {

				var component = this.componentFactory.use('Show', this.normalizeEls(els));

				_utils2.default.forEach.call(component.targets, function (target) {
					return component.show(target);
				});

				return this;
			}

			/**
	   * hide a target (or targets) programmatically
	   */

		}, {
			key: 'hide',
			value: function hide(els) {

				var component = this.componentFactory.use('Hide', this.normalizeEls(els));

				_utils2.default.forEach.call(component.targets, function (target) {
					return component.hide(target);
				});

				return this;
			}

			/**
	   * toggle a target (or targets) programmatically
	   */

		}, {
			key: 'toggle',
			value: function toggle(els) {

				var component = this.componentFactory.use('Toggle', this.normalizeEls(els));

				_utils2.default.forEach.call(component.targets, function (target) {
					return component.toggle(target);
				});

				return this;
			}

			/**
	   * add event handler meant for our window service
	   * (resize, mobile, tablet, desktop)
	   */

		}, {
			key: 'onWindowEvent',
			value: function onWindowEvent(eventName, cb) {

				if (!this.eventHandlers[eventName]) {

					this.eventHandlers[eventName] = [];
				}

				this.eventHandlers[eventName].push({

					cb: cb,

					event: this.events.subscribe(eventName, cb)

				});

				return this;
			}

			/**
	   * remove event handler for our window service
	   */

		}, {
			key: 'offWindowEvent',
			value: function offWindowEvent(eventName, cb) {
				var _this2 = this;

				var handlersCopy = [];

				this.eventHandlers[eventName].forEach(function (handler) {

					if (handler.cb !== cb) {

						handlersCopy.push(handler);
					} else {

						_this2.events.remove(eventName, handler.event.id);
					}
				});

				this.eventHandlers[eventName] = handlersCopy;

				return this;
			}

			/**
	   * add event handler for Target component events
	   */

		}, {
			key: 'onElEvent',
			value: function onElEvent(eventName, els, cb) {
				var _this3 = this;

				els = this.normalizeEls(els);

				if (!this.eventHandlers[eventName]) {

					this.eventHandlers[eventName] = [];
				}

				_utils2.default.forEach.call(els, function (el) {

					// will return object containing id for removal
					_this3.eventHandlers[eventName].push({

						cb: cb,
						el: el,
						event: _this3.events.subscribe(eventName, function (el) {

							return function (evEl) {

								if (evEl === el) {

									cb(el);
								}
							};
						}(el))

					});
				});

				return this;
			}

			/**
	   * remove event handler for Target events
	   */

		}, {
			key: 'offElEvent',
			value: function offElEvent(eventName, els, cb) {
				var _this4 = this;

				var handlersCopy = [];

				els = this.normalizeEls(els);

				this.eventHandlers[eventName].forEach(function (handler) {

					if (_utils2.default.contains(els, handler.el) && cb === cb) {

						_this4.events.remove(eventName, handler.event.id);
					} else {

						handlersCopy.push(handler);
					}
				});

				this.eventHandlers[eventName] = handlersCopy;

				return this;
			}

			/**
	   * normalize on handler
	   * (facade pattern)
	   * allow user to just call the .on method
	   * internally figure out which type of event we should bind
	   * because we could be binding to component events or our window service events
	   */

		}, {
			key: 'on',
			value: function on(eventName, arg2, arg3) {

				if (typeof arg2 === 'function') {

					this.onWindowEvent(eventName, arg2);
				} else {

					this.onElEvent(eventName, arg2, arg3);
				}

				return this;
			}

			/**
	   * facade for removing event handlers
	   */

		}, {
			key: 'off',
			value: function off(eventName, arg2, arg3) {

				if (typeof arg2 === 'function') {

					this.offWindowEvent(eventName, arg2);
				} else {

					this.offElEvent(eventName, arg2, arg3);
				}

				return this;
			}

			/**
	   * bind target to an element/document fragment
	   *
	   * search within the element
	   * and initialize any components
	   * declared on elements within
	   *
	   * useful for binding to elements after being rendered dynamically
	   */

		}, {
			key: 'bind',
			value: function bind(el) {

				el = this.normalize(el);

				this.componentFactory.start(el);
			}
		}]);

		return API;
	}();

	module.exports = API;

/***/ }
/******/ ]);