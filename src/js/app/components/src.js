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

			this.loaded = {
				mobile: false,
				tablet: false,
				desktop: false
			};

		
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


		showImage: function(img) {

			if (this.NODE_NAME === 'IMG') {

				this.el.src = img;
			
			} else if (this.NODE_NAME === 'DIV') {

				this.el.style.backgroundImage = 'url("' + img + '")';

			}

		},

		/**
		 * once image is loaded,
		 * request a layout update
		 * and remove event handler
		 */
		onLoad: function() {

			this.removeDomEventHandler('load');
			
			this.showImage(this.loadingImg);

			this.events.publish('update');

		},

		/**
		 * add event handler to load image
		 */
		load: function(img) {

			this.loadingImg = img;

			this.addDomEventHandler('load', this.onLoad, this.img);

			this.img.src = img;

		},

		/**
		 * when the window is resized,
		 * check which layout we're currently at
		 * and load the appropriate image
		 */
		onResize: function(is) {

			var _this = this;

			Object.keys(this.srcs).forEach(function(layout) {

				var img = _this.srcs[layout];

				if (is[layout]()) {
					
					if (!_this.loaded[layout]) {
						
						_this.loaded[layout] = img;
						
						_this.load(img);
					
					} else {

						_this.showImage(img);

					}

				}

			});

		}

	});

})(window.target = window.target || {});
