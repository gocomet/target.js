/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
if (typeof WeakMap === "undefined") {
    (function() {
        var defineProperty = Object.defineProperty;
        var counter = Date.now() % 1e9;
        var WeakMap = function() {
            this.name = "__st" + (Math.random() * 1e9 >>> 0) + (counter++ + "__");
        };
        WeakMap.prototype = {
            set: function(key, value) {
                var entry = key[this.name];
                if (entry && entry[0] === key) entry[1] = value; else defineProperty(key, this.name, {
                    value: [ key, value ],
                    writable: true
                });
                return this;
            },
            get: function(key) {
                var entry;
                return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined;
            },
            "delete": function(key) {
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
        window.WeakMap = WeakMap;
    })();
}

/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is goverened by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(global) {
    var registrationsTable = new WeakMap();
    // We use setImmediate or postMessage for our future callback.
    var setImmediate = window.msSetImmediate;
    // Use post message to emulate setImmediate.
    if (!setImmediate) {
        var setImmediateQueue = [];
        var sentinel = String(Math.random());
        window.addEventListener("message", function(e) {
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
            window.postMessage(sentinel, "*");
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
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(node) || node;
    }
    function dispatchCallbacks() {
        // http://dom.spec.whatwg.org/#mutation-observers
        isScheduled = false;
        // Used to allow a new setImmediate call above.
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
        if (anyNonEmpty) dispatchCallbacks();
    }
    function removeTransientObserversFor(observer) {
        observer.nodes_.forEach(function(node) {
            var registrations = registrationsTable.get(node);
            if (!registrations) return;
            registrations.forEach(function(registration) {
                if (registration.observer === observer) registration.removeTransientObservers();
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
                    if (node !== target && !options.subtree) continue;
                    var record = callback(options);
                    if (record) registration.enqueue(record);
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
            if (!options.childList && !options.attributes && !options.characterData || // 1.2
            options.attributeOldValue && !options.attributes || // 1.3
            options.attributeFilter && options.attributeFilter.length && !options.attributes || // 1.4
            options.characterDataOldValue && !options.characterData) {
                throw new SyntaxError();
            }
            var registrations = registrationsTable.get(target);
            if (!registrations) registrationsTable.set(target, registrations = []);
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
    }
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
        if (recordWithOldValue) return recordWithOldValue;
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
        if (lastRecord === newRecord) return lastRecord;
        // Check if the the record we are adding represents the same record. If
        // so, we keep the one with the oldValue in it.
        if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord)) return recordWithOldValue;
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
            if (options.attributes) node.addEventListener("DOMAttrModified", this, true);
            if (options.characterData) node.addEventListener("DOMCharacterDataModified", this, true);
            if (options.childList) node.addEventListener("DOMNodeInserted", this, true);
            if (options.childList || options.subtree) node.addEventListener("DOMNodeRemoved", this, true);
        },
        removeListeners: function() {
            this.removeListeners_(this.target);
        },
        removeListeners_: function(node) {
            var options = this.options;
            if (options.attributes) node.removeEventListener("DOMAttrModified", this, true);
            if (options.characterData) node.removeEventListener("DOMCharacterDataModified", this, true);
            if (options.childList) node.removeEventListener("DOMNodeInserted", this, true);
            if (options.childList || options.subtree) node.removeEventListener("DOMNodeRemoved", this, true);
        },
        /**
     * Adds a transient observer on node. The transient observer gets removed
     * next time we deliver the change records.
     * @param {Node} node
     */
        addTransientObserver: function(node) {
            // Don't add transient observers on the target itself. We already have all
            // the required listeners set up on the target.
            if (node === this.target) return;
            this.addListeners_(node);
            this.transientObservedNodes.push(node);
            var registrations = registrationsTable.get(node);
            if (!registrations) registrationsTable.set(node, registrations = []);
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
              case "DOMAttrModified":
                // http://dom.spec.whatwg.org/#concept-mo-queue-attributes
                var name = e.attrName;
                var namespace = e.relatedNode.namespaceURI;
                var target = e.target;
                // 1.
                var record = new getRecord("attributes", target);
                record.attributeName = name;
                record.attributeNamespace = namespace;
                // 2.
                var oldValue = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                    // 3.1, 4.2
                    if (!options.attributes) return;
                    // 3.2, 4.3
                    if (options.attributeFilter && options.attributeFilter.length && options.attributeFilter.indexOf(name) === -1 && options.attributeFilter.indexOf(namespace) === -1) {
                        return;
                    }
                    // 3.3, 4.4
                    if (options.attributeOldValue) return getRecordWithOldValue(oldValue);
                    // 3.4, 4.5
                    return record;
                });
                break;

              case "DOMCharacterDataModified":
                // http://dom.spec.whatwg.org/#concept-mo-queue-characterdata
                var target = e.target;
                // 1.
                var record = getRecord("characterData", target);
                // 2.
                var oldValue = e.prevValue;
                forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                    // 3.1, 4.2
                    if (!options.characterData) return;
                    // 3.2, 4.3
                    if (options.characterDataOldValue) return getRecordWithOldValue(oldValue);
                    // 3.3, 4.4
                    return record;
                });
                break;

              case "DOMNodeRemoved":
                this.addTransientObserver(e.target);

              // Fall through.
                case "DOMNodeInserted":
                // http://dom.spec.whatwg.org/#concept-mo-queue-childlist
                var target = e.relatedNode;
                var changedNode = e.target;
                var addedNodes, removedNodes;
                if (e.type === "DOMNodeInserted") {
                    addedNodes = [ changedNode ];
                    removedNodes = [];
                } else {
                    addedNodes = [];
                    removedNodes = [ changedNode ];
                }
                var previousSibling = changedNode.previousSibling;
                var nextSibling = changedNode.nextSibling;
                // 1.
                var record = getRecord("childList", target);
                record.addedNodes = addedNodes;
                record.removedNodes = removedNodes;
                record.previousSibling = previousSibling;
                record.nextSibling = nextSibling;
                forEachAncestorAndObserverEnqueueRecord(target, function(options) {
                    // 2.1, 3.2
                    if (!options.childList) return;
                    // 2.2, 3.3
                    return record;
                });
            }
            clearRecords();
        }
    };
    global.JsMutationObserver = JsMutationObserver;
    if (!global.MutationObserver) global.MutationObserver = JsMutationObserver;
})(this);

