(function() {"use strict";

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

(function(target, undefined) {
    "use strict";
    target.config = {
        activeClass: "target-active",
        attributes: {
            Toggle: "data-target-toggle",
            Show: "data-target-show",
            Hide: "data-target-hide",
            Clickoff: "data-target-clickoff",
            Increment: "data-target-increment",
            Decrement: "data-target-decrement",
            Scrollbox: "data-target-scrollbox",
            Grid: "data-target-grid",
            Src: "data-target-src",
            disable: "data-target-disable",
            max: "data-target-max",
            min: "data-target-min"
        },
        breakpoints: {
            tablet: 768,
            desktop: 1025
        },
        debounceDelay: 100
    };
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    var config = target.config;
    target.utils = {
        mixin: function mixin(origObj, newObj) {
            var k;
            var origV;
            var newV;
            var kk;
            for (k in newObj) {
                if (newObj.hasOwnProperty(k)) {
                    newV = newObj[k];
                    origV = origObj[k];
                    origObj[k] = newObj[k];
                    if ((typeof origV === "undefined" ? "undefined" : _typeof(origV)) === "object" && (typeof newV === "undefined" ? "undefined" : _typeof(newV)) === "object") {
                        for (kk in newV) {
                            if (newV.hasOwnProperty(kk)) {
                                origV[kk] = newV[kk];
                            }
                        }
                    }
                }
            }
        },
        forEach: window.Array.prototype.forEach,
        debounce: function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
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
        values: function values(obj) {
            var array = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    array.push(obj[prop]);
                }
            }
            return array;
        },
        qsa: document.querySelectorAll.bind(document),
        stripBrackets: function stripBrackets(att) {
            return att.replace("[", "").replace("]", "");
        },
        capitalize: function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
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
        noop: function noop() {},
        forIn: function forIn(obj, cb) {
            var prop;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    cb(prop, obj);
                }
            }
        }
    };
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.UI = function() {
        function TargetUI(el, _id, target, name) {
            _classCallCheck(this, TargetUI);
            this._id = _id;
            this.config = target.config;
            this.events = target.events;
            this.utils = target.utils;
            this.el = el;
            this.disabled = false;
            this.componentName = name;
            this.el.setAttribute("data-target-" + name + "-id", this._id);
            this.eventHandlers = {};
            this.addEventHandler("resize.window", this.setDisabled);
            this.addEventHandler("attributes.mutation", this.handleAttMutation);
            this.domEventHandlers = {};
            this.updateAtts();
        }
        _createClass(TargetUI, [ {
            key: "addEventHandler",
            value: function addEventHandler(eventName, cb) {
                this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);
            }
        }, {
            key: "addDomEventHandler",
            value: function addDomEventHandler(eventName, cb, el) {
                var _this = this;
                var attachedCb = function attachedCb(e) {
                    cb.apply(_this, [ e ]);
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
            key: "destroy",
            value: function destroy() {
                var handler;
                var domHandler;
                for (handler in this.eventHandlers) {
                    if (this.eventHandlers.hasOwnProperty()) {
                        this.events.remove(handler, this.eventHandlers[handler].id);
                    }
                }
                for (domHandler in this.domEventHandlers) {
                    if (this.domEventHandlers.hasOwnProperty()) {
                        this.domEventHandlers[domHandler].el.removeEventListener(domHandler, this.domEventHandlers[domHandler].cb);
                    }
                }
            }
        }, {
            key: "handleAttMutation",
            value: function handleAttMutation(target) {
                if (target === this.el) {
                    this.updateAtts();
                }
            }
        }, {
            key: "updateAtts",
            value: function updateAtts() {
                this.disableLayouts = this.el.getAttribute(this.config.attributes.disable);
                if (this.disableLayouts) {
                    this.disableLayouts = this.disableLayouts.split(" ");
                } else {
                    this.disableLayouts = [];
                }
                this.events.publish("update.ui");
            }
        }, {
            key: "setDisabled",
            value: function setDisabled(is) {
                var disable = false;
                var i, len, layout;
                for (i = 0, len = this.disableLayouts.length; i < len; i++) {
                    layout = this.disableLayouts[i];
                    if (is[layout]()) {
                        disable = true;
                        this.disabled = true;
                        break;
                    }
                }
                if (!disable) {
                    this.disabled = false;
                }
            }
        }, {
            key: "isDisabled",
            value: function isDisabled() {
                return this.disabled;
            }
        }, {
            key: "show",
            value: function show(el) {
                if (!el.classList.contains(this.config.activeClass)) {
                    el.classList.add(this.config.activeClass);
                }
            }
        }, {
            key: "hide",
            value: function hide(el) {
                if (el.classList.contains(this.config.activeClass)) {
                    el.classList.remove(this.config.activeClass);
                }
            }
        } ], [ {
            key: "Show",
            value: function Show(el) {
                this.show(el);
            }
        }, {
            key: "Hide",
            value: function Hide(el) {
                this.hide(el);
            }
        } ]);
        return TargetUI;
    }();
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Window = function() {
        function TargetWindow(target) {
            _classCallCheck(this, TargetWindow);
            var _this = this;
            this.w = document.documentElement.clientWidth;
            this.h = document.documentElement.clientHeight;
            this.events = target.events;
            this.config = target.config;
            this.utils = target.utils;
            this.is = {
                mobile: function mobile() {
                    return _this.w < _this.config.breakpoints.tablet;
                },
                tablet: function tablet() {
                    return _this.w >= _this.config.breakpoints.tablet && _this.w < _this.config.breakpoints.desktop;
                },
                desktop: function desktop() {
                    return _this.w >= _this.config.breakpoints.desktop;
                }
            };
            window.addEventListener("resize", this.utils.debounce(function(e) {
                _this.onResize();
            }, this.config.debounceDelay), false);
            this.events.subscribe("update.ui", function() {
                _this.onResize();
            });
        }
        _createClass(TargetWindow, [ {
            key: "width",
            value: function width() {
                return this.w;
            }
        }, {
            key: "height",
            value: function height() {
                return this.h;
            }
        }, {
            key: "onResize",
            value: function onResize() {
                this.w = document.documentElement.clientWidth;
                this.h = document.documentElement.clientHeight;
                this.events.publish("resize.window", this.is);
            }
        } ]);
        return TargetWindow;
    }();
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.DomObserver = function() {
        function TargetDomObserver(target) {
            _classCallCheck(this, TargetDomObserver);
            var _this = this;
            this.TEXT_NODE = 3;
            this.events = target.events;
            this.config = target.config;
            this.utils = target.utils;
            this.observer = new window.MutationObserver(function(mutations, observer) {
                _this.onMutation(mutations, observer);
            });
            this.observer.observe(document, {
                subtree: true,
                childList: true,
                attributeFilter: target.utils.values(_this.config.attributes)
            });
        }
        _createClass(TargetDomObserver, [ {
            key: "publishAddedNodes",
            value: function publishAddedNodes(nodes) {
                var _this = this;
                this.utils.forEach.call(nodes, function(node) {
                    if (node.nodeType === _this.TEXT_NODE) {
                        return;
                    }
                    _this.utils.forIn(_this.config.attributes, function(prop, obj) {
                        var attName = obj[prop];
                        if (node.getAttribute(attName)) {
                            _this.events.publish("nodeadded.mutation", prop, node);
                        }
                    });
                });
            }
        }, {
            key: "onMutation",
            value: function onMutation(mutations, observer) {
                var _this = this;
                mutations.forEach(function(mutation) {
                    switch (mutation.type) {
                      case "attributes":
                        _this.events.publish("attributes.mutation", mutation.target);
                        break;

                      case "childList":
                        _this.publishAddedNodes(mutation.addedNodes);
                        break;

                      default:
                        _this.utils.noop();
                        break;
                    }
                });
            }
        } ]);
        return TargetDomObserver;
    }();
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.ComponentFactory = function() {
        function TargetComponentFactory(target) {
            _classCallCheck(this, TargetComponentFactory);
            var _this = this;
            var attsArray;
            this.events = target.events;
            this.config = target.config;
            this.utils = target.utils;
            this.target = target;
            this.topId = 0;
            this.components = {};
            attsArray = Object.keys(this.config.attributes);
            this.ignoreAtts = [ "disable", "min", "max" ];
            this.componentClasses = attsArray.filter(function(val) {
                return this.ignoreAtts.indexOf(val) === -1;
            }, this);
            this.events.subscribe("nodeadded.mutation", this.create, {}, this);
        }
        _createClass(TargetComponentFactory, [ {
            key: "create",
            value: function create(name, el) {
                var Component;
                if (this.ignoreAtts.indexOf(name) !== -1) {
                    return;
                }
                if (el.getAttribute("data-target-" + name + "-id") !== null) {
                    return;
                }
                Component = this.target[name];
                this.topId++;
                this.components[this.topId] = new Component(el, this.topId, this.target, name);
            }
        }, {
            key: "initComponent",
            value: function initComponent(name) {
                var _this = this;
                var Component = this.target[name];
                this.utils.forEach.call(_this.utils.qsa("[" + _this.config.attributes[name] + "]"), function(el, i) {
                    _this.topId++;
                    _this.components[_this.topId] = new Component(el, _this.topId, _this.target, name);
                });
            }
        }, {
            key: "init",
            value: function init() {
                var _this = this;
                this.componentClasses.forEach(function(name) {
                    _this.initComponent(name);
                });
            }
        } ]);
        return TargetComponentFactory;
    }();
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Show = function(_target$UI) {
        _inherits(TargetShow, _target$UI);
        function TargetShow(el, _id, target, name) {
            _classCallCheck(this, TargetShow);
            var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetShow).call(this, el, _id, target, name));
            _this2.targets = _this2.utils.qsa(_this2.el.getAttribute(_this2.utils.stripBrackets(_this2.config.attributes.Show)));
            _this2.addDomEventHandler("click", _this2.onClick);
            return _this2;
        }
        _createClass(TargetShow, [ {
            key: "onClick",
            value: function onClick(e) {
                var _this = this;
                if (!this.isDisabled()) {
                    this.utils.forEach.call(this.targets, function(target) {
                        _this.show(target);
                    });
                }
            }
        } ]);
        return TargetShow;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Hide = function(_target$UI2) {
        _inherits(TargetHide, _target$UI2);
        function TargetHide(el, _id, target, name) {
            _classCallCheck(this, TargetHide);
            var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetHide).call(this, el, _id, target, name));
            _this3.targets = _this3.utils.qsa(_this3.el.getAttribute(_this3.utils.stripBrackets(_this3.config.attributes.Hide)));
            _this3.addDomEventHandler("click", _this3.onClick);
            return _this3;
        }
        _createClass(TargetHide, [ {
            key: "onClick",
            value: function onClick(e) {
                var _this = this;
                if (!this.isDisabled()) {
                    this.utils.forEach.call(this.targets, function(target) {
                        _this.hide(target);
                    });
                }
            }
        } ]);
        return TargetHide;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Toggle = function(_target$UI3) {
        _inherits(TargetToggle, _target$UI3);
        function TargetToggle(el, _id, target, name) {
            _classCallCheck(this, TargetToggle);
            var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetToggle).call(this, el, _id, target, name));
            _this4.targets = _this4.utils.qsa(_this4.el.getAttribute(_this4.utils.stripBrackets(_this4.config.attributes.Toggle)));
            _this4.addDomEventHandler("click", _this4.onClick);
            return _this4;
        }
        _createClass(TargetToggle, [ {
            key: "onClick",
            value: function onClick(e) {
                var _this = this;
                if (!this.isDisabled()) {
                    this.utils.forEach.call(this.targets, function(target) {
                        _this.toggle(target);
                    });
                }
            }
        }, {
            key: "toggle",
            value: function toggle(el) {
                if (!el.classList.contains(this.config.activeClass)) {
                    this.show(el);
                } else {
                    this.hide(el);
                }
            }
        }, {
            key: "Toggle",
            value: function Toggle(el) {
                this.toggle(el);
            }
        } ]);
        return TargetToggle;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Clickoff = function(_target$UI4) {
        _inherits(TargetClickoff, _target$UI4);
        function TargetClickoff(el, _id, target, name) {
            _classCallCheck(this, TargetClickoff);
            var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetClickoff).call(this, el, _id, target, name));
            _this5.addDomEventHandler("click", _this5.onClick, document);
            return _this5;
        }
        _createClass(TargetClickoff, [ {
            key: "onClick",
            value: function onClick(e) {
                var _this = this;
                var hide = true;
                var showAtt;
                var toggleAtt;
                if (this.isDisabled() || !this.el.classList.contains(this.config.activeClass)) {
                    return true;
                }
                showAtt = e.srcElement.getAttribute(this.config.attributes.Show);
                toggleAtt = e.srcElement.getAttribute(this.config.attributes.Toggle);
                if (e.srcElement === this.el || this.utils.isDescendant(this.el, e.srcElement) || showAtt === "#" + this.el.id || showAtt === "." + this.el.className || toggleAtt === "#" + this.el.id || toggleAtt === "." + this.el.className) {
                    hide = false;
                }
                if (hide && this.el.classList.contains(this.config.activeClass)) {
                    this.hide(this.el);
                }
            }
        } ]);
        return TargetClickoff;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Increment = function(_target$UI5) {
        _inherits(TargetIncrement, _target$UI5);
        function TargetIncrement(el, _id, target, name) {
            _classCallCheck(this, TargetIncrement);
            var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetIncrement).call(this, el, _id, target, name));
            _this6.targets = _this6.utils.qsa(_this6.el.getAttribute(_this6.utils.stripBrackets(_this6.config.attributes.Increment)));
            _this6.setLimits();
            _this6.addDomEventHandler("click", _this6.onClick);
            return _this6;
        }
        _createClass(TargetIncrement, [ {
            key: "setLimits",
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
        }, {
            key: "increment",
            value: function increment(target) {
                var curVal = parseInt(target.value, 10);
                var val = curVal + 1;
                if (this.max !== null) {
                    val = Math.min(val, this.max);
                }
                target.value = val;
            }
        }, {
            key: "onClick",
            value: function onClick(e) {
                var _this = this;
                if (!this.isDisabled()) {
                    this.utils.forEach.call(this.targets, function(target) {
                        _this.increment(target);
                    });
                }
            }
        } ]);
        return TargetIncrement;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Decrement = function(_target$UI6) {
        _inherits(TargetDecrement, _target$UI6);
        function TargetDecrement(el, _id, target, name) {
            _classCallCheck(this, TargetDecrement);
            var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetDecrement).call(this, el, _id, target, name));
            _this7.targets = _this7.utils.qsa(_this7.el.getAttribute(_this7.utils.stripBrackets(_this7.config.attributes.Decrement)));
            _this7.setLimits();
            _this7.addDomEventHandler("click", _this7.onClick);
            return _this7;
        }
        _createClass(TargetDecrement, [ {
            key: "setLimits",
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
        }, {
            key: "decrement",
            value: function decrement(target) {
                var curVal = parseInt(target.value, 10);
                var val = curVal - 1;
                val = Math.max(val, this.min);
                target.value = val;
            }
        }, {
            key: "onClick",
            value: function onClick(e) {
                var _this = this;
                if (!this.isDisabled()) {
                    this.utils.forEach.call(this.targets, function(target) {
                        _this.decrement(target);
                    });
                }
            }
        } ]);
        return TargetDecrement;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Scrollbox = function(_target$UI7) {
        _inherits(TargetScrollbox, _target$UI7);
        function TargetScrollbox(el, _id, target, name) {
            _classCallCheck(this, TargetScrollbox);
            var _this8 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetScrollbox).call(this, el, _id, target, name));
            _this8.maxHeight = _this8.el.getAttribute(_this8.config.attributes.Scrollbox);
            _this8.maxHeight = parseInt(_this8.maxHeight, 10);
            if (_this8.el.hasChildNodes()) {
                _this8.children = _this8.el.childNodes;
            }
            _this8.addEventHandler("resize.window", _this8.onResize);
            _this8.events.publish("update.ui");
            return _this8;
        }
        _createClass(TargetScrollbox, [ {
            key: "getMaxHeight",
            value: function getMaxHeight() {
                if (this.maxHeight >= 0) {
                    return this.maxHeight;
                } else {
                    return document.documentElement.clientHeight + this.maxHeight;
                }
            }
        }, {
            key: "getContentsHeight",
            value: function getContentsHeight() {
                var height = 0;
                this.utils.forEach.call(this.children, function(child) {
                    height += child.offsetHeight;
                });
                return height;
            }
        }, {
            key: "setOverflow",
            value: function setOverflow() {
                if (this.getContentsHeight() > this.getMaxHeight() && !this.isDisabled()) {
                    this.el.style.overflowY = "scroll";
                } else {
                    this.el.style.overflowY = "auto";
                }
            }
        }, {
            key: "setMaxHeight",
            value: function setMaxHeight() {
                if (this.isDisabled()) {
                    this.el.style.maxHeight = "";
                } else {
                    this.el.style.maxHeight = this.getMaxHeight() + "px";
                }
            }
        }, {
            key: "onResize",
            value: function onResize() {
                this.setMaxHeight();
                this.setOverflow();
            }
        } ]);
        return TargetScrollbox;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Grid = function(_target$UI8) {
        _inherits(TargetGrid, _target$UI8);
        function TargetGrid(el, _id, target, name) {
            _classCallCheck(this, TargetGrid);
            var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetGrid).call(this, el, _id, target, name));
            var breakpoints;
            _this9.TEXT_NODE = 3;
            _this9.setChildren();
            breakpoints = _this9.el.getAttribute(_this9.config.attributes.Grid).split(" ");
            _this9.breakpoints = {
                mobile: parseInt(breakpoints[0], 10),
                tablet: parseInt(breakpoints[1], 10),
                desktop: parseInt(breakpoints[2], 10)
            };
            _this9.addEventHandler("resize.window", _this9.calculateGrid);
            _this9.events.publish("update.ui");
            return _this9;
        }
        _createClass(TargetGrid, [ {
            key: "setChildren",
            value: function setChildren() {
                var _this = this;
                var childNodes;
                this.children = [];
                if (!this.el.hasChildNodes()) {
                    return [];
                }
                childNodes = this.el.childNodes;
                this.utils.forEach.call(childNodes, function(child) {
                    if (child.nodeType !== _this.TEXT_NODE) {
                        _this.children.push(child);
                    }
                });
            }
        }, {
            key: "setPerRow",
            value: function setPerRow(is) {
                var _this = this;
                this.perRow = this.breakpoints.mobile;
                Object.keys(this.breakpoints).forEach(function(layout) {
                    if (_this.breakpoints[layout] && is[layout]()) {
                        _this.perRow = _this.breakpoints[layout];
                    }
                });
                return _this.perRow;
            }
        }, {
            key: "buildRows",
            value: function buildRows() {
                var _this = this;
                var lastChild = this.children[this.children.length - 1];
                var row = [];
                var i = 0;
                this.rows = [];
                this.utils.forEach.call(this.children, function(child) {
                    if (i >= _this.perRow) {
                        _this.rows.push(row);
                        i = 0;
                        row = [];
                    }
                    row.push(child);
                    i++;
                    if (child === lastChild) {
                        _this.rows.push(row);
                    }
                });
                return this.rows;
            }
        }, {
            key: "calculateGrid",
            value: function calculateGrid(is) {
                var _this = this;
                this.setPerRow(is);
                this.buildRows();
                this.rows.forEach(function(row) {
                    var maxHeight = 0;
                    row.forEach(function(item) {
                        item.style.height = "";
                        maxHeight = Math.max(item.offsetHeight, maxHeight);
                    });
                    row.forEach(function(item) {
                        item.style.height = maxHeight + "px";
                    });
                });
            }
        } ]);
        return TargetGrid;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Src = function(_target$UI9) {
        _inherits(TargetSrc, _target$UI9);
        function TargetSrc(el, _id, target, name) {
            _classCallCheck(this, TargetSrc);
            var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(TargetSrc).call(this, el, _id, target, name));
            _this10.srcs = {
                mobile: "",
                tablet: "",
                desktop: ""
            };
            _this10.getSrcs();
            _this10.addEventHandler("resize.window", _this10.onResize);
            _this10.events.publish("update.ui");
            return _this10;
        }
        _createClass(TargetSrc, [ {
            key: "getSrcs",
            value: function getSrcs() {
                var _this = this;
                var srcAtt = this.el.getAttribute(this.config.attributes.Src);
                var srcs = srcAtt.split(" ");
                var latestSrc = null;
                Object.keys(this.srcs).forEach(function(layout, i) {
                    var src = srcs[i];
                    if (src) {
                        if (src.indexOf("/") !== -1) {
                            latestSrc = src;
                        }
                    }
                    _this.srcs[layout] = latestSrc;
                });
            }
        }, {
            key: "onLoad",
            value: function onLoad() {
                var eventName = "load";
                this.events.publish("update.ui");
                this.domEventHandlers[eventName].el.removeEventListener(eventName, this.domEventHandlers[eventName].cb);
            }
        }, {
            key: "load",
            value: function load(img) {
                this.addDomEventHandler("load", this.onLoad, this.el);
                this.el.src = img;
            }
        }, {
            key: "onResize",
            value: function onResize(is) {
                var _this = this;
                Object.keys(this.srcs).forEach(function(layout) {
                    if (is[layout]()) {
                        _this.load(_this.srcs[layout]);
                    }
                });
            }
        } ]);
        return TargetSrc;
    }(target.UI);
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.initAPI = function() {
        var _this = this;
        this._getEl = function(el) {
            if (typeof el === "string") {
                el = _this.utils.qsa(el);
            }
            return el;
        };
        this.get = function(el) {
            el = _this._getEl(el);
        };
        this.show = function(el) {
            el = _this._getEl(el);
            _this.UI.Show.apply(_this, el);
        };
        this.hide = function(el) {
            el = _this._getEl(el);
            _this.UI.Hide.apply(_this, el);
        };
        this.toggle = function(el) {
            el = _this._getEl(el);
            _this.Toggle.Toggle.apply(_this, el);
        };
    };
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.init = function(options) {
        var _this = this;
        this.utils.mixin(this.config, options);
        this.events = new window.Mediator();
        this.window = new this.Window(this);
        this.domObserver = new this.DomObserver(this);
        this.componentFactory = new this.ComponentFactory(this);
        document.addEventListener("DOMContentLoaded", function() {
            _this.componentFactory.init();
        }, false);
    };
})(window.target = window.target || {});})();