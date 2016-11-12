/**
 * target.DomObserver
 *
 * watches DOM for changes
 * triggers events
 * to initialize, update, or destroy components
 *
 * NOTE: currently a performance hog
 * TODO: look into optimizing
 * scope smaller?
 */
import WeakMap from 'weak-map';
import MutationObserver from 'mutation-observer';
import utils from '../core/utils';

const TEXT_NODE = 3;
const COMMENT_NODE = 8;

class DomObserver {

	constructor(events, config) {
	
		this.events = events;
		this.config = config;

		this.observer = new MutationObserver((mutations, observer) => {

			this.onMutation(mutations, observer);

		});

		// define what element should be observed by the observer
		// and what types of mutations trigger the callback
		this.observer.observe(document.body, {
	
			subtree: true,
			childList: true,
			attributes: true,

			// return an array of only the attributes we use
			attributeFilter: utils.values(this.config.attributes)
	
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

		utils.forEach.call(nodes, node => {

			if (node.nodeType === TEXT_NODE || node.nodeType === COMMENT_NODE) {

				return;

			}

			// parse attributes for target components
			utils.forIn(this.config.attributes, (prop, obj) => {

				var attName = obj[prop];

				if (node.getAttribute(attName)) {

					this.events.publish('nodeadded.mutation', prop, node);

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

		mutations.forEach(mutation => {
			
			switch (mutation.type) {
			
				case 'attributes':
					this.events.publish('attributes.mutation', mutation.target);
					break;
			
				case 'childList':
					this.publishAddedNodes(mutation.addedNodes);
					break;
			
				default:
					utils.noop();
					break;
			
			}
			
		});

	}

}

module.exports = DomObserver;