/*! uberproto - v1.2.0 - 2015-11-29
* http://daffl.github.com/uberproto
* Copyright (c) 2015 ; Licensed MIT */
/**
 * A base object for ECMAScript 5 style prototypal inheritance.
 *
 * @see https://github.com/rauschma/proto-js/
 * @see http://ejohn.org/blog/simple-javascript-inheritance/
 * @see http://uxebu.com/blog/2011/02/23/object-based-inheritance-for-ecmascript-5/
 */
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.Proto = factory();
    }
})(this, function() {
    function makeSuper(_super, old, name, fn) {
        return function() {
            var tmp = this._super;
            // Add a new ._super() method that is the same method
            // but either pointing to the prototype method
            // or to the overwritten method
            this._super = typeof old === "function" ? old : _super[name];
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
        };
    }
    function legacyMixin(prop, obj) {
        var self = obj || this;
        var fnTest = /\b_super\b/;
        var _super = Object.getPrototypeOf(self) || self.prototype;
        var _old;
        // Copy the properties over
        for (var name in prop) {
            // store the old function which would be overwritten
            _old = self[name];
            // Check if we're overwriting an existing function
            if ((typeof prop[name] === "function" && typeof _super[name] === "function" || typeof _old === "function" && typeof prop[name] === "function") && fnTest.test(prop[name])) {
                self[name] = makeSuper(_super, _old, name, prop[name]);
            } else {
                self[name] = prop[name];
            }
        }
        return self;
    }
    function es5Mixin(prop, obj) {
        var self = obj || this;
        var fnTest = /\b_super\b/;
        var _super = Object.getPrototypeOf(self) || self.prototype;
        var descriptors = {};
        var proto = prop;
        var processProperty = function(name) {
            if (!descriptors[name]) {
                descriptors[name] = Object.getOwnPropertyDescriptor(proto, name);
            }
        };
        // Collect all property descriptors
        do {
            Object.getOwnPropertyNames(proto).forEach(processProperty);
        } while ((proto = Object.getPrototypeOf(proto)) && Object.getPrototypeOf(proto));
        Object.keys(descriptors).forEach(function(name) {
            var descriptor = descriptors[name];
            if (typeof descriptor.value === "function" && fnTest.test(descriptor.value)) {
                descriptor.value = makeSuper(_super, self[name], name, descriptor.value);
            }
            Object.defineProperty(self, name, descriptor);
        });
        return self;
    }
    return {
        /**
		 * Create a new object using Object.create. The arguments will be
		 * passed to the new instances init method or to a method name set in
		 * __init.
		 */
        create: function() {
            var instance = Object.create(this);
            var init = typeof instance.__init === "string" ? instance.__init : "init";
            if (typeof instance[init] === "function") {
                instance[init].apply(instance, arguments);
            }
            return instance;
        },
        /**
		 * Mixin a given set of properties
		 * @param prop The properties to mix in
		 * @param obj [optional] The object to add the mixin
		 */
        mixin: typeof Object.defineProperty === "function" ? es5Mixin : legacyMixin,
        /**
		 * Extend the current or a given object with the given property
		 * and return the extended object.
		 * @param prop The properties to extend with
		 * @param obj [optional] The object to extend from
		 * @returns The extended object
		 */
        extend: function(prop, obj) {
            return this.mixin(prop, Object.create(obj || this));
        },
        /**
		 * Return a callback function with this set to the current or a given context object.
		 * @param name Name of the method to proxy
		 * @param args... [optional] Arguments to use for partial application
		 */
        proxy: function(name) {
            var fn = this[name];
            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(this);
            return fn.bind.apply(fn, args);
        }
    };
});

