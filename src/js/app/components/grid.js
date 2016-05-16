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
;(function(target, undefined) {
	
	'use strict';

	target.Grid = target.UI.extend({
	
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);
			
			var breakpoints;

			this.TEXT_NODE = 3;
			this.COMMENT_NODE = 8;

			this.setChildren();

			breakpoints = this.el.getAttribute(this.config.attributes.Grid).split(' ');

			this.breakpoints = {
				
				mobile: parseInt(breakpoints[0], 10),
				tablet: parseInt(breakpoints[1], 10),
				desktop: parseInt(breakpoints[2], 10)
			
			};

			this.addEventHandler('resize', this.calculateGrid);

			this.events.publish('update');

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

					item.style.height = '';

					maxHeight = Math.max(item.offsetHeight, maxHeight);

				});

				row.forEach(function(item) {

					item.style.height = maxHeight + 'px';

				});

			});
		
		}

	});

})(window.target = window.target || {});