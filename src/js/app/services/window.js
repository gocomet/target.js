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
	
	'use strict';
	
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

			window.addEventListener('resize', this.utils.debounce(function(e) {
		
				_this.onResize();
		
			}, this.config.debounceDelay), false);


			// listen for when UI elements initialize or update
			// they will request layout data
			// pass to the via resize event
			this.events.subscribe('update', function() {

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
		
			this.events.publish('resize', this.is);
		
		}
	
	});

})(window.target = window.target || {});