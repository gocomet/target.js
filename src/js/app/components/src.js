/**
 * target.Src
 *
 * Responsively loads images
 *
 * based on current layout
 *
 * usage:
 * 
 * add space-separated list of image urls:
 *
 * the first is for mobile
 * the second is for tablet
 * the third is for desktop
 * the fourth is for large
 *
 * `<img src="my_blang_img.gif" data-target-src="/mobile-img.jpg /tablet-img.jpg /desktop-img.jpg">`
 *
 * you can use only one or two sources
 *
 * `<img src="my_blang_img.gif" data-target-src="/mobile-img.jpg /tablet-and-desktop-img.jpg">`
 *
 * you can specify to use the previous image by passing a null argument
 *
 * `<img src="my_blang_img.gif" data-target-src="/mobile-and-tablet-img.jpg null /desktop-img.jpg">`
 */
(function(target, undefined) {
	
	'use strict';

	// utility object for tracking which images are already cached
	// track localStorage to prevent bug
	// in which an image stored in cache
	// would not be loaded
	// because target will try to load it and wait for onload event
	// but browser will not load cached images
	var CACHE_NAME = 'targetJsImgsLoaded';
	var imageCache = {
		contains: function(item) {
			return this.images.indexOf(item) !== -1;
		},
		add: function(item) {
			if (!this.contains(item)) {
				this.images += item;
			}
			
			if (!target.utils.isIOS && localStorage) {
				localStorage[CACHE_NAME] = this.images;
			}
		},
		init: function() {
			if (!target.utils.isIOS && localStorage && localStorage[CACHE_NAME]) {
				this.images = localStorage[CACHE_NAME];
			} else {
				this.images = '';
			}
		}
	};
	imageCache.init();

	var img = document.createElement('img');

	target.Src = target.UI.extend({
	
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);

			if (this.NODE_NAME !== 'IMG' && this.NODE_NAME !== 'DIV') {

				throw 'Target.js Error on Src component: "' + this.utils.stripBrackets(this.config.attributes.Src) + '" must be applied to an <img> or <div> element';
			
			}

			this.published = false;

			this.img = img;

			// TODO: only load when in view
			// this.inview = false;
			// this.queue = target.Queue.create();

			this.getSrcs();

			this.imageCache = imageCache;
		
			this.addEventHandler('resize', this.onResize);
			this.addEventHandler('resize' + this.id, this.onResize);
			// TODO: only load when in view
			//this.addEventHandler('scroll', this.onScroll);

			// request an update from target.Window
			this.events.publish('update', this.id);
		
		},

		/**
		 * get list of image urls from element attribute
		 * loop through and assign each image to a layout
		 * make mobile-first,
		 * so that if a layout doesn't have an image explicity assigned
		 * it will inherit the image from the next layout down
		 *
		 * ex. if only two images defined, desktop layout can inherit image from tablet layout
		 */
		getSrcs: function() {

			var _this = this;
			var srcAtt = this.el.getAttribute(this.config.attributes.Src);
			var srcs = srcAtt.split(' ');
			var latestSrc = null;

			this.srcs = {
				mobile: '',
				tablet: '',
				desktop: '',
				large: ''
			};

			this.currentSrc = '';

			Object.keys(this.srcs).forEach(function(layout, i) {

				var src = srcs[i];

				if (src) {

					if (src.indexOf('/') !== -1) {

						latestSrc = src;

					}

				}

				_this.srcs[layout] = latestSrc;

			});

		},


		showImage: function(src) {

			var _this = this;

			this.currentSrc = src;

			if (this.NODE_NAME === 'IMG') {

				this.el.src = src;
				
				// TODO: update application
				// after changing page layout
				// this.published = true;
				// this.events.publish('update');
				// can't currently because choke up the browser
				// if too many update fire at once
				// (because they cause a reflow)
			
			} else if (this.NODE_NAME === 'DIV') {

				this.el.style.backgroundImage = 'url("' + src + '")';

				// wait for next repaint frame _after_ new src is painted
				// TODO:
				// this will still have animation problems
				// if we're transitioning the hide method,
				// then the transition will still be happening
				// when the show method is applied

				this.utils.render(function() {

					_this.show(_this.el);

				});

			}

		},

		/**
		 * once image is loaded
		 * remove event handler
		 * if this is an <img>
		 * in a grid, request a layout update
		 */
		onLoad: function() {

			if (this.domEventHandlers.load) {
				
				this.removeDomEventHandler('load');
			
			}
			
			this.imageCache.add(this.loadingImg);

			this.showImage(this.loadingImg);

		},

		/**
		 * add event handler to load image
		 */
		load: function(src) {

			this.loadingImg = src;

			this.addDomEventHandler('load', this.onLoad, this.img);

			this.img.src = src;

		},

		/**
		 * when the window is resized,
		 * check which layout we're currently at
		 * and load the appropriate image
		 */
		onResize: function(is, w, h) {

			var _this = this;

			// TODO: only load when in view
			// this.calculateThreshold(h);

			// if (this.threshold < h) {

			// 	this.inview = true;

			// 	this.queue.next();

			// }

			Object.keys(this.srcs).forEach(function(layout) {

				var src = _this.srcs[layout];

				//
				// TODO: damn, clean this up
				// 

				if (is[layout]() && src !== _this.currentSrc) {
					
					if (!_this.imageCache.contains(src)) {
						
						if (_this.NODE_NAME === 'DIV') {

							_this.hide(_this.el);
						
						}

						_this.load(src);

						// TODO: only load when in view
						// if (_this.inview) {

						// 	_this.load(src);

						// } else {

						// 	_this.queue.push(function() {

						// 		_this.load(src);
							
						// 	});
							
						// }

					
					} else {

						_this.showImage(src);

						// TODO: only load when in view
						// if (_this.inview) {

						// 	_this.showImage(src);

						// } else {

						// 	_this.queue.push(function() {

						// 		_this.showImage(src);
								
						// 	});

						// }

					}

				}

			});

		}//,

		// TODO: only load when in view
		// calculateThreshold: function(h) {

		// 	var rect = this.el.getBoundingClientRect();

		// 	this.threshold = rect.top - h;

		// },

		// TODO: only load when in view
		// /**
		//  * when the page scrolls,
		//  * determine if this image is in view or not
		//  * only load images once in view
		//  */
		// onScroll: function(top) {

		// 	if (top >= this.threshold) {

		// 		this.inview = true;

		// 		this.queue.next();

		// 	} else {

		// 		this.inview = false;
			
		// 	}

		// }

	});

})(window.target = window.target || {});
