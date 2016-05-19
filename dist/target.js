/**
 * target.config
 *
 * initial default settings
 *
 * can be overridden on initialization
 * `target.init(mySettingsObjectHere);`
 */
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

/**
 * target.UI
 *
 * Base class component object
 *
 * define default functionality that all UI elements will share
 */
(function(target, undefined) {
    "use strict";
    target.UI = window.Proto.extend({
        init: function(el, _id, target, name) {
            this.id = _id;
            this.componentType = name;
            // mixin shared target.js resources
            // now all inherited classes have easy access to these
            this.config = target.config;
            this.events = target.events;
            this.utils = target.utils;
            // element variables
            this.el = el;
            this.NODE_NAME = el.nodeName;
            this.disabled = false;
            // bind id
            this.el.setAttribute("data-target-" + name + "-id", this.id);
            // event handlers
            this.eventHandlers = {};
            this.addEventHandler("resize", this.setDisabled);
            this.addEventHandler("attributes.mutation", this.handleAttMutation);
            this.addEventHandler("show", this.onShow);
            this.addEventHandler("hide", this.onHide);
            // DOM event handlers
            this.domEventHandlers = {};
            // initialize
            this.updateAtts();
        },
        /**
		 * add an event handler to a UI element
		 * using Target's internal event buss
		 * store a reference to it for later removal
		 */
        addEventHandler: function(eventName, cb) {
            this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);
        },
        /**
		 * 
		 * attach a callback to a DOM event handler
		 * scope the callback to this object
		 * store for removal on destroy
		 *
		 */
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
        /**
		 * remove all events used by internal pub/sub
		 * remove all dom events
		 */
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
        /**
		 * when attributes are changed in the DOM
		 * the DOM observer watches and will run this callback
		 * ensure our element has been modified
		 * if so, update the component's properties
		 * based on the new attribute values
		 */
        handleAttMutation: function(target) {
            if (target === this.el) {
                this.updateAtts();
            }
        },
        /**
		 * get attributes on element
		 * set internal properties based on attributes
		 * these properties are used by other methods
		 */
        updateAtts: function() {
            this.disableLayouts = this.el.getAttribute(this.config.attributes.disable);
            if (this.disableLayouts) {
                this.disableLayouts = this.disableLayouts.split(" ");
            } else {
                this.disableLayouts = [];
            }
            // request layout from current window object
            this.events.publish("update");
        },
        /**
		 * on window.resize
		 * determine whether or not a component should be disabled
		 * if so, disable it
		 * if not, enable it
		 */
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
        /**
		 * get "disabled" property
		 */
        isDisabled: function() {
            return this.disabled;
        },
        /**
		 * show an element using css
		 * could be this UI element, could be another target
		 */
        show: function(el) {
            if (!el.classList.contains(this.config.activeClass)) {
                el.classList.add(this.config.activeClass);
                this.events.publish("show", el);
            }
        },
        /**
		 * hide an element using css
		 * could be this UI element, could be another target
		 */
        hide: function(el) {
            if (el.classList.contains(this.config.activeClass)) {
                el.classList.remove(this.config.activeClass);
                this.events.publish("hide", el);
            }
        },
        /**
		 * when a target element is shown,
		 * update this element's state
		 */
        onShow: function(el) {
            // some UI elements don't have targets
            if (this.targets && this.utils.contains(this.targets, el)) {
                this.show(this.el);
            }
        },
        /**
		 * when a target element is shown,
		 * update this element's state
		 */
        onHide: function(el) {
            // some UI elements don't have targets
            if (this.targets && this.utils.contains(this.targets, el)) {
                this.hide(this.el);
            }
        }
    });
})(window.target = window.target || {});

/**
 * target.utils
 *
 * utility methods for use throughout library
 */
