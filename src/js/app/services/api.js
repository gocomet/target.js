/**
 *
 * target.API
 *
 * make programmatic methods accessible
 * to global object
 * in simplified api
 *
 * TODO: this needs to be refactored
 * instead of being tightly coupled to UI class
 * which does a lot of unrelated stuff we don't need here
 */
;(function(target, undefined) {
	
	'use strict';

	target.API = target.UI.extend({

		init: function(el, _id, target, name) {

			el = document.createElement('div');
			el.style.display = 'none';

			this._super.apply(this, [el, _id, target, name]);
		
			// apply convenience methods to global "target" object
			this.target = target;
			this.target.show = this.showEls.bind(this);
			this.target.hide = this.hideEls.bind(this);
			this.target.get = this.get.bind(this);
			this.target.toggle = this.toggleEls.bind(this);

		},

		getEls: function(els) {

			if (typeof els === 'string') {

				els = this.utils.qsa(els);

			} else if (els.length) {

				els = els;

			} else {

				els = [els];

			}

			return els;

		},

		get: function(els) {

			els = this.getEls(els);

			this.targets = els;

			return this;

		},

		showEls: function(els) {

			var _this = this;

			els = this.getEls(els);

			this.utils.forEach.call(els, function(el) {

				_this.show(el);
			
			});

		},

		hideEls: function(els) {

			var _this = this;

			els = this.getEls(els);

			this.utils.forEach.call(els, function(el) {

				_this.hide(el);
			
			});

		},

		/**
		 * if the target is shown, hide it
		 * if the target is hidden, show it
		 * all using css
		 * also toggle state of toggle button itself
		 */
		toggleEls: function(els) {
		
			var _this = this;

			els = this.getEls(els);

			this.utils.forEach.call(els, function(el) {

				if (!el.classList.contains(_this.config.activeClass)) {
					
					_this.show(el);
			
				} else {
				
					_this.hide(el);
			
				}

			});

		}

	});

})(window.target = window.target || {});