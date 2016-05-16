/**
 *
 * target.init
 *
 * override default settings (if specified)
 * initialize all components on doc.ready
 *
 */
;(function(target, undefined) {
	
	'use strict';
	
	target.init = function(options) {
	
		// override defaults with user settings
		target.utils.mixin(target.config, options);

		// init services
		target.events = new window.Mediator();
		target.window = target.Window.create(target);
		target.domObserver = target.DomObserver.create(target);
		target.api = target.API.create(null, 'target-api', target, 'api');

		// init components
		target.componentFactory = target.ComponentFactory.create(target);
		target.componentFactory.start();
	
	};

})(window.target = window.target || {});