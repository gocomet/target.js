/**
 * target.window
 *
 * store the window dimensions
 * as well as the current breakpoint
 * fires events on window.resize
 * allowing UI to update and enable/disable themselves
 * according to breakpoints
 */
;((target, undefined) => {
	'use strict';
	
	target.Window = class TargetWindow {
		
		constructor(target) {
		
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

			window.addEventListener('resize', this.utils.debounce((e) => {
		
				_this.onResize();
		
			}, this.config.debounceDelay), false);


			// listen for when UI elements initialize or update
			// they will request layout data
			// pass to the via resize event
			this.events.subscribe('update.ui', () => {

				_this.onResize();
		
			});
		
		}
		
		width() {
		
			return this.w;
		
		}
		
		height() {
		
			return this.h;
		
		}
		
		onResize() {
		
			this.w = document.documentElement.clientWidth;
			this.h = document.documentElement.clientHeight;
		
			this.events.publish('resize.window', this.is);
		
		}
	
	};

})(window.target = window.target || {});