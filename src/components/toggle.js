/**
 *
 * target.Toggle
 *
 * UI element that shows/hides another element on click
 *
 * usage:
 *
 * `<a data-target-toggle="#my-target">Click to toggle #my-target</a>`
 *
 * TODO: add support for checkbox inputs
 * if element.type === checkbox
 *  bind to onchange event instead of onclick
 *
 */
import utils from '../core/utils';
import UI from '../base/ui';
	
class Toggle extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);
		
		this.targets = utils.qsa(

			this.el.getAttribute(this.config.attributes.Toggle)

		);

		this.addDomEventHandler('click', this.onClick);

	}

	/**
	 * when the element is clicked
	 * toggle the target element's visibility
	 */
	onClick(e) {

		if (this.isDisabled) {

			return;

		}
		
		if (this.NODE_NAME === 'A') {

			e.preventDefault();
		
		}

		utils.forEach.call(this.targets, target => this.toggle(target));
	
	}

	/**
	 * if the target is shown, hide it
	 * if the target is hidden, show it
	 * all using css
	 * also toggle state of toggle button itself
	 */
	toggle(el) {
	
		if (!el.classList.contains(this.config.activeClass)) {
			
			this.show(el);
	
		} else {
		
			this.hide(el);
	
		}

	}

}

module.exports = Toggle;