!function(a, b) {
    "use strict";
    "function" == typeof define && define.amd ? define("mediator-js", [], function() {
        return a.Mediator = b(), a.Mediator;
    }) : "undefined" != typeof exports ? exports.Mediator = b() : a.Mediator = b();
}(this, function() {
    "use strict";
    function a() {
        var a = function() {
            return (0 | 65536 * (1 + Math.random())).toString(16).substring(1);
        };
        return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a();
    }
    function b(c, d, e) {
        return this instanceof b ? (this.id = a(), this.fn = c, this.options = d, this.context = e, 
        this.channel = null, void 0) : new b(c, d, e);
    }
    function c(a, b) {
        return this instanceof c ? (this.namespace = a || "", this._subscribers = [], this._channels = {}, 
        this._parent = b, this.stopped = !1, void 0) : new c(a);
    }
    function d() {
        return this instanceof d ? (this._channels = new c(""), void 0) : new d();
    }
    return b.prototype = {
        update: function(a) {
            a && (this.fn = a.fn || this.fn, this.context = a.context || this.context, this.options = a.options || this.options, 
            this.channel && this.options && void 0 !== this.options.priority && this.channel.setPriority(this.id, this.options.priority));
        }
    }, c.prototype = {
        addSubscriber: function(a, c, d) {
            var e = new b(a, c, d);
            return c && void 0 !== c.priority ? (c.priority = c.priority >> 0, c.priority < 0 && (c.priority = 0), 
            c.priority >= this._subscribers.length && (c.priority = this._subscribers.length - 1), 
            this._subscribers.splice(c.priority, 0, e)) : this._subscribers.push(e), e.channel = this, 
            e;
        },
        stopPropagation: function() {
            this.stopped = !0;
        },
        getSubscriber: function(a) {
            var b = 0, c = this._subscribers.length;
            for (c; c > b; b++) if (this._subscribers[b].id === a || this._subscribers[b].fn === a) return this._subscribers[b];
        },
        setPriority: function(a, b) {
            var e, f, g, h, c = 0, d = 0;
            for (d = 0, h = this._subscribers.length; h > d && this._subscribers[d].id !== a && this._subscribers[d].fn !== a; d++) c++;
            e = this._subscribers[c], f = this._subscribers.slice(0, c), g = this._subscribers.slice(c + 1), 
            this._subscribers = f.concat(g), this._subscribers.splice(b, 0, e);
        },
        addChannel: function(a) {
            this._channels[a] = new c((this.namespace ? this.namespace + ":" : "") + a, this);
        },
        hasChannel: function(a) {
            return this._channels.hasOwnProperty(a);
        },
        returnChannel: function(a) {
            return this._channels[a];
        },
        removeSubscriber: function(a) {
            var b = this._subscribers.length - 1;
            if (!a) return this._subscribers = [], void 0;
            for (b; b >= 0; b--) (this._subscribers[b].fn === a || this._subscribers[b].id === a) && (this._subscribers[b].channel = null, 
            this._subscribers.splice(b, 1));
        },
        publish: function(a) {
            var e, g, h, b = 0, c = this._subscribers.length, d = !1;
            for (c; c > b; b++) d = !1, e = this._subscribers[b], this.stopped || (g = this._subscribers.length, 
            void 0 !== e.options && "function" == typeof e.options.predicate ? e.options.predicate.apply(e.context, a) && (d = !0) : d = !0), 
            d && (e.options && void 0 !== e.options.calls && (e.options.calls--, e.options.calls < 1 && this.removeSubscriber(e.id)), 
            e.fn.apply(e.context, a), h = this._subscribers.length, c = h, h === g - 1 && b--);
            this._parent && this._parent.publish(a), this.stopped = !1;
        }
    }, d.prototype = {
        getChannel: function(a, b) {
            var c = this._channels, d = a.split(":"), e = 0, f = d.length;
            if ("" === a) return c;
            if (d.length > 0) for (f; f > e; e++) {
                if (!c.hasChannel(d[e])) {
                    if (b) break;
                    c.addChannel(d[e]);
                }
                c = c.returnChannel(d[e]);
            }
            return c;
        },
        subscribe: function(a, b, c, d) {
            var e = this.getChannel(a || "", !1);
            return c = c || {}, d = d || {}, e.addSubscriber(b, c, d);
        },
        once: function(a, b, c, d) {
            return c = c || {}, c.calls = 1, this.subscribe(a, b, c, d);
        },
        getSubscriber: function(a, b) {
            var c = this.getChannel(b || "", !0);
            return c.namespace !== b ? null : c.getSubscriber(a);
        },
        remove: function(a, b) {
            var c = this.getChannel(a || "", !0);
            return c.namespace !== a ? !1 : (c.removeSubscriber(b), void 0);
        },
        publish: function(a) {
            var b = this.getChannel(a || "", !0);
            if (b.namespace !== a) return null;
            var c = Array.prototype.slice.call(arguments, 1);
            c.push(b), b.publish(c);
        }
    }, d.prototype.on = d.prototype.subscribe, d.prototype.bind = d.prototype.subscribe, 
    d.prototype.emit = d.prototype.publish, d.prototype.trigger = d.prototype.publish, 
    d.prototype.off = d.prototype.remove, d.Channel = c, d.Subscriber = b, d.version = "0.9.8", 
    d;
});

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
        }
    };
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
            this.eventHandlers = [];
            // mixin public methods into global target object
            [ "get", "on", "off", "show", "hide", "toggle" ].forEach(function(method) {
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
                throw "Error at Target.API.get(): " + el.toString() + " is not a Target.js element.";
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
		 * add event handler for Target events
		 */
        on: function(eventName, els, cb) {
            var _this = this;
            els = this.normalizeEls(els);
            this.utils.forEach.call(els, function(el) {
                // will return object containing id for removal
                _this.eventHandlers.push({
                    eventName: eventName,
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
        },
        /**
		 * remove event handler for Target events
		 */
        off: function(eventName, els, cb) {
            var _this = this;
            els = this.normalizeEls(els);
            this.utils.forEach.call(els, function(el) {
                _this.utils.forEach.call(_this.eventHandlers, function(handler) {
                    if (handler.eventName === eventName && handler.el === el) {
                        _this.events.remove(handler.eventName, handler.event.id);
                    }
                });
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
        /**
		 * initComponent
		 * by name
		 * for each Target element that currently exists
		 * in DOM
		 */
        initComponent: function(name) {
            var _this = this;
            var Component = this.target[name];
            this.utils.forEach.call(_this.utils.qsa("[" + _this.config.attributes[name] + "]"), function(el, i) {
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
        target.domObserver = target.DomObserver.create(target);
        target.componentFactory = target.ComponentFactory.create(target);
        target.api = target.API.create(target);
        // init components
        target.componentFactory.start();
    };
})(window.target = window.target || {});