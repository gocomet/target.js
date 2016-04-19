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
;((target, undefined) => {
	
	'use strict';

	target.API = class TargetAPI extends target.UI {

		constructor(el, _id, target, name) {

			el = document.createElement('div');
			el.style.display = 'none';

			super(el, _id, target, name);
		
			// apply convenience methods to global "target" object
			this.target = target;
			this.target.show = this.showEls.bind(this);
			this.target.hide = this.hideEls.bind(this);
			this.target.get = this.get.bind(this);
			this.target.toggle = this.toggleEls.bind(this);

		}

		getEls(els) {

			if (typeof els === 'string') {

				els = this.utils.qsa(els);

			}

			return els;

		}

		get(els) {

			els = this.getEls(els);

			this.targets = els;

			return this;

		}

		showEls(els) {

			var _this = this;

			els = this.getEls(els);

			this.utils.forEach.call(els, function(el) {

				_this.show(el);
			
			});


		}

		hideEls(els) {

			var _this = this;

			els = this.getEls(els);

			this.utils.forEach.call(els, function(el) {

				_this.hide(el);
			
			});

		}

		/**
		 * if the target is shown, hide it
		 * if the target is hidden, show it
		 * all using css
		 * also toggle state of toggle button itself
		 */
		toggleEls(els) {
		
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

	};

})(window.target = window.target || {});