(function(target, undefined) {
    "use strict";
    var config = target.config;
    target.utils = {
        /**
		 * _shallow_ mixins on objects
		 */
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
        /**
		 * use array.prototype.forEach on nodelists
		 */
        forEach: window.Array.prototype.forEach,
        /**
		 * convenience method for finding an element in a node list
		 */
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
        /**
		 * debounce function
		 * http://davidwalsh.name/javascript-debounce-function
		 */
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
        /**
		 * map values of object to array
		 */
        values: function(obj) {
            var array = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    array.push(obj[prop]);
                }
            }
            return array;
        },
        /**
		 * create shorter alias for QSA
		 */
        qsa: document.querySelectorAll.bind(document),
        /**
		 * strip brackets from attribute selectors
		 * for getting the actual attribute
		 * using element.getAttribute()
		 */
        stripBrackets: function(att) {
            return att.replace("[", "").replace("]", "");
        },
        /**
		 * capitalize first letter of string
		 */
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        /**
		 * check if child is descendent of parent
		 * http://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-contained-within-another
		 */
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
        /**
		 * for those special times
		 * when you just really wanna do nothing
		 */
        noop: function() {},
        /**
		 * for in loop
		 * check if object has prop
		 */
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

/**
 * target.API
 *
 * make programmatic methods accessible
 * to global object
 * in simplified api
 *
 * TODO: this needs to be refactored
 * instead of being tightly coupled to UI class
 * which does a lot of unrelated stuff we don't need here
 */
(function(target, undefined) {
    "use strict";
    target.API = target.UI.extend({
        init: function(el, _id, target, name) {
            el = document.createElement("div");
            el.style.display = "none";
            this._super.apply(this, [ el, _id, target, name ]);
            // apply convenience methods to global "target" object
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
        /**
		 * if the target is shown, hide it
		 * if the target is hidden, show it
		 * all using css
		 * also toggle state of toggle button itself
		 */
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

/**
 * target.ComponentFactory
 *
 * generates and manages components
 */
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
        /**
		 * create an element after a DOM mutation
		 * need to check if this element is already created
		 */
        build: function(name, el) {
            var Component;
            // don't initialise a component because of an att
            // we should ignore: (disable, min, max)
            if (this.ignoreAtts.indexOf(name) !== -1) {
                return;
            }
            // if the component is already initialised
            // on the element,
            // exit
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

/**
 * target.DomObserver
 *
 * watches DOM for changes
 * triggers events
 * to initialize, update, or destroy components
 */
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
            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            this.observer.observe(document.body, {
                subtree: true,
                childList: true,
                attributes: true,
                // return an array of only the attributes we use
                attributeFilter: target.utils.values(_this.config.attributes)
            });
        },
        /**
		 * when a node is added
		 * strip out text nodes
		 * then fire event
		 * for componentfactory service to pickup
		 * and initialize new components if required
		 */
        publishAddedNodes: function(nodes) {
            var _this = this;
            this.utils.forEach.call(nodes, function(node) {
                if (node.nodeType === _this.TEXT_NODE || node.nodeType === _this.COMMENT_NODE) {
                    return;
                }
                // parse attributes for target components
                _this.utils.forIn(_this.config.attributes, function(prop, obj) {
                    var attName = obj[prop];
                    if (node.getAttribute(attName)) {
                        _this.events.publish("nodeadded.mutation", prop, node);
                    }
                });
            });
        },
        /**
		 * when a DOM mutation happens
		 * determine the type of mutation
		 * and fire the appropriate event
		 */
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

/**
 * target.window
 *
 * store the window dimensions
 * as well as the current breakpoint
 * fires events on window.resize
 * allowing UI to update and enable/disable themselves
 * according to breakpoints
 */
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
            // "is" object
            // allows UI components to update their functionality
            // based on layout
            // usage:
            // if (is['mobile']())
            // or, dynamically, for example:
            // for (layout in this.layouts)
            //   if (is[layout]())
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
            // listen for when UI elements initialize or update
            // they will request layout data
            // pass to the via resize event
            this.events.subscribe("update", function() {
                _this.onResize();
            });
        },
        /**
		 * get width
		 */
        width: function() {
            return this.w;
        },
        /**
		 * get height
		 */
        height: function() {
            return this.h;
        },
        /**
		 * on window.resize
		 * update internal window properties
		 * fire event for UI components to update themselves
		 * pass "is" layout object for responsive changes
		 */
        onResize: function() {
            this.w = document.documentElement.clientWidth;
            this.h = document.documentElement.clientHeight;
            this.events.publish("resize", this.is);
        }
    });
})(window.target = window.target || {});

/**
 * target.Clickoff
 *
 * close an element by clicking away from it
 *
 * usage:
 *
 * `<a data-target-clickoff>Click away from this to close</a>`
 */
(function(target, undefined) {
    "use strict";
    target.Clickoff = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.addDomEventHandler("click", this.onClick, document);
        },
        /**
		 * when the user clicks anywhere in the document
		 * determine if the click came from outside this element
		 * if so, close this element
		 */
        onClick: function(e) {
            var _this = this;
            var hide = true;
            var showAtt;
            var toggleAtt;
            // return if disabled
            // or if element already hidden
            if (this.isDisabled() || !this.el.classList.contains(this.config.activeClass)) {
                return true;
            }
            // check event source
            // check if source is or is contained within clickoff element
            // also be sure to not conflict with other targets
            showAtt = e.srcElement.getAttribute(this.config.attributes.Show);
            toggleAtt = e.srcElement.getAttribute(this.config.attributes.Toggle);
            if (e.srcElement === this.el || this.utils.isDescendant(this.el, e.srcElement) || showAtt === "#" + this.el.id || showAtt === "." + this.el.className || toggleAtt === "#" + this.el.id || toggleAtt === "." + this.el.className) {
                hide = false;
            }
            // if so, close element
            if (hide && this.el.classList.contains(this.config.activeClass)) {
                this.hide(this.el);
            }
        }
    });
})(window.target = window.target || {});

