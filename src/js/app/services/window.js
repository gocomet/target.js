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


			window.addEventListener('scroll', function(e) {

				_this.onScroll();

			});

			// listen for when UI elements initialize or update
			// they will request layout data
			// pass to the via resize event
			this.currentLayout = '';
			this.events.subscribe('update', function(componentID) {

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

			this.events.publish('scroll', window.pageYOffset);

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

			var newLayout = '';

			if (!componentID) {

				componentID = '';

			}

			this.utils.forIn(this.is, function(layout, is) {

				if (is[layout]()) {
			
					newLayout = layout;
			
				}
			
			});

			this.currentLayout = newLayout;
			
			this.events.publish('resize' + componentID, this.is, this.width(), this.height());

			if (newLayout !== this.currentLayout) {

				this.events.publish(newLayout, this.width(), this.height());
			
			}

		}
	
	});

})(window.target = window.target || {});