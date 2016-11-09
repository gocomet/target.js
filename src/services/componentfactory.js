/**
 * ComponentFactory
 *
 * generates and manages components
 */
import utils from '../core/utils';
import Show from '../components/show';
import Hide from '../components/hide';
import Toggle from '../components/toggle';
import Clickoff from '../components/clickoff';
import Accordion from '../components/accordion';

const COMPONENTS = {
	Show,
	Hide,
	Toggle,
	Clickoff,
	Accordion
};	

class ComponentFactory {
		
	constructor(events, config) {
	
		this.events = events;
		this.config = config;
	
		this.topId = 0;
		this.components = {};
		
		this.IGNORE_ATTS = ['disable', 'min', 'max'];
		this.COMPONENT_CLASSES = Object
			.keys(this.config.attributes)
			.filter(val => !utils.contains(this.IGNORE_ATTS, val));

		if (this.config.observeDom) {
			
			this.events.subscribe('nodeadded.mutation', this.build, {}, this);
		
		}

		this.start();
	
	}

	/**
	 * create an element after a DOM mutation
	 * need to check if this element is already created
	 */
	build(name, el) {

		// don't initialise a component because of an att
		// we should ignore: (disable, min, max)
		if (this.IGNORE_ATTS.indexOf(name) !== -1) {

			return;

		}

		// if the component is already initialised
		// on the element,
		// exit
		if (el.getAttribute('data-target-' + name + '-id') !== null) {

			return;

		}

		this.topId++;

		this.components[this.topId] = new COMPONENTS[name](el, this.topId, name, this.events, this.config);

	}

	/**
	 * initComponent
	 * by name
	 * for each Target element that currently exists
	 * in DOM
	 * if scope is used, only get elements contained within scope
	 */
	initComponent(name, scope) {

		var selector = '[' + this.config.attributes[name] + ']';
		var elList;

		if (scope) {

			elList = scope.querySelectorAll(selector);

		} else {

			elList = utils.qsa(selector);

		}

		utils.forEach.call(
			
			elList,
			
			(el, i) => {
			
				this.topId++;

				this.components[this.topId] = new COMPONENTS[name](el, this.topId, name, this.events, this.config);
			
			}
		
		);

	}

	/**
	 * find component by DOM element
	 * used by Target.API
	 */
	find(el) {
		
		var component = false;
		
		utils.forIn(this.components, (id, components) => {

			if (components[id].el === el) {

				component = components[id];
			
			}

		});

		return component;

	}

	/**
	 * get component by ID
	 * used by target.API
	 */
	get(id) {

		return this.components[id];

	}

	/**
	 * component for one-time use
	 * used by API
	 */
	use(name, targets) {

		var el = document.createElement('div');

		var Component = COMPONENTS[name];

		var component = new Component(el, 'tmp', name, this.events, this.config);

		component.targets = targets;

		return component;

	}

	/**
	 * start function run manually
	 * after object instantiation
	 */
	start(scope) {

		this.COMPONENT_CLASSES.forEach(name => this.initComponent(name, scope));

	}

}

module.exports = ComponentFactory;