/**
 * target.Decrement
 *
 * decrements the value of a target input
 *
 * usage:
 *
 * `<a data-target-decrement="#qty" data-target-min="0">-1 to #qty</a>`
 */
(function(target, undefined) {
    "use strict";
    target.Decrement = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Decrement)));
            this.setLimits();
            this.addDomEventHandler("click", this.onClick);
        },
        /**
		 * get min and max values
		 * declared on the element itself
		 * use defaults if not declared
		 */
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
        /**
		 * decrement the value of the target input
		 * only if higher than the specified minimum value
		 */
        decrement: function(target) {
            var curVal = parseInt(target.value, 10);
            var val = curVal - 1;
            if (val <= this.min) {
                this.events.publish("min", target);
            }
            val = Math.max(val, this.min);
            target.value = val;
        },
        /**
		 * when the decrementer is clicked,
		 * decrement the target input element
		 */
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

/**
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
 */
(function(target, undefined) {
    "use strict";
    target.Grid = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.TEXT_NODE = 3;
            this.COMMENT_NODE = 8;
            this.setChildren();
            this.setBreakpoints();
            this.addEventHandler("resize", this.onResize);
            this.events.publish("update");
            // since the grid usually contains images,
            // let's update the layout on window.load as well
            this.addDomEventHandler("load", this.onLoad, window);
        },
        /**
		 * set breakpoints
		 * this will determine how many items are in a row
		 * at various breakpoints (mobile, tablet, desktop)
		 * also, if the breakpoint is "disable", instead of an int,
		 * disable at that breakpoint
		 */
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
        /**
		 * find child nodes of element
		 * filter out any text nodes
		 */
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
        /**
		 * determine how many thumbnails per row
		 * based on responsive layout
		 * "is" object passed from our "window" service
		 * via events
		 */
        setPerRow: function(is) {
            var _this = this;
            // set default
            this.perRow = this.breakpoints.mobile;
            // update with relevant media query if applicable
            Object.keys(this.breakpoints).forEach(function(layout) {
                if (_this.breakpoints[layout] && is[layout]()) {
                    _this.perRow = _this.breakpoints[layout];
                }
            });
            return _this.perRow;
        },
        /**
		 * set which thumbnails are in a row together
		 * based on the number of thumbs per row
		 * which is based on the current responsive layout
		 */
        buildRows: function() {
            var _this = this;
            var lastChild = this.children[this.children.length - 1];
            var row = [];
            var i = 0;
            this.rows = [];
            // loop through children
            // and add element to row
            // or if row is full
            // add row to rows array
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
        /**
		 * on window.resize
		 * if enabled
		 * determine how many thumbs per row
		 * group those thumbs together in rows
		 * reset the height of thumbs to their default
		 * get, calculate, and set the correct height
		 * so thumbs in the same row have the same height
		 */
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
        /**
		 * on window.resize
		 * if disabled
		 * reset heights of all children
		 */
        resetGrid: function() {
            this.utils.forEach.call(this.children, function(child) {
                child.style.height = "";
            });
        },
        /**
		 * on window.resize
		 * either build grid
		 * or reset
		 * depending on if enabled or disabled
		 */
        onResize: function(is) {
            if (!this.isDisabled()) {
                this.calculateGrid(is);
            } else {
                this.resetGrid();
            }
        }
    });
})(window.target = window.target || {});

/**
 * target.Hide
 *
 * UI element that hides another element onclick
 *
 * usage:
 *
 * `<a data-target-hide="#my-target">Click to hide #my-target</a>`
 */
(function(target, undefined) {
    "use strict";
    target.Hide = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Hide)));
            this.addDomEventHandler("click", this.onClick);
        },
        /**
		 * when the element is clicked,
		 * hide the target element
		 * (using css)
		 */
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

