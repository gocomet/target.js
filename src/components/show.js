/**
 * Show
 *
 * UI element that shows another element onclick
 *
 * usage:
 *
 * `<a data-target-show="#show-this">Click to show #show-this</a>`
 */
import utils from '../core/utils';
import UI from '../base/ui';

class Show extends UI {
	
	constructor(el, _id, name, events, config) {
	
		super(el, _id, name, events, config);

		this.targets = utils.qsa(

			this.el.getAttribute(this.config.attributes.Show)

		);

		this.addDomEventHandler('click', this.onClick);

		this.update();

	}

	/**
	 * when the element is clicked,
	 * show the target element
	 * (using css)
	 */
	onClick(e) {

		if (this.isDisabled) {

			return;

		}
		
		if (this.NODE_NAME === 'A') {

			e.preventDefault();
		
		}
	
		utils.forEach.call(this.targets, target => this.show(target));
	
	}

}

module.exports = Show;
