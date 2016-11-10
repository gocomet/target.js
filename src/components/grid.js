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
 *
 * NOTE: this is a performance hog.
 * Just too much iterating through the DOM,
 * setting and unsetting element heights on each iteration
 * TODO: look into a better approach
 */
import utils from '../core/utils';
import UI from '../base/ui';

class Grid extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);

		this.TEXT_NODE = 3;
		this.COMMENT_NODE = 8;

		this.published = false;

		this.setChildren();

		this.setBreakpoints();

		this.addEventHandler('resize', this.onResize);
		this.addEventHandler('resize' + this.id, this.onResize);

		this.update();

		// since the grid may contain images,
		// let's update the layout on window.load as well
		this.addDomEventHandler('load', this.onLoad, window);

	}

	/**
	 * set breakpoints
	 * this will determine how many items are in a row
	 * at various breakpoints (mobile, tablet, desktop, large)
	 * also, if the breakpoint is "disable", instead of an int,
	 * disable at that breakpoint
	 */
	setBreakpoints() {

		let breakpoints = this.el.getAttribute(this.config.attributes.Grid).split(' ');

		let disableLayouts = [];

		let layouts = [
			
			'mobile',
			'tablet',
			'desktop',
			'large'
		
		];

		breakpoints.forEach((breakpoint, i) => {

			if (breakpoint === 'disable') {

				disableLayouts.push(layouts[i]);

				breakpoint = 0;

			} else {

				breakpoint = parseInt(breakpoint, 10);
			
			}

		});

		this.breakpoints = {
			
			mobile: breakpoints[0],
			tablet: breakpoints[1],
			desktop: breakpoints[2],
			large: breakpoints[3]
		
		};

		if (disableLayouts.length) {

			this.el.setAttribute(this.config.attributes.disable, disableLayouts.join(' '));

		}

	}

	onLoad(e) {

		this.removeDomEventHandler('load');
		this.update();

	}

	/**
	 * find child nodes of element
	 * filter out any text nodes
	 */
	setChildren() {

		this.children = [];

		if (!this.el.hasChildNodes()) {

			return [];

		}
		
		let childNodes = this.el.childNodes;

		utils.forEach.call(childNodes, child => {

			if (child.nodeType !== this.TEXT_NODE && child.nodeType !== this.COMMENT_NODE) {

				this.children.push(child);

			}

		});

	}

	/**
	 * determine how many thumbnails per row
	 * based on responsive layout
	 * "is" object passed from our "window" service
	 * via events
	 */
	setPerRow(is) {

		// set default
		this.perRow = this.breakpoints.mobile;

		// update with relevant media query if applicable
		Object.keys(this.breakpoints).forEach(layout => {

			if (this.breakpoints[layout] && is[layout]) {

				this.perRow = this.breakpoints[layout];

			}

		});

		return this.perRow;

	}

	/**
	 * set which thumbnails are in a row together
	 * based on the number of thumbs per row
	 * which is based on the current responsive layout
	 */
	buildRows() {

		let lastChild = this.children[this.children.length - 1];
		let row = [];
		let i = 0;

		this.rows = [];

		// loop through children
		// and add element to row
		// or if row is full
		// add row to rows array
		utils.forEach.call(this.children, child => {

			if (i >= this.perRow) {

				this.rows.push(row);
				
				i = 0;

				row = [];

			}
				
			row.push(child);

			i++;

			if (child === lastChild) {

				this.rows.push(row);

			}

		});

		return this.rows;

	}

	/**
	 * on window.resize
	 * if enabled
	 * determine how many thumbs per row
	 * group those thumbs together in rows
	 * reset the height of thumbs to their default
	 * get, calculate, and set the correct height
	 * so thumbs in the same row have the same height
	 */
	calculateGrid(is) {

		this.setPerRow(is);

		this.buildRows();

		this.rows.forEach(row => {

			var maxHeight = 0;

			row.forEach(item => {

				item.style.height = '';

				maxHeight = Math.max(item.offsetHeight, maxHeight);

			});

			row.forEach(item => {

				item.style.height = maxHeight + 'px';

			});

		});

	}

	/**
	 * on window.resize
	 * if disabled
	 * reset heights of all children
	 */
	resetGrid() {

		utils.forEach.call(this.children, child => child.style.height = '');

	}

	/**
	 * on window.resize
	 * either build grid
	 * or reset
	 * depending on if enabled or disabled
	 */
	onResize(is) {

		if (!this.isDisabled) {

			this.calculateGrid(is);
		
		} else {

			this.resetGrid();

		}

	}

}

module.exports = Grid;
