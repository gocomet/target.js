/**
 * target.DomObserver
 *
 * watches DOM for changes
 * triggers events
 * to initialize, update, or destroy components
 */
;((target, undefined) => {
	'use strict';
	
	target.DomObserver = class TargetDomObserver {
		
		constructor(target) {
		
			var _this = this;

			this.TEXT_NODE = 3;
			this.COMMENT_NODE = 8;

			this.events = target.events;
			this.config = target.config;
			this.utils 	= target.utils;	

			this.observer = new window.MutationObserver((mutations, observer) => {

				_this.onMutation(mutations, observer);

			});

			// define what element should be observed by the observer
			// and what types of mutations trigger the callback
			this.observer.observe(document, {
		
				subtree: true,
				childList: true,

				// return an array of only the attributes we use
				attributeFilter: target.utils.values(_this.config.attributes)
		
			});
		
		}

		/**
		 * when a node is added
		 * strip out text nodes
		 * then fire event
		 * for componentfactory service to pickup
		 * and initialize new components if required
		 */
		publishAddedNodes(nodes) {

			var _this = this;

			this.utils.forEach.call(nodes, (node) => {

				if (node.nodeType === _this.TEXT_NODE || node.nodeType === _this.COMMENT_NODE) {

					return;

				}

				// parse attributes for target components
				_this.utils.forIn(_this.config.attributes, (prop, obj) => {

					var attName = obj[prop];

					if (node.getAttribute(attName)) {

						_this.events.publish('nodeadded.mutation', prop, node);

					}

				});

			});

		}

		/**
		 * when a DOM mutation happens
		 * determine the type of mutation
		 * and fire the appropriate event
		 */
		onMutation(mutations, observer) {

			var _this = this;

			mutations.forEach((mutation) => {
				
				switch (mutation.type) {
				
					case 'attributes':
						_this.events.publish('attributes.mutation', mutation.target);
						break;
				
					case 'childList':
						_this.publishAddedNodes(mutation.addedNodes);
						break;
				
					default:
						_this.utils.noop();
						break;
				
				}
				
			});

		}
	
	};

})(window.target = window.target || {});