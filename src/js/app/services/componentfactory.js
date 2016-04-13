/**
 * target.ComponentFactory
 *
 * generates and manages components
 *
 */
;((target, undefined) => {
	'use strict';
	
	target.ComponentFactory = class TargetComponentFactory {
		
		constructor(target) {
		
			var _this = this;
			var attsArray;

			this.events = target.events;
			this.config = target.config;
			this.utils 	= target.utils;	
			this.target = target;

			this.topId = 0;
			this.components = {};
			
			attsArray = Object.keys(this.config.attributes);
			
			this.ignoreAtts = ['disable', 'min', 'max'];
			this.componentClasses = attsArray.filter(function(val) {
				return this.ignoreAtts.indexOf(val) === -1;
			}, this);

			this.events.subscribe('nodeadded.mutation', this.create, {}, this);
		
		}

		/**
		 * create an element after a DOM mutation
		 * need to check if this element is already created
		 */
		create(name, el) {

			var Component;

			// don't initialise a component because of an att
			// we should ignore: (disable, min, max)
			if (this.ignoreAtts.indexOf(name) !== -1) {

				return;

			}

			// if the component is already initialised
			// on the element,
			// exit
			if (el.getAttribute(`data-target-${name}-id`) !== null) {

				return;

			}

			Component = this.target[name];

			this.topId++;

			this.components[this.topId] = new Component(el, this.topId, this.target, name);
			
		}

		initComponent(name) {

			var _this = this;
			var Component = this.target[name];

			this.utils.forEach.call(
				
				_this.utils.qsa(`[${_this.config.attributes[name]}]`),
				
				(el, i) => {
				
					_this.topId++;

					_this.components[_this.topId] = new Component(el, _this.topId, _this.target, name);
				
				}
			
			);

		}

		init() {

			var _this = this;

			this.componentClasses.forEach(function(name) {

				_this.initComponent(name);

			});

		}
	
	};

})(window.target = window.target || {});