
import Mediator from 'mediator-js';
import utils from './app/core/utils';
import config from './app/core/config';
import Window from './app/services/window';

class Target {
	
	constructor(config) {
	
		this.events = new Mediator();
		this.config = config;
	
	}

	init(options) {
	
		utils.mixin(this.config, options);

		//init services
		this.window = new Window(
			this.events,
			this.config.breakpoints,
			this.config.debounceDelay
		);
		
		// for performance's sake, only observe dom if required
		// if (target.config.observeDom) {
			
		// 	target.domObserver = target.DomObserver.create(target);
		
		// }

		// target.componentFactory = target.ComponentFactory.create(target);
		// target.api = target.API.create(target);

		// // init components
		// target.componentFactory.start();
	
	}

}

window.target = new Target(config);
