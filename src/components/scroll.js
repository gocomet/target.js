/**
 * target.Scroll
 *
 * show an element when it scrolls into view
 *
 * calculate an offset on the element by the attribute value, if it exists
 */
import utils from '../core/utils';
import UI from '../base/ui';

const PAGE_FACTOR = 0.2;

class Scroll extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);
			
		this.getOffset();

		this.addEventHandler('resize', this.onResize);
		this.addEventHandler('resize' + this.id, this.onResize);
		this.addEventHandler('scroll', this.onScroll);
		
		this.update();

	}

	getOffset() {

		this.offset = this.el.getAttribute(this.config.attributes.Scroll);

		if (this.offset) {
		
			this.offset = parseInt(this.offset, 10);
		
		} else {
		
			this.offset = 0;
		
		}

		this.top = 0;

	}
	
	calculateThreshold(h) {

		let rect = this.el.getBoundingClientRect();

		this.threshold = rect.top + this.top - (h * (1 - PAGE_FACTOR));

	}

	onScroll(top) {

		this.top = top;

		// if we're past threshold,
		// or at bottom of document
		// show el
		if (this.top >= this.threshold + this.offset || this.top >= this.docH - this.windowH) {

			this.show(this.el);

		} else {

			this.hide(this.el);

		}

	}

	/**
	 * on window.resize
	 * calculate or recalculate
	 * when our element should be shown or hidden
	 */
	onResize(is, w, h, dh) {

		this.docH = dh;

		this.windowH = h;

		this.calculateThreshold(h);
		
	}

}

module.exports = Scroll;
