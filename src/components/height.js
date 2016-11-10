/**
 * target.Height
 *
 * sets the height of an element programmatically
 *
 * defaults to window height (cross-browser)
 *
 * updates on window.resize
 *
 * usage:
 * `<div data-target-height="window">Is always window height</div>`
 *
 * or
 *
 * `<div data-target-height="-100">is always window height - 100px</div>`
 */
import utils from '../core/utils';
import UI from '../base/ui';

class Height extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);

		this.initHeight();
		
		this.addEventHandler('resize', this.setHeight);
		this.addEventHandler('resize' + this.id, this.setHeight);
		
		this.update();

	}

	/**
	 * create initial height settings
	 * based on attributes
	 */
	initHeight() {

		this.height = this.el.getAttribute(
		
			this.config.attributes.Height
		
		);

		if (!this.height || this.height === 'window') {

			this.height = 0;

		} else {

			this.height = parseInt(this.height, 10);

		}
	
	}
		
	/**
	 * get the user-declared max height threshold
	 */
	getHeight() {

		if (this.height > 0) {
	
			return this.height;
	
		} else {
	
			return this.windowHeight + this.height;
	
		}

	}

	/**
	 * on window.resize
	 * if enabled, set element height
	 * else reset height
	 */
	setHeight(is, w, h) {
		
		this.windowHeight = h;

		if (this.isDisabled) {

			this.el.style.height = '';

		} else {

			this.el.style.height = this.getHeight() + 'px';

		}
	
	}

}

module.exports = Height;
