(function() {(function(target, undefined) {
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
        mixin: function(origObj, newObj) {
            var k;
            var origV;
            var newV;
            var kk;
            for (k in newObj) {
                if (newObj.hasOwnProperty(k)) {
                    newV = newObj[k];
                    origV = origObj[k];
                    origObj[k] = newObj[k];
                    if (typeof origV === "object" && typeof newV === "object") {
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
        contains: function(list, el) {
            var i = window.Array.prototype.indexOf.apply(list, [ el ]);
            var doesContain;
            if (i === -1) {
                doesContain = false;
            } else {
                doesContain = true;
            }
            return doesContain;
        },
        debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this;
                var args = arguments;
                var later = function() {
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
        values: function(obj) {
            var array = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    array.push(obj[prop]);
                }
            }
            return array;
        },
        qsa: document.querySelectorAll.bind(document),
        stripBrackets: function(att) {
            return att.replace("[", "").replace("]", "");
        },
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        isDescendant: function(parent, child) {
            var node = child.parentNode;
            while (node !== null) {
                if (node === parent) {
                    return true;
                }
                node = node.parentNode;
            }
            return false;
        },
        noop: function() {},
        forIn: function(obj, cb) {
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
    target.UI = window.Proto.extend({
        init: function(el, _id, target, name) {
            this._id = _id;
            this.config = target.config;
            this.events = target.events;
            this.utils = target.utils;
            this.el = el;
            this.NODE_NAME = el.nodeName;
            this.disabled = false;
            this.componentName = name;
            this.el.setAttribute("data-target-" + name + "-id", this._id);
            this.eventHandlers = {};
            this.addEventHandler("resize", this.setDisabled);
            this.addEventHandler("attributes.mutation", this.handleAttMutation);
            this.addEventHandler("show", this.onShow);
            this.addEventHandler("hide", this.onHide);
            this.domEventHandlers = {};
            this.updateAtts();
        },
        addEventHandler: function(eventName, cb) {
            this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);
        },
        addDomEventHandler: function(eventName, cb, el) {
            var _this = this;
            var attachedCb = function(e) {
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
        },
        removeEventHandler: function(handler) {
            this.events.remove(handler, this.eventHandlers[handler].id);
        },
        removeDomEventHandler: function(domHandler) {
            this.domEventHandlers[domHandler] = this.domEventHandlers[domHandler].el.removeEventListener(domHandler, this.domEventHandlers[domHandler].cb);
        },
        destroy: function() {
            var handler;
            var domHandler;
            for (handler in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty()) {
                    this.removeEventHandler(handler);
                }
            }
            for (domHandler in this.domEventHandlers) {
                if (this.domEventHandlers.hasOwnProperty()) {
                    this.removeDomEventHandler(domHandler);
                }
            }
        },
        handleAttMutation: function(target) {
            if (target === this.el) {
                this.updateAtts();
            }
        },
        updateAtts: function() {
            this.disableLayouts = this.el.getAttribute(this.config.attributes.disable);
            if (this.disableLayouts) {
                this.disableLayouts = this.disableLayouts.split(" ");
            } else {
                this.disableLayouts = [];
            }
            this.events.publish("update");
        },
        setDisabled: function(is) {
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
        },
        isDisabled: function() {
            return this.disabled;
        },
        show: function(el) {
            if (!el.classList.contains(this.config.activeClass)) {
                el.classList.add(this.config.activeClass);
                this.events.publish("show", el);
            }
        },
        hide: function(el) {
            if (el.classList.contains(this.config.activeClass)) {
                el.classList.remove(this.config.activeClass);
                this.events.publish("hide", el);
            }
        },
        onShow: function(el) {
            if (this.targets && this.utils.contains(this.targets, el)) {
                this.show(this.el);
            }
        },
        onHide: function(el) {
            if (this.targets && this.utils.contains(this.targets, el)) {
                this.hide(this.el);
            }
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Window = window.Proto.extend({
        init: function(target) {
            var _this = this;
            this.w = document.documentElement.clientWidth;
            this.h = document.documentElement.clientHeight;
            this.events = target.events;
            this.config = target.config;
            this.utils = target.utils;
            this.is = {
                mobile: function() {
                    return _this.w < _this.config.breakpoints.tablet;
                },
                tablet: function() {
                    return _this.w >= _this.config.breakpoints.tablet && _this.w < _this.config.breakpoints.desktop;
                },
                desktop: function() {
                    return _this.w >= _this.config.breakpoints.desktop;
                }
            };
            window.addEventListener("resize", this.utils.debounce(function(e) {
                _this.onResize();
            }, this.config.debounceDelay), false);
            this.events.subscribe("update", function() {
                _this.onResize();
            });
        },
        width: function() {
            return this.w;
        },
        height: function() {
            return this.h;
        },
        onResize: function() {
            this.w = document.documentElement.clientWidth;
            this.h = document.documentElement.clientHeight;
            this.events.publish("resize", this.is);
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.DomObserver = window.Proto.extend({
        init: function(target) {
            var _this = this;
            this.TEXT_NODE = 3;
            this.COMMENT_NODE = 8;
            this.events = target.events;
            this.config = target.config;
            this.utils = target.utils;
            this.observer = new window.MutationObserver(function(mutations, observer) {
                _this.onMutation(mutations, observer);
            });
            this.observer.observe(document.body, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: target.utils.values(_this.config.attributes)
            });
        },
        publishAddedNodes: function(nodes) {
            var _this = this;
            this.utils.forEach.call(nodes, function(node) {
                if (node.nodeType === _this.TEXT_NODE || node.nodeType === _this.COMMENT_NODE) {
                    return;
                }
                _this.utils.forIn(_this.config.attributes, function(prop, obj) {
                    var attName = obj[prop];
                    if (node.getAttribute(attName)) {
                        _this.events.publish("nodeadded.mutation", prop, node);
                    }
                });
            });
        },
        onMutation: function(mutations, observer) {
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
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.ComponentFactory = window.Proto.extend({
        init: function(target) {
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
            this.events.subscribe("nodeadded.mutation", this.build, {}, this);
        },
        build: function(name, el) {
            var Component;
            if (this.ignoreAtts.indexOf(name) !== -1) {
                return;
            }
            if (el.getAttribute("data-target-" + name + "-id") !== null) {
                return;
            }
            Component = this.target[name];
            this.topId++;
            this.components[this.topId] = Component.create(el, this.topId, this.target, name);
        },
        initComponent: function(name) {
            var _this = this;
            var Component = this.target[name];
            this.utils.forEach.call(_this.utils.qsa("[" + _this.config.attributes[name] + "]"), function(el, i) {
                _this.topId++;
                _this.components[_this.topId] = Component.create(el, _this.topId, _this.target, name);
            });
        },
        start: function() {
            var _this = this;
            this.componentClasses.forEach(function(name) {
                _this.initComponent(name);
            });
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.API = target.UI.extend({
        init: function(el, _id, target, name) {
            el = document.createElement("div");
            el.style.display = "none";
            this._super.apply(this, [ el, _id, target, name ]);
            this.target = target;
            this.target.show = this.showEls.bind(this);
            this.target.hide = this.hideEls.bind(this);
            this.target.get = this.get.bind(this);
            this.target.toggle = this.toggleEls.bind(this);
        },
        getEls: function(els) {
            if (typeof els === "string") {
                els = this.utils.qsa(els);
            } else if (els.length) {
                els = els;
            } else {
                els = [ els ];
            }
            return els;
        },
        get: function(els) {
            els = this.getEls(els);
            this.targets = els;
            return this;
        },
        showEls: function(els) {
            var _this = this;
            els = this.getEls(els);
            this.utils.forEach.call(els, function(el) {
                _this.show(el);
            });
        },
        hideEls: function(els) {
            var _this = this;
            els = this.getEls(els);
            this.utils.forEach.call(els, function(el) {
                _this.hide(el);
            });
        },
        toggleEls: function(els) {
            var _this = this;
            els = this.getEls(els);
            this.utils.forEach.call(els, function(el) {
                if (!el.classList.contains(_this.config.activeClass)) {
                    _this.show(el);
                } else {
                    _this.hide(el);
                }
            });
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Show = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Show)));
            this.addDomEventHandler("click", this.onClick);
        },
        onClick: function(e) {
            var _this = this;
            if (!this.isDisabled()) {
                if (this.NODE_NAME === "A") {
                    e.preventDefault();
                }
                this.utils.forEach.call(this.targets, function(target) {
                    _this.show(target);
                });
            }
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Hide = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Hide)));
            this.addDomEventHandler("click", this.onClick);
        },
        onClick: function(e) {
            var _this = this;
            if (!this.isDisabled()) {
                if (this.NODE_NAME === "A") {
                    e.preventDefault();
                }
                this.utils.forEach.call(this.targets, function(target) {
                    _this.hide(target);
                });
            }
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Toggle = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Toggle)));
            this.addDomEventHandler("click", this.onClick);
        },
        onClick: function(e) {
            var _this = this;
            if (!this.isDisabled()) {
                if (this.NODE_NAME === "A") {
                    e.preventDefault();
                }
                this.utils.forEach.call(this.targets, function(target) {
                    _this.toggle(target);
                });
            }
        },
        toggle: function(el) {
            if (!el.classList.contains(this.config.activeClass)) {
                this.show(el);
            } else {
                this.hide(el);
            }
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Clickoff = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.addDomEventHandler("click", this.onClick, document);
        },
        onClick: function(e) {
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
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Increment = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Increment)));
            this.setLimits();
            this.addDomEventHandler("click", this.onClick);
        },
        setLimits: function() {
            this.max = this.el.getAttribute(this.config.attributes.max);
            this.min = this.el.getAttribute(this.config.attributes.min);
            if (this.min === null) {
                this.min = 0;
            }
            if (this.max !== null) {
                this.max = parseInt(this.max, 10);
            }
        },
        increment: function(target) {
            var curVal = parseInt(target.value, 10);
            var val = curVal + 1;
            if (this.max !== null) {
                if (this.max >= val) {
                    this.events.publish("max", target);
                }
                val = Math.min(val, this.max);
            }
            target.value = val;
        },
        onClick: function(e) {
            var _this = this;
            if (!this.isDisabled()) {
                this.utils.forEach.call(this.targets, function(target) {
                    _this.increment(target);
                });
            }
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Decrement = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Decrement)));
            this.setLimits();
            this.addDomEventHandler("click", this.onClick);
        },
        setLimits: function() {
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
        },
        decrement: function(target) {
            var curVal = parseInt(target.value, 10);
            var val = curVal - 1;
            if (val <= this.min) {
                this.events.publish("min", target);
            }
            val = Math.max(val, this.min);
            target.value = val;
        },
        onClick: function(e) {
            var _this = this;
            if (!this.isDisabled()) {
                this.utils.forEach.call(this.targets, function(target) {
                    _this.decrement(target);
                });
            }
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Scrollbox = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.maxHeight = this.el.getAttribute(this.config.attributes.Scrollbox);
            this.maxHeight = parseInt(this.maxHeight, 10);
            if (this.el.hasChildNodes()) {
                this.children = this.el.childNodes;
            }
            this.addEventHandler("resize", this.onResize);
            this.events.publish("update");
        },
        getMaxHeight: function() {
            if (this.maxHeight >= 0) {
                return this.maxHeight;
            } else {
                return document.documentElement.clientHeight + this.maxHeight;
            }
        },
        getContentsHeight: function() {
            var height = 0;
            this.utils.forEach.call(this.children, function(child) {
                height += child.offsetHeight;
            });
            return height;
        },
        setOverflow: function() {
            if (this.getContentsHeight() > this.getMaxHeight() && !this.isDisabled()) {
                this.el.style.overflowY = "scroll";
            } else {
                this.el.style.overflowY = "auto";
            }
        },
        setMaxHeight: function() {
            if (this.isDisabled()) {
                this.el.style.maxHeight = "";
            } else {
                this.el.style.maxHeight = this.getMaxHeight() + "px";
            }
        },
        onResize: function() {
            this.setMaxHeight();
            this.setOverflow();
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Grid = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.TEXT_NODE = 3;
            this.COMMENT_NODE = 8;
            this.setChildren();
            this.setBreakpoints();
            this.addEventHandler("resize", this.gridOnResize);
            this.events.publish("update");
            this.addDomEventHandler("load", this.onLoad, window);
        },
        setBreakpoints: function() {
            var breakpoints = this.el.getAttribute(this.config.attributes.Grid).split(" ");
            var disableLayouts = [];
            var layouts = [ "mobile", "tablet", "desktop" ];
            breakpoints.forEach(function(breakpoint, i) {
                if (breakpoint === "disable") {
                    disableLayouts.push(layouts[i]);
                    breakpoint = 0;
                } else {
                    breakpoint = parseInt(breakpoint, 10);
                }
            });
            this.breakpoints = {
                mobile: breakpoints[0],
                tablet: breakpoints[1],
                desktop: breakpoints[2]
            };
            if (disableLayouts.length) {
                this.el.setAttribute(this.config.attributes.disable, disableLayouts.join(" "));
            }
        },
        onLoad: function(e) {
            this.removeDomEventHandler("load");
            this.events.publish("update");
        },
        setChildren: function() {
            var _this = this;
            var childNodes;
            this.children = [];
            if (!this.el.hasChildNodes()) {
                return [];
            }
            childNodes = this.el.childNodes;
            this.utils.forEach.call(childNodes, function(child) {
                if (child.nodeType !== _this.TEXT_NODE && child.nodeType !== _this.COMMENT_NODE) {
                    _this.children.push(child);
                }
            });
        },
        setPerRow: function(is) {
            var _this = this;
            this.perRow = this.breakpoints.mobile;
            Object.keys(this.breakpoints).forEach(function(layout) {
                if (_this.breakpoints[layout] && is[layout]()) {
                    _this.perRow = _this.breakpoints[layout];
                }
            });
            return _this.perRow;
        },
        buildRows: function() {
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
        },
        calculateGrid: function(is) {
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
        },
        resetGrid: function() {
            this.utils.forEach.call(this.children, function(child) {
                child.style.height = "";
            });
        },
        gridOnResize: function(is) {
            if (!this.isDisabled()) {
                this.calculateGrid(is);
            } else {
                this.resetGrid();
            }
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.Src = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.srcs = {
                mobile: "",
                tablet: "",
                desktop: ""
            };
            this.getSrcs();
            this.loaded = {
                mobile: false,
                tablet: false,
                desktop: false
            };
            this.addEventHandler("resize", this.onResize);
            this.events.publish("update");
        },
        getSrcs: function() {
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
        },
        onLoad: function() {
            this.events.publish("update");
            this.removeDomEventHandler("load");
        },
        load: function(img) {
            this.addDomEventHandler("load", this.onLoad, this.el);
        },
        onResize: function(is) {
            var _this = this;
            Object.keys(this.srcs).forEach(function(layout) {
                var img = _this.srcs[layout];
                if (is[layout]()) {
                    if (!_this.loaded[layout]) {
                        _this.loaded[layout] = img;
                        _this.load(img);
                    }
                    _this.el.src = img;
                }
            });
        }
    });
})(window.target = window.target || {});

(function(target, undefined) {
    "use strict";
    target.init = function(options) {
        target.utils.mixin(target.config, options);
        target.events = new window.Mediator();
        target.window = target.Window.create(target);
        target.domObserver = target.DomObserver.create(target);
        target.api = target.API.create(null, "target-api", target, "api");
        target.componentFactory = target.ComponentFactory.create(target);
        target.componentFactory.start();
    };
})(window.target = window.target || {});})();