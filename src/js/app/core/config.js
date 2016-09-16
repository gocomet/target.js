/**
 * target.config
 *
 * initial default settings
 *
 * can be overridden on initialization
 * `target.init(mySettingsObjectHere);`
 */ 
(function(target, undefined) {
	
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
			Scrollbox: 'data-target-scrollbox',
			Grid: 'data-target-grid',
			Src: 'data-target-src',
			Filetext: 'data-target-filetext',
			Accordion: 'data-target-accordion',
			Scroll: 'data-target-scroll',
			Height: 'data-target-height',
			disable: 'data-target-disable',
			max: 'data-target-max',
			min: 'data-target-min'
		
		},

		breakpoints: {
	
			tablet: 768,
			desktop: 1025,
			large: 1440
	
		},
	
		observeDom: false,

		debounceDelay: 100
	
	};

})(window.target = window.target || {});
