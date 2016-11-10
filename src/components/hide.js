/**
 * target.Hide
 *
 * UI element that hides another element onclick
 *
 * usage:
 *
 * `<a data-target-hide="#my-target">Click to hide #my-target</a>`
 */

import utils from '../core/utils';
import UI from '../base/ui';

class Hide extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);
		
		this.targets = utils.qsa(

			this.el.getAttribute(this.config.attributes.Hide)

		);

		this.addDomEventHandler('click', this.onClick);

		this.update();
		
	}

	/**
	 * when the element is clicked,
	 * hide the target element
	 * (using css)
	 */
	onClick(e) {

		if (this.isDisabled) {

			return;

		}
		
		if (this.NODE_NAME === 'A') {

			e.preventDefault();
		
		}
		
		utils.forEach.call(this.targets, target => this.hide(target));
	
	}
	
}

module.exports = Hide;
