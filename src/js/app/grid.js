/**
 *
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
 *
 */
;((target, undefined) => {
	
	'use strict';

	target.Grid = class TargetGrid extends target.UI {
	
		constructor(el, _id, target, name) {
	
			var breakpoints;

			super(el, _id, target, name);

			if (this.el.hasChildNodes()) {
			
				this.children = this.el.childNodes;

			}

			breakpoints = this.el.getAttribute(this.config.attributes.Grid).split(' ');

			this.breakpoints = {
				
				mobile: breakpoints[0],
				tablet: breakpoints[1],
				desktop: breakpoints[2]
			
			};

			this.addEventListener('resize.window', this.calculateRows);

		}

		calculateRows(is) {

			var _this = this;
			var lastChild = this.children[this.children.length - 1];
			var row = [];
			var i = 0;

			this.rows = [];

			// set default
			this.perRow = this.breakpoints.mobile;

			// update with relevant media query if applicable
			Object.keys(this.breakpoints).forEach(function(layout) {

				if (_this.breakpoints[layout] && is[layout]()) {

					_this.perRow = _this.breakpoints[layout];

				}

			});

			// loop through children
			// and add element to row
			// or if row is full
			// add row to rows array
			this.utils.forEach.call(this.children, function(child) {

				if (i < _this.perRow && child !== lastChild) {

					row.push(child);

					i++;

				} else {

					_this.rows.push(row);
					
					i = 0;

					row = [];

				}

			});

			this.rows.forEach(function(row) {

				var maxHeight = 0;

				row.forEach(function(item) {

					maxHeight = Math.max(item.offsetHeight, maxHeight);

				});

				row.forEach(function(item) {

					item.style.height = `${maxHeight}px`;

				});

			});
		
		}

	};

})(window.target = window.target || {});