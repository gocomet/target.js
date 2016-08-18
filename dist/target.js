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
            Filetext: "data-target-filetext",
            Accordion: "data-target-accordion",
            Scroll: "data-target-scroll",
            disable: "data-target-disable",
            max: "data-target-max",
            min: "data-target-min"
        },
        breakpoints: {
            tablet: 768,
            desktop: 1025
        },
        observeDom: false,
        debounceDelay: 100
    };
})(window.target = window.target || {});

/**
 * target.utils
 *
 * utility methods for use throughout library
 */
(function(target, undefined) {
    "use strict";
    target.utils = {
        /**
		 * shallow-ish mixins on objects
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
        },
        render: function() {
            if (window.requestAnimationFrame) {
                return function(cb) {
                    window.requestAnimationFrame(function() {
                        cb();
                    });
                };
            } else {
                return function(cb) {
                    cb();
                };
            }
        }()
    };
})(window.target = window.target || {});

/**
 * target.queue
 *
 * queue functionality can be added to UI components
 */
(function(target, undefined) {
    "use strict";
    target.Queue = window.Proto.extend({
        init: function() {
            this.items = [];
        },
        push: function(cb) {
            this.items.push(cb);
        },
        next: function() {
            var cb;
            if (this.items.length) {
                cb = this.items.shift();
                cb();
            }
        }
    });
})(window.target = window.target || {});

/**
 * target.UI
 *
 * Base class component object
 *
 * define default functionality that all UI components will share
 */
(function(target, undefined) {
    "use strict";
    //
    // TODO: add queue functionality
    //
    target.UI = window.Proto.extend({
        init: function(el, _id, target, name) {
            var _this = this;
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
            if (this.config.observeDom) {
                this.addEventHandler("attributes.mutation", this.handleAttMutation);
            }
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
		 * scope callback to this object
		 * store for removal by this.destroy
		 */
        addEventHandler: function(eventName, cb) {
            this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);
        },
        /**
		 * attach a callback to a DOM event handler
		 * scope the callback to this object
		 * store for removal by this.destroy
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
            var _this = this;
            this.utils.forIn(this.eventHandlers, function(handler) {
                _this.removeEventHandler(handler);
            });
            this.utils.forIn(this.domEventHandlers, function(domHandler) {
                _this.removeEventHandler(domHandler);
            });
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
            this.events.publish("update", this.id);
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
                if (is[layout]() && !this.overrideLayouts) {
                    disable = true;
                    this.disable(true);
                    break;
                }
            }
            if (!disable && !this.overrideLayouts) {
                this.enable(true);
            }
        },
        /**
		 * get "disabled" property
		 */
        isDisabled: function() {
            return this.disabled;
        },
        /**
		 * set "disabled" property to true
		 * deactivates element
		 * when called via api, no arg passed
		 * therefore override
		 * so that windoe resizing doesn't
		 * override enabled/disabled state
		 * when set via api
		 */
        disable: function(doNotOverride) {
            this.overrideLayouts = !doNotOverride;
            this.disabled = true;
            return this;
        },
        /**
		 * set "disabled" property to false
		 * activates element
		 * when called via api, no arg passed
		 * therefore override
		 * so that windoe resizing doesn't
		 * override enabled/disabled state
		 * when set via api
		 */
        enable: function(doNotOverride) {
            this.overrideLayouts = !doNotOverride;
            this.disabled = false;
            return this;
        },
        /**
		 * show an element using css
		 * could be this UI element, could be another target
		 */
        show: function(el) {
            var _this = this;
            if (!el.classList.contains(this.config.activeClass)) {
                this.utils.render(function() {
                    el.classList.add(_this.config.activeClass);
                    _this.events.publish("show", el);
                });
            }
        },
        /**
		 * hide an element using css
		 * could be this UI element, could be another target
		 */
        hide: function(el) {
            var _this = this;
            if (el.classList.contains(this.config.activeClass)) {
                this.utils.render(function() {
                    el.classList.remove(_this.config.activeClass);
                    _this.events.publish("hide", el);
                });
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
 * target.API
 *
 * make programmatic methods accessible
 * in simplified api
 * mix public methods back into global "target" object
 */
(function(target, undefined) {
    "use strict";
    target.API = window.Proto.extend({
        init: function(target) {
            var _this = this;
            this.utils = target.utils;
            this.events = target.events;
            this.componentFactory = target.componentFactory;
            this.eventHandlers = {};
            // mixin public methods into global target object
            [ "get", "on", "off", "show", "hide", "toggle", "bind" ].forEach(function(method) {
                target[method] = _this[method].bind(_this);
            });
        },
        /**
		 * normalize
		 * return one element
		 * to search for component
		 */
        normalize: function(el) {
            if (typeof el === "string") {
                el = this.utils.qs(el);
            }
            return el;
        },
        /**
		 * normalize els
		 * return Array or NodeList
		 * of elements
		 * (to be used as targets)
		 */
        normalizeEls: function(els) {
            if (typeof els === "string") {
                els = this.utils.qsa(els);
            } else if (els.length) {
                els = els;
            } else {
                els = [ els ];
            }
            return els;
        },
        /**
		 * get component by element
		 * accepts only one DOM element
		 * or css selector to return only one DOM element
		 */
        get: function(el) {
            var component;
            el = this.normalize(el);
            component = this.componentFactory.find(el);
            if (!component) {
                throw "Target.js Error at target.api.get(): " + el.toString() + " is not a Target.js element.";
            }
            return component;
        },
        /**
		 * show a target (or targets) programmatically
		 */
        show: function(els) {
            var component = this.componentFactory.use("Show", this.normalizeEls(els));
            this.utils.forEach.call(component.targets, function(target) {
                component.show(target);
            });
            return this;
        },
        /**
		 * hide a target (or targets) programmatically
		 */
        hide: function(els) {
            var component = this.componentFactory.use("Hide", this.normalizeEls(els));
            this.utils.forEach.call(component.targets, function(target) {
                component.hide(target);
            });
            return this;
        },
        /**
		 * toggle a target (or targets) programmatically
		 */
        toggle: function(els) {
            var component = this.componentFactory.use("Toggle", this.normalizeEls(els));
            this.utils.forEach.call(component.targets, function(target) {
                component.toggle(target);
            });
            return this;
        },
        /**
		 * add event handler meant for our window service
		 * (resize, mobile, tablet, desktop)
		 */
        onWindowEvent: function(eventName, cb) {
            if (!this.eventHandlers[eventName]) {
                this.eventHandlers[eventName] = [];
            }
            this.eventHandlers[eventName].push({
                cb: cb,
                event: this.events.subscribe(eventName, cb)
            });
            return this;
        },
        /**
		 * remove event handler for our window service
		 */
        offWindowEvent: function(eventName, cb) {
            var _this = this;
            var handlersCopy = [];
            this.eventHandlers[eventName].forEach(function(handler) {
                if (handler.cb !== cb) {
                    handlersCopy.push(handler);
                } else {
                    _this.events.remove(eventName, handler.event.id);
                }
            });
            this.eventHandlers[eventName] = handlersCopy;
            return this;
        },
        /**
		 * add event handler for Target component events
		 */
        onElEvent: function(eventName, els, cb) {
            var _this = this;
            els = this.normalizeEls(els);
            if (!this.eventHandlers[eventName]) {
                this.eventHandlers[eventName] = [];
            }
            this.utils.forEach.call(els, function(el) {
                // will return object containing id for removal
                _this.eventHandlers[eventName].push({
                    cb: cb,
                    el: el,
                    event: _this.events.subscribe(eventName, function(el) {
                        return function(evEl) {
                            if (evEl === el) {
                                cb(el);
                            }
                        };
                    }(el))
                });
            });
            return this;
        },
        /**
		 * remove event handler for Target events
		 */
        offElEvent: function(eventName, els, cb) {
            var _this = this;
            var handlersCopy = [];
            els = this.normalizeEls(els);
            this.eventHandlers[eventName].forEach(function(handler) {
                if (_this.utils.contains(els, handler.el) && cb === cb) {
                    _this.events.remove(eventName, handler.event.id);
                } else {
                    handlersCopy.push(handler);
                }
            });
            this.eventHandlers[eventName] = handlersCopy;
            return this;
        },
        /**
		 * normalize on handler
		 * (facade pattern)
		 * allow user to just call the .on method
		 * internally figure out which type of event we should bind
		 * because we could be binding to component events or our window service events
		 */
        on: function(eventName, arg2, arg3) {
            if (typeof arg2 === "function") {
                this.onWindowEvent(eventName, arg2);
            } else {
                this.onElEvent(eventName, arg2, arg3);
            }
            return this;
        },
        /**
		 * facade for removing event handlers
		 */
        off: function(eventName, arg2, arg3) {
            if (typeof arg2 === "function") {
                this.offWindowEvent(eventName, arg2);
            } else {
                this.offElEvent(eventName, arg2, arg3);
            }
            return this;
        },
        /**
		 * bind target to an element/document fragment
		 *
		 * search within the element
		 * and initialize any components
		 * declared on elements within
		 *
		 * useful for binding to elements after being rendered dynamically
		 */
        bind: function(el) {
            el = this.normalize(el);
            this.componentFactory.start(el);
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
            this.IGNORE_ATTS = [ "disable", "min", "max" ];
            this.COMPONENT_CLASSES = attsArray.filter(function(val) {
                return this.IGNORE_ATTS.indexOf(val) === -1;
            }, this);
            if (this.config.observeDom) {
                this.events.subscribe("nodeadded.mutation", this.build, {}, this);
            }
        },
        /**
		 * create an element after a DOM mutation
		 * need to check if this element is already created
		 */
        build: function(name, el) {
            var Component;
            // don't initialise a component because of an att
            // we should ignore: (disable, min, max)
            if (this.IGNORE_ATTS.indexOf(name) !== -1) {
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
        /**
		 * initComponent
		 * by name
		 * for each Target element that currently exists
		 * in DOM
		 * if scope is used, only get elements contained within scope
		 */
        initComponent: function(name, scope) {
            var _this = this;
            var Component = this.target[name];
            var selector = "[" + _this.config.attributes[name] + "]";
            var elList;
            if (scope) {
                elList = scope.querySelectorAll(selector);
            } else {
                elList = _this.utils.qsa(selector);
            }
            this.utils.forEach.call(elList, function(el, i) {
                _this.topId++;
                _this.components[_this.topId] = Component.create(el, _this.topId, _this.target, name);
            });
        },
        /**
		 * find component by DOM element
		 * used by Target.API
		 */
        find: function(el) {
            var _this = this;
            var component = false;
            this.utils.forIn(this.components, function(id, components) {
                if (components[id].el === el) {
                    component = components[id];
                }
            });
            return component;
        },
        /**
		 * get component by ID
		 * used by target.API
		 */
        get: function(id) {
            return this.components[id];
        },
        /**
		 * component for one-time use
		 * used by API
		 */
        use: function(name, targets) {
            var el = document.createElement("div");
            var Component = this.target[name];
            var component = Component.create(el, "tmp", this.target, name);
            component.targets = targets;
            return component;
        },
        /**
		 * start function run manually
		 * after object instantiation
		 */
        start: function(scope) {
            var _this = this;
            this.COMPONENT_CLASSES.forEach(function(name) {
                _this.initComponent(name, scope);
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
            window.addEventListener("scroll", function(e) {
                _this.onScroll();
            });
            // on browser load,
            // run another update
            // to ensure all our scrolling stuff is calculating correctly
            // after images have been loaded
            window.addEventListener("load", function() {
                _this.onResize();
            });
            // listen for when UI elements initialize or update
            // they will request layout data
            // pass to the via resize event
            this.currentLayout = "";
            this.events.subscribe("update", function(componentID) {
                _this.update(componentID);
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
		 * on window.scroll
		 * get scroll top and pass on
		 */
        onScroll: function(e) {
            this.events.publish("scroll", window.pageYOffset);
        },
        /**
		 * on window.resize
		 * update internal window properties
		 * update application
		 */
        onResize: function() {
            this.w = document.documentElement.clientWidth;
            this.h = document.documentElement.clientHeight;
            this.update();
        },
        /**
		 * update
		 * fire event for UI components to update themselves
		 * pass "is" layout object for responsive changes
		 */
        update: function(componentID) {
            var newLayout = "";
            if (!componentID) {
                componentID = "";
            }
            this.utils.forIn(this.is, function(layout, is) {
                if (is[layout]()) {
                    newLayout = layout;
                }
            });
            this.currentLayout = newLayout;
            this.events.publish("resize" + componentID, this.is, this.width(), this.height());
            if (newLayout !== this.currentLayout) {
                this.events.publish(newLayout, this.width(), this.height());
            }
        }
    });
})(window.target = window.target || {});

/**
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
(function(target, undefined) {
    "use strict";
    target.Accordion = target.UI.extend({
        init: function(el, _id, target, name) {
            var _this = this;
            this._super.apply(this, arguments);
            this.setArgs();
            this.setToggles();
            this.setContents();
            if (this.toggles.length !== this.contents.length) {
                throw "Target.js Error on Accordion component: component must contain an equal number of toggles and contents";
            }
            this.current = null;
            this.utils.forEach.call(this.toggles, function(toggle, i) {
                _this.addDomEventHandler("click", _this.toggle(toggle, i), toggle);
            });
        },
        setArgs: function() {
            var args = this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Accordion));
            args = args.split(",");
            this.args = args;
            if (this.args.length !== 2) {
                throw 'Target.js Error on Accordion component: the value of "' + this.utils.stripBrackets(this.config.attributes.Accordion) + '" must contain two comma-separated CSS selectors';
            }
            return this.args;
        },
        setToggles: function() {
            // TODO: scope selection to parent element
            this.toggles = this.utils.qsa(this.args[0]);
            return this.toggles;
        },
        setContents: function() {
            // TODO: scope selection to parent element
            this.contents = this.utils.qsa(this.args[1]);
            return this.contents;
        },
        toggle: function(toggle, i) {
            return function(e) {
                var _this = this;
                if (this.isDisabled()) {
                    return;
                }
                if (toggle.nodeType === "A") {
                    e.preventDefault();
                }
                if (this.current === i) {
                    this.current = null;
                    this.hide(this.toggles[i]);
                    this.hide(this.contents[i]);
                } else {
                    this.current = i;
                    this.utils.forEach.call(this.contents, function(content, i) {
                        _this.hide(_this.toggles[i]);
                        _this.hide(content);
                    });
                    this.show(this.toggles[i]);
                    this.show(this.contents[i]);
                }
            };
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
            var _this = this;
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Decrement)));
            this.utils.forEach.call(this.targets, function(target) {
                if (target.nodeName !== "INPUT") {
                    throw 'Target.js Error on Decrement component: the selector in "' + _this.utils.stripBrackets(_this.config.attributes.Decrement) + '" must target an <input> element';
                }
            });
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
 * target.Filetext
 *
 * gives you the text of a file input
 * allows you to style file inputs any way you like
 *
 * usage:
 *
 * `<input type="file" data-target-filetext="#my-filetext-element" />`
 */
(function(target, undefined) {
    "use strict";
    target.Filetext = target.UI.extend({
        init: function(el, _id, target, name) {
            var inputType;
            this._super.apply(this, arguments);
            if (this.NODE_NAME !== "INPUT" || this.el.getAttribute("type") !== "file") {
                throw 'Error on Target.Filetext component: "' + this.utils.stripBrackets(this.config.attributes.Filetext) + '" must be applied to an <input> element with \'type="file"\'';
            }
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Filetext)));
            this.addDomEventHandler("change", this.onChange);
        },
        /**
		 * when the file input is changed
		 * get filename
		 * and set as text of target element
		 */
        onChange: function(e) {
            var _this = this;
            var filename = this.el.files && this.el.files[0];
            if (!this.isDisabled()) {
                if (this.el.files.length) {
                    filename = this.el.files[0].name;
                    this.utils.forEach.call(this.targets, function(target) {
                        target.innerHTML = filename;
                    });
                }
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
            this.published = false;
            this.setChildren();
            this.setBreakpoints();
            this.addEventHandler("resize", this.onResize);
            this.addEventHandler("resize" + this.id, this.onResize);
            this.events.publish("update", this.id);
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
            this.events.publish("update", this.id);
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
            // TODO: update application after we change the page layout
            // // if we're responding to our own resize event,
            // // ignore and reset flag
            // if (this.published === true) {
            // 	this.published = false;
            // 	return;
            // }
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
            var _this = this;
            this._super.apply(this, arguments);
            this.targets = this.utils.qsa(this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Increment)));
            this.utils.forEach.call(this.targets, function(target) {
                if (target.nodeName !== "INPUT") {
                    throw 'Target.js Error on Increment component: the selector in "' + _this.utils.stripBrackets(_this.config.attributes.Increment) + '" must target an <input> element';
                }
            });
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
 * target.Scroll
 *
 * show an element when it scrolls into view
 *
 * calculate an offset on the element by the attribute value, if it exists
 */
(function(target, undefined) {
    "use strict";
    var PAGE_FACTOR = .2;
    target.Scroll = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            this.getOffset();
            this.addEventHandler("resize", this.onResize);
            this.addEventHandler("resize" + this.id, this.onResize);
            this.addEventHandler("scroll", this.onScroll);
            this.events.publish("update", this.id);
        },
        getOffset: function() {
            this.offset = this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Scroll));
            if (this.offset) {
                this.offset = parseInt(this.offset, 10);
            } else {
                this.offset = 0;
            }
            this.top = 0;
        },
        calculateThreshold: function(h) {
            var rect = this.el.getBoundingClientRect();
            this.threshold = rect.top + this.top - h * (1 - PAGE_FACTOR);
        },
        onScroll: function(top) {
            this.top = top;
            // if we're past threshold,
            // or at bottom of document
            // show el
            if (this.top >= this.threshold + this.offset || this.top >= this.docH - this.windowH) {
                this.show(this.el);
            } else {
                this.hide(this.el);
            }
        },
        getDocHeight: function() {
            var body = document.body;
            var html = document.documentElement;
            var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            return height;
        },
        /**
		 * on window.resize
		 * calculate or recalculate
		 * when our element should be shown or hidden
		 */
        onResize: function(is, w, h) {
            this.docH = this.getDocHeight();
            this.windowH = h;
            this.calculateThreshold(h);
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
            this.addEventHandler("resize" + this.id, this.onResize);
            this.events.publish("update", this.id);
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
    // utility object for tracking which images are already cached
    // track localStorage to prevent bug
    // in which an image stored in cache
    // would not be loaded
    // because target will try to load it and wait for onload event
    // but browser will not load cached images
    var CACHE_NAME = "targetJsImgsLoaded";
    var imageCache = {
        contains: function(item) {
            return this.images.indexOf(item) !== -1;
        },
        add: function(item) {
            this.images += item;
            if (localStorage) {
                localStorage[CACHE_NAME] = this.images;
            }
        },
        init: function() {
            if (localStorage && localStorage[CACHE_NAME]) {
                this.images = localStorage[CACHE_NAME];
            } else {
                this.images = "";
            }
        }
    };
    imageCache.init();
    var img = document.createElement("img");
    target.Src = target.UI.extend({
        init: function(el, _id, target, name) {
            this._super.apply(this, arguments);
            if (this.NODE_NAME !== "IMG" && this.NODE_NAME !== "DIV") {
                throw 'Target.js Error on Src component: "' + this.utils.stripBrackets(this.config.attributes.Src) + '" must be applied to an <img> or <div> element';
            }
            this.published = false;
            this.img = img;
            // TODO: only load when in view
            // this.inview = false;
            // this.queue = target.Queue.create();
            this.getSrcs();
            this.imageCache = imageCache;
            this.addEventHandler("resize", this.onResize);
            this.addEventHandler("resize" + this.id, this.onResize);
            // TODO: only load when in view
            //this.addEventHandler('scroll', this.onScroll);
            // request an update from target.Window
            this.events.publish("update", this.id);
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
            this.srcs = {
                mobile: "",
                tablet: "",
                desktop: ""
            };
            this.currentSrc = "";
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
        showImage: function(src) {
            var _this = this;
            this.currentSrc = src;
            if (this.NODE_NAME === "IMG") {
                this.el.src = src;
            } else if (this.NODE_NAME === "DIV") {
                this.el.style.backgroundImage = 'url("' + src + '")';
                // wait for next repaint frame _after_ new src is painted
                // TODO:
                // this will still have animation problems
                // if we're transitioning the hide method,
                // then the transition will still be happening
                // when the show method is applied
                this.utils.render(function() {
                    _this.show(_this.el);
                });
            }
        },
        /**
		 * once image is loaded
		 * remove event handler
		 * if this is an <img>
		 * in a grid, request a layout update
		 */
        onLoad: function() {
            if (this.domEventHandlers.load) {
                this.removeDomEventHandler("load");
            }
            this.imageCache.add(this.loadingImg);
            this.showImage(this.loadingImg);
        },
        /**
		 * add event handler to load image
		 */
        load: function(src) {
            this.loadingImg = src;
            this.addDomEventHandler("load", this.onLoad, this.img);
            this.img.src = src;
        },
        /**
		 * when the window is resized,
		 * check which layout we're currently at
		 * and load the appropriate image
		 */
        onResize: function(is, w, h) {
            var _this = this;
            // TODO: only load when in view
            // this.calculateThreshold(h);
            // if (this.threshold < h) {
            // 	this.inview = true;
            // 	this.queue.next();
            // }
            Object.keys(this.srcs).forEach(function(layout) {
                var src = _this.srcs[layout];
                //
                // TODO: damn, clean this up
                // 
                if (is[layout]() && src !== _this.currentSrc) {
                    if (!_this.imageCache.contains(src)) {
                        if (_this.NODE_NAME === "DIV") {
                            _this.hide(_this.el);
                        }
                        _this.load(src);
                    } else {
                        _this.showImage(src);
                    }
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
 * target.init
 *
 * override default settings (if specified)
 * initialize all services
 * initialize all components that exist on page
 */
(function(target, undefined) {
    "use strict";
    target.init = function(options) {
        // override defaults with user settings
        target.utils.mixin(target.config, options);
        // init services
        target.events = new window.Mediator();
        target.window = target.Window.create(target);
        // for performance's sake, only observe dom if required
        if (target.config.observeDom) {
            target.domObserver = target.DomObserver.create(target);
        }
        target.componentFactory = target.ComponentFactory.create(target);
        target.api = target.API.create(target);
        // init components
        target.componentFactory.start();
    };
})(window.target = window.target || {});