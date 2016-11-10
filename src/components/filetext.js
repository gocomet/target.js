/**
 * target.Filetext
 *
 * gives you the text of a file input
 * allows you to style file inputs any way you like
 *
 * usage:
 *
 * `<input type="file" data-target-filetext="#my-filetext-element" />`
 */
import utils from '../core/utils';
import UI from '../base/ui';

class Filetext extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);
	
		if (this.NODE_NAME !== 'INPUT' || this.el.getAttribute('type') !== 'file') {

			throw 'Error on Target.Filetext component: "' + this.config.attributes.Filetext + '" must be applied to an <input> element with \'type="file"\'';
		
		}

		this.targets = utils.qsa(

			this.el.getAttribute(this.config.attributes.Filetext)

		);

		this.addDomEventHandler('change', this.onChange);
		
	}

	/**
	 * when the file input is changed
	 * get filename
	 * and set as text of target element
	 */
	onChange(e) {

		var filename = this.el.files && this.el.files[0];

		if (this.isDisabled) {

			return;

		}
		
		if (this.el.files.length) {

			filename = this.el.files[0].name;

			utils.forEach.call(this.targets, target => target.innerHTML = filename);
		
		}
	
	}

}

module.exports = Filetext;