/**
 * target.Increment
 *
 * UI element that increments the value of an input
 *
 * usage:
 *
 * `<a data-target-increment="#qty" data-target-max="99">+1 to #qty</a>`
 */
(function(target, undefined) {
    "use strict";
    target.Increment = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Increment)));
            this.setLimits();
            this.addDomEventHandler("click", this.onClick);
        },
        /**
		 * get min and max values
		 * declared on the element itself
		 * use defaults if not declared
		 */
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
        /**
		 * increment the value of the target input
		 * only if lower than the specified maximum value
		 */
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
        /**
		 * when the incrementer is clicked,
		 * increment the target input element
		 */
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

/**
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
        /**
		 * get the user-declared max height threshold
		 */
        getMaxHeight: function() {
            if (this.maxHeight >= 0) {
                return this.maxHeight;
            } else {
                return document.documentElement.clientHeight + this.maxHeight;
            }
        },
        /**
		 * get the total height of all the contents
		 * within our scrollbox element
		 */
        getContentsHeight: function() {
            var height = 0;
            this.utils.forEach.call(this.children, function(child) {
                height += child.offsetHeight;
            });
            return height;
        },
        /**
		 * determine if we need to add a scrollbar to our element
		 * if so, add it
		 * if not, remove it
		 */
        setOverflow: function() {
            if (this.getContentsHeight() > this.getMaxHeight() && !this.isDisabled()) {
                this.el.style.overflowY = "scroll";
            } else {
                this.el.style.overflowY = "auto";
            }
        },
        /**
		 * determine whether or not we need to set a maxHeight property
		 * on element
		 * if so, set it
		 * if not, remove it
		 */
        setMaxHeight: function() {
            if (this.isDisabled()) {
                this.el.style.maxHeight = "";
            } else {
                this.el.style.maxHeight = this.getMaxHeight() + "px";
            }
        },
        /**
		 * on window.resize
		 * determine if we need a max height on our element
		 * determine if we need a scrollbar on our element
		 * if so, set them
		 */
        onResize: function() {
            this.setMaxHeight();
            this.setOverflow();
        }
    });
})(window.target = window.target || {});

/**
 * target.Show
 *
 * UI element that shows another element onclick
 *
 * usage:
 *
 * `<a data-target-show="#show-this">Click to show #show-this</a>`
 */
(function(target, undefined) {
    "use strict";
    target.Show = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Show)));
            this.addDomEventHandler("click", this.onClick);
        },
        /**
		 * when the element is clicked,
		 * show the target element
		 * (using css)
		 */
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

/**
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
            // request an update from target.Window
            this.events.publish("update");
        },
        /**
		 * get list of image urls from element attribute
		 * loop through and assign each image to a layout
		 * make mobile-first,
		 * so that if a layout doesn't have an image explicity assigned
		 * it will inherit the image from the next layout down
		 *
		 * ex. if only two images defined, desktop layout can inherit image from tablet layout
		 */
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
        /**
		 * once image is loaded,
		 * request a layout update
		 * and remove event handler
		 */
        onLoad: function() {
            this.removeDomEventHandler("load");
            this.events.publish("update");
        },
        /**
		 * add event handler to load image
		 */
        load: function(img) {
            this.addDomEventHandler("load", this.onLoad, this.el);
        },
        /**
		 * when the window is resized,
		 * check which layout we're currently at
		 * and load the appropriate image
		 */
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

/**
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
(function(target, undefined) {
    "use strict";
    target.Toggle = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Toggle)));
            this.addDomEventHandler("click", this.onClick);
        },
        /**
		 * when the element is clicked
		 * toggle the target element's visibility
		 */
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
        /**
		 * if the target is shown, hide it
		 * if the target is hidden, show it
		 * all using css
		 * also toggle state of toggle button itself
		 */
        toggle: function(el) {
            if (!el.classList.contains(this.config.activeClass)) {
                this.show(el);
            } else {
                this.hide(el);
            }
        }
    });
})(window.target = window.target || {});

/**
 *
 * target.init
 *
 * override default settings (if specified)
 * initialize all components on doc.ready
 *
 */
(function(target, undefined) {
    "use strict";
    target.init = function(options) {
        // override defaults with user settings
        target.utils.mixin(target.config, options);
        // init services
        target.events = new window.Mediator();
        target.window = target.Window.create(target);
        target.domObserver = target.DomObserver.create(target);
        target.api = target.API.create(null, "target-api", target, "api");
        // init components
        target.componentFactory = target.ComponentFactory.create(target);
        target.componentFactory.start();
    };
})(window.target = window.target || {});