/**
 * target.utils
 *
 * utility methods for use throughout library
 */ 
let utils = {
	
	/**
	 * shallow-ish mixins on objects
	 */
	mixin: (origObj, newObj) => {
	
		for (let k in newObj) {
	
			if (newObj.hasOwnProperty(k)) {

				let newV = newObj[k];
				let origV = origObj[k];

				origObj[k] = newObj[k];

				if (typeof origV === 'object' && typeof newV === 'object') {

					for (let kk in newV) {

						if (newV.hasOwnProperty(k)) {

							origV[kk] = newV[kk];

						}

					}
		
				}

			}
	
		}
	
	},

	/**
	 * use array.prototype.forEach on nodelists
	 */ 
	forEach: Array.prototype.forEach,

	/**
	 * convenience method for finding an element in a node list
	 */
	contains: (list, el) => {

		var i = Array.prototype.indexOf.apply(list, [el]);
		var doesContain;

		if (i === -1) {

			doesContain = false;

		} else {

			doesContain = true;

		}

		return doesContain;

	},

	/**
	 * debounce function
	 * http://davidwalsh.name/javascript-debounce-function
	 */ 
	debounce: (func, wait, immediate) => {
	
		var timeout;
	
		return () => {
	
			var context = this;
			var args = arguments;
	
			var later = () => {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
	
			var callNow = immediate && !timeout;
	
			clearTimeout(timeout);
	
			timeout = setTimeout(later, wait);
	
			if (callNow) {
	
				func.apply(context, args);
	
			}
	
		};
	
	},

	/**
	 * map values of object to array
	 */
	values: obj => {
	
		let array = [];
	
		for (let val of obj) {
	
			array.push(val);
	
		}
	
		return array;
	
	},

	/**
	 * create shorter alias for QS
	 */
	qs: document.querySelector.bind(document),

	/**
	 * create shorter alias for QSA
	 */
	qsa: document.querySelectorAll.bind(document),

	/**
	 * strip brackets from attribute selectors
	 * for getting the actual attribute
	 * using element.getAttribute()
	 */
	stripBrackets: att => {
	
		att.replace('[', '').replace(']', '');
	
	},
	
	/**
	 * capitalize first letter of string
	 */
	capitalize: str => {
	
		str.charAt(0).toUpperCase() + str.slice(1);
	
	},

	/**
	 * check if child is descendent of parent
	 * http://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-contained-within-another
	 */
	isDescendant: (parent, child) => {
	
		var node = child.parentNode;
	
		while (node !== null) {
	
			if (node === parent) {
	
				return true;
	
			}
	
			node = node.parentNode;
	
		}
	
		return false;
	
	},

	/**
	 * for those special times
	 * when you just really wanna do nothing
	 */
	noop: () => {},

	/**
	 * for in loop
	 * check if object has prop
	 */
	forIn: (obj, cb) => {
		
		var prop;

		for (prop in obj) {
		
			if (obj.hasOwnProperty(prop)) {

				cb(prop, obj);

			}
		
		}

	},

	render: (rAF => {

		if (rAF) {

			return (cb) => {

				rAF(() => {

					cb();

				});

			};

		} else {

			return (cb) => {

				cb();

			};
			
		}

	})(window.requestAnimationFrame),

	isIOS: (ua => {
		
		return ua.match(/iphone/gi) || ua.match(/ipad/gi);
	
	})(window.navigator.userAgent)

};

module.exports = utils;
