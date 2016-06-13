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
(function(target, undefined) {
	
	'use strict';

	target.Filetext = target.UI.extend({
	
		init: function(el, _id, target, name) {
	
			var inputType;

			this._super.apply(this, arguments);

			if (this.NODE_NAME !== 'INPUT' || this.el.getAttribute('type') !== 'file') {

				throw 'Error on Target.Filetext component: "' + this.utils.stripBrackets(this.config.attributes.Filetext) + '" must be applied to an <input> element with \'type="file"\'';
			
			}

			this.targets = this.utils.qsa(
	
				this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Filetext))
	
			);

			this.addDomEventHandler('change', this.onChange);
			
		},

		/**
		 * when the file input is changed
		 * get filename
		 * and set as text of target element
		 */
		onChange: function(e) {

			var _this = this;
			var filename = this.el.files && this.el.files[0];

			if (!this.isDisabled()) {
			
				if (this.el.files.length) {

					filename = this.el.files[0].name;

					this.utils.forEach.call(this.targets, function(target) {

						target.innerHTML = filename;

					});
				
				}

			}
		
		}

	});

})(window.target = window.target || {});
