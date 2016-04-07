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

		create(name, el) {

			var Component;

			if (this.ignoreAtts.indexOf(name) !== -1) {

				return;

			}

			Component = this.target[name];

			this.topId++;

			this.components[this.topId] = new Component(el, this.topId, this.target);
			
		}

		initComponent(name) {

			var _this = this;
			var Component = this.target[name];

			this.utils.forEach.call(
				
				_this.utils.qsa(`[${_this.config.attributes[name]}]`),
				
				(el, i) => {
				
					_this.topId++;

					_this.components[_this.topId] = new Component(el, _this.topId, _this.target);
				
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