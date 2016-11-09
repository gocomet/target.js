/**
 *
 * target.Accordion
 *
 * UI consisting of group of toggles that work together
 *
 * usage:
 *
 * ```
 * <div data-target-accordion=".js-toggle, .js-content">
 *   <h2 class="js-toggle">Click to Toggle Content</h2>
 *   <div class="js-content">Content here</div>
 *   <h2 class="js-toggle">Click to Toggle Content</h2>
 *   <div class="js-content">Content here</div>
 * </div>
 * ```
 *
 * TODO: proper event handling
 * currently, only one reference for each event name is stored
 * the accordion will require multiple event handlers of the same name to be stored
 */
import utils from '../core/utils';
import UI from '../base/ui';

class Accordion extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);

		this.setArgs();

		this.setToggles();

		this.setContents();

		if (this.toggles.length !== this.contents.length) {

			throw 'Target.js Error on Accordion component: component must contain an equal number of toggles and contents';

		}

		this.current = null;

		utils.forEach.call(this.toggles, (toggle, i) => {

			this.addDomEventHandler('click', this.toggle(toggle, i), toggle);

		});

	}

	setArgs() {
		
		var args = this.el.getAttribute(this.config.attributes.Accordion);
		
		args = args.split(',');
		
		this.args = args;

		if (this.args.length !== 2) {

			throw 'Target.js Error on Accordion component: the value of "' + this.utils.stripBrackets(this.config.attributes.Accordion) + '" must contain two comma-separated CSS selectors';

		}

		return this.args;

	}

	setToggles() {

		this.toggles = this.el.querySelectorAll(this.args[0]);

		return this.toggles;
	
	}

	setContents() {

		this.contents = this.el.querySelectorAll(this.args[1]);

		return this.contents;

	}

	toggle(toggle, i) {

		return e => {

			if (this.isDisabled) {

				return;

			}

			if (toggle.nodeType === 'A') {

				e.preventDefault();

			}

			if (this.current === i) {

				this.current = null;
				
				this.hide(this.toggles[i]);
				this.hide(this.contents[i]);

			} else {

				this.current = i;
				
				utils.forEach.call(this.contents, (content, i) => {

					this.hide(this.toggles[i]);
					this.hide(content);

				});

				this.show(this.toggles[i]);
				this.show(this.contents[i]);
			
			}

		};

	}

}

module.exports = Accordion;
