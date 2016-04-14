/**
 *
 * target.initapi
 *
 * make programmatic methods accessible
 * to global object
 * in simplified api
 *
 */
;((target, undefined) => {
	
	'use strict';
	
	target.initAPI = function() {
	
		var _this = this;

		this._getEl = function(el) {

			if (typeof el === 'string') {

				el = _this.utils.qsa(el);

			}

			return el;

		};

		this.get = function(el) {

			el = _this._getEl(el);

		};

		this.show = function(el) {

			el = _this._getEl(el);

			_this.UI.Show.apply(_this, el);

		};

		this.hide = function(el) {

			el = _this._getEl(el);

			_this.UI.Hide.apply(_this, el);
		
		};

		this.toggle = function(el) {

			el = _this._getEl(el);

			_this.Toggle.Toggle.apply(_this, el);

		};
		
	};

})(window.target = window.target || {});