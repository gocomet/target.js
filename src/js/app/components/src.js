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
	var CACHE_NAME = 'targetImgsLoaded';
	var imageCache = {
		contains: function(item) {
			return this.images.indexOf(item) !== -1;
		},
		add: function(item) {
			this.images += item;
			if (localStorage) {
				localStorage[CACHE_NAME] = this.images;
			}
		},
		init: function() {
			if (localStorage && localStorage[CACHE_NAME]) {
				this.images = localStorage[CACHE_NAME];
			} else {
				this.images = '';
			}
		}
	};
	imageCache.init();

	target.Src = target.UI.extend({
	
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);

			if (this.NODE_NAME !== 'IMG' && this.NODE_NAME !== 'DIV') {

				throw 'Target.js Error on Src component: "' + this.utils.stripBrackets(this.config.attributes.Src) + '" must be applied to an <img> or <div> element';
			
			}

			this.srcs = {
				mobile: '',
				tablet: '',
				desktop: ''
			};

			this.getSrcs();

			this.img = document.createElement('img');

			this.imageCache = imageCache;
		
			this.addEventHandler('resize', this.onResize);

			// request an update from target.Window
			this.events.publish('update');
		
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

			if (this.NODE_NAME === 'IMG') {

				this.el.src = src;
			
			} else if (this.NODE_NAME === 'DIV') {

				this.el.style.backgroundImage = 'url("' + src + '")';

			}

		},

		/**
		 * once image is loaded,
		 * request a layout update
		 * and remove event handler
		 */
		onLoad: function() {

			this.removeDomEventHandler('load');
			
			this.imageCache.add(this.loadingImg);

			this.showImage(this.loadingImg);

			this.events.publish('update');

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
		onResize: function(is) {

			var _this = this;

			Object.keys(this.srcs).forEach(function(layout) {

				var src = _this.srcs[layout];

				if (is[layout]()) {
					
					if (!_this.imageCache.contains(src)) {
						
						_this.load(src);
					
					} else {

						_this.showImage(src);

					}

				}

			});

		}

	});

})(window.target = window.target || {});
