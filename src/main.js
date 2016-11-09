/**
 * main.js
 * 
 * define public Target object
 *
 * create .init method for initialization by user
 *
 * usage:
 * `target.init(settings);`
 */
import Mediator from 'mediator-js';
import utils from './core/utils';
import config from './core/config';
import Window from './services/window';
import ComponentFactory from './services/componentfactory';

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
		
		// for performance's sake, don't observe dom by default
		// if (this.config.observeDom) {
		// 	this.domObserver = new DomObserver(this);
		// }

		this.componentFactory = new ComponentFactory(
			this.events,
			this.config
		);

		// this.api = new API(this);
	
	}

}

window.target = new Target(config);
