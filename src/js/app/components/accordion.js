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
(function(target, undefined) {
	
	'use strict';

	target.Accordion = target.UI.extend({
	
		init: function(el, _id, target, name) {

			var _this = this;

			this._super.apply(this, arguments);
			
			this.setArgs();

			this.setToggles();

			this.setContents();

			if (this.toggles.length !== this.contents.length) {

				throw 'Target.js Error on Accordion component: component must contain an equal number of toggles and contents';

			}

			this.current = null;

			this.utils.forEach.call(this.toggles, function(toggle, i) {

				_this.addDomEventHandler('click', function(e) {

					var _this = this;

					if (this.isDisabled()) {

						return;

					}

					if (toggle.nodeType === 'A') {

						e.preventDefault();

					}

					if (this.current === i) {

						this.current = null;
						
						this.hide(this.contents[i]);

					} else {

						this.current = i;
						
						this.utils.forEach.call(this.contents, function(content) {

							_this.hide(content);

						});

						this.show(this.contents[i]);
					
					}


				}, toggle);

			});

		},

		setArgs: function() {
			
			var args = this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Accordion));
			
			args = args.split(',');
			
			this.args = args;

			if (this.args.length !== 2) {

				throw 'Target.js Error on Accordion component: the value of "' + this.utils.stripBrackets(this.config.attributes.Accordion) + '" must contain two comma-separated CSS selectors';

			}

			return this.args;
		},

		setToggles: function() {

			// TODO: scope selection to parent element

			this.toggles = this.utils.qsa(this.args[0]);

			return this.toggles;
		
		},

		setContents: function() {

			// TODO: scope selection to parent element

			this.contents = this.utils.qsa(this.args[1]);

			return this.contents;

		},

		toggle: function() {



		}

	});

})(window.target = window.target || {});
