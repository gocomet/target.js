/**
 * config
 *
 * initial default settings
 *
 * can be overridden on initialization
 * `target.init(mySettingsObjectHere);`
 */ 
module.exports = {
	
	activeClass: 'target-active',

	attributes: {
	
		Toggle: 'data-target-toggle',
		Show: 'data-target-show',
		Hide: 'data-target-hide',
		Clickoff: 'data-target-clickoff',
		Increment: 'data-target-increment',
		Decrement: 'data-target-decrement',
		Filetext: 'data-target-filetext',
		Accordion: 'data-target-accordion',
		Scrollbox: 'data-target-scrollbox',
		Scroll: 'data-target-scroll',
		Height: 'data-target-height',
		Grid: 'data-target-grid',
		Src: 'data-target-src',
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
