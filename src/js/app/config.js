/**
 * target.config
 *
 * initial default settings
 *
 * can be overridden on initialization
 * `target.init(mySettingsObjectHere);`
 */ 
;((target, undefined) => {
	
	'use strict';
	
	target.config = {
	
		activeClass: 'target-active',
	
		attributes: {
		
			Toggle: 'data-target-toggle',
			Show: 'data-target-show',
			Hide: 'data-target-hide',
			Clickoff: 'data-target-clickoff',
			Increment: 'data-target-increment',
			Decrement: 'data-target-decrement',
			disable: 'data-target-disable',
			max: 'data-target-max',
			min: 'data-target-min',
			Scrollbox: 'data-target-scrollbox'
		
		},

		breakpoints: {
	
			tablet: 768,
			desktop: 1025
	
		},
	
		debounceDelay: 100
	
	};

})(window.target = window.target || {});