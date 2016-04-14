/**
 *
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
;((target, undefined) => {
	
	'use strict';

	target.Src = class TargetSrc extends target.UI {
	
		constructor(el, _id, target, name) {
	
			super(el, _id, target, name);

			this.srcs = {
				mobile: '',
				tablet: '',
				desktop: ''
			};

			this.getSrcs();	
		
			this.addEventHandler('resize.window', this.onResize);

			// request an update from target.Window
			this.events.publish('update.ui');

			// TODO: bugfix -- being initialized twice
			console.log(this);
		
		}

		/**
		 * get list of image urls from element attribute
		 * loop through and assign each image to a layout
		 * make mobile-first,
		 * so that if a layout doesn't have an image explicity assigned
		 * it will inherit the image from the next layout down
		 *
		 * ex. if only two images defined, desktop layout can inherit image from tablet layout
		 */
		getSrcs() {

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

		}

		/**
		 * when the window is resized,
		 * check which layout we're currently at
		 * and load the appropriate image
		 */
		onResize(is) {

			var _this = this;

			Object.keys(this.srcs).forEach(function(layout) {


				if (is[layout]()) {

					_this.el.src = _this.srcs[layout];

				}

			});

		}

	};

})(window.target = window.target || {});