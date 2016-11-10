/**
 * Window
 *
 * store the window dimensions
 * as well as the current breakpoint
 * fire events on window.resize
 * allowing UI to update and enable/disable themselves
 * according to breakpoints
 */
import utils from '../core/utils';
import Layout from './layout';

class Window {
	
	constructor(events, breakpoints, debounceDelay) {

		this.events = events;
		this.body = document.body;
		this.html = document.documentElement;

		this.updateDims();
		
		// "is" object
		// allows UI components to update their functionality
		// based on layout
		// usage:
		// if (is.mobile)
		// or, dynamically, for example:
		// for (layout in this.layouts)
		//   if (is[layout])
		this.is = new Layout(this, breakpoints);

		window.addEventListener('resize', utils.debounce(e => {
	
			this.onResize();
	
		}, debounceDelay), false);


		window.addEventListener('scroll', e => {

			this.onScroll();

		});

		// on browser load,
		// run another update
		// to ensure all our scrolling stuff is calculating correctly
		// after images have been loaded
		window.addEventListener('load', () => {

			this.onResize();

		});

		// listen for when UI elements initialize or update
		// they will request layout data
		// pass to the via resize event
		this.events.subscribe('update', componentID => {

			this.update(componentID);
	
		});
	
		this.update();

	}

	/**
	 * updateDims
	 * update internal dimensions with
	 * cross-browser window width and height
	 */
	updateDims() {
		
		this._w = this.html.clientWidth;
		this._h = this.html.clientHeight;
		
		this._docH = Math.max(
		
			this.body.scrollHeight,
			this.body.offsetHeight,
			this.html.clientHeight,
			this.html.scrollHeight,
			this.html.offsetHeight
		
		);
	
	}

	/**
	 * width
	 */
	get width() {
	
		return this._w;
	
	}

	/**
	 * height
	 */
	get height() {
	
		return this._h;
	
	}

	/**
	 * get height of document
	 */
	get docHeight() {

		return this._docH;

	}
	
	/**
	 * onScroll
	 * on window.scroll
	 * get scroll top and pass on
	 */
	onScroll(e) {

		this.events.publish('scroll', window.pageYOffset);

	}
	
	/**
	 * onResize
	 * on window.resize
	 * update internal window properties
	 * update application
	 */
	onResize() {

		this.updateDims();
		this.update();

	}
	
	/**
	 * update
	 * fire event for UI components to update themselves
	 * pass "is" layout object for responsive changes
	 */
	update(componentID) {

		var newLayout = '';

		if (!componentID) {

			componentID = '';

		}

		// couldn't get for..of to work here
		// kept getting "this.is[Symbol.iterator] is not a function"
		utils.forIn(this.is, (layout, is) => {

			if (is[layout]) {
		
				newLayout = layout;
		
			}
		
		});

		this.currentLayout = newLayout;
		
		this.events.publish('resize' + componentID, this.is, this.width, this.height);

		if (newLayout !== this.currentLayout) {

			this.events.publish(newLayout, this.width, this.height, this.docHeight);
		
		}

	}
	
}

module.exports = Window;
