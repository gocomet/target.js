/**
 * target.Clickoff
 *
 * close an element by clicking away from it
 *
 * usage:
 *
 * `<a data-target-clickoff>Click away from this to close</a>`
 */
import utils from '../core/utils';
import UI from '../base/ui';

class Clickoff extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);

		this.addDomEventHandler('click', this.onClick, document);

	}

	/**
	 * when the user clicks anywhere in the document
	 * determine if the click came from outside this element
	 * if so, close this element
	 */
	onClick(e) {

		var hide = true;

		// return if disabled
		// or if element already hidden
		if (this.isDisabled || !this.el.classList.contains(this.config.activeClass)) {
		
			return true;

		}

		// check event source
		// check if source is or is contained within clickoff element
		// also be sure to not conflict with other targets
		let showAtt = e.srcElement.getAttribute(this.config.attributes.Show);
		let toggleAtt = e.srcElement.getAttribute(this.config.attributes.Toggle);

		if (
			e.srcElement === this.el ||
			utils.isDescendant(this.el, e.srcElement) ||
			showAtt === '#' + this.el.id ||
			showAtt === '.' + this.el.className ||
			toggleAtt === '#' + this.el.id ||
			toggleAtt === '.' + this.el.className
		) {
			hide = false;
		}

		// if so, close element
		if (hide && this.el.classList.contains(this.config.activeClass)) {
			
			this.hide(this.el);
		
		}
	
	}

}

module.exports = Clickoff;
