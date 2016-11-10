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

import utils from '../core/utils';
import UI from '../base/ui';
import imageCache from '../base/imagecache';

class Src extends UI {

	constructor(el, _id, name, events, config) {

		super(el, _id, name, events, config);

		if (this.NODE_NAME !== 'IMG' && this.NODE_NAME !== 'DIV') {

			throw 'Target.js Error on Src component: "' + this.config.attributes.Src + '" must be applied to an <img> or <div> element';
		
		}

		this.published = false;

		this.isLoading = false;

		// TODO: only load when in view
		// this.inview = false;
		// this.queue = target.Queue.create();

		this.getSrcs();

		this.imageCache = imageCache;
		this.img = this.imageCache.img;
	
		this.addEventHandler('resize', this.onResize);
		this.addEventHandler('resize' + this.id, this.onResize);
		// TODO: only load when in view
		//this.addEventHandler('scroll', this.onScroll);

		// request an update from target.Window
		this.update();
	
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

		let srcAtt = this.el.getAttribute(this.config.attributes.Src);
		let srcs = srcAtt.split(' ');
		let latestSrc = null;

		this.srcs = {
			
			mobile: '',
			tablet: '',
			desktop: '',
			large: ''
		
		};

		this.currentSrc = '';

		Object.keys(this.srcs).forEach((layout, i) => {

			let src = srcs[i];

			if (src && src.indexOf('/') !== -1) {

				latestSrc = src;

			}

			this.srcs[layout] = latestSrc;

		});

	}

	showImage(src) {

		this.currentSrc = src;

		if (this.NODE_NAME === 'IMG') {

			this.el.src = src;
		
		} else if (this.NODE_NAME === 'DIV') {

			this.el.style.backgroundImage = 'url("' + src + '")';

			this.show(this.el);

		}

	}

	/**
	 * once image is loaded
	 * remove event handler
	 * if this is an <img>
	 * in a grid, request a layout update
	 */
	onLoad() {

		if (this.domEventHandlers.load) {
			
			this.removeDomEventHandler('load');
		
		}

		if (this.isLoading) {

			this.isLoading = false;

		}
		
		this.imageCache.add(this.loadingImg);

		this.showImage(this.loadingImg);

	}

	/**
	 * add event handler to load image
	 */
	load(src) {

		this.isLoading = true;

		this.loadingImg = src;

		this.addDomEventHandler('load', this.onLoad, this.img);

		this.loadingFallback = setTimeout(() => {

			if (this.isLoading) {

				this.onLoad();

				clearTimeout(this.loadingFallback);

			}

		}, 5000);

		this.img.src = src;

	}

	/**
	 * when the window is resized,
	 * check which layout we're currently at
	 * and load the appropriate image
	 */
	onResize(is, w, h) {

		Object.keys(this.srcs).forEach(layout => {

			let src = this.srcs[layout];

			if (is[layout] && src !== this.currentSrc) {
				
				if (!this.imageCache.contains(src)) {
					
					if (this.NODE_NAME === 'DIV') {

						this.hide(this.el);
					
					}

					this.load(src);
				
				} else {

					this.showImage(src);

				}

			}

		});

	}

}

module.exports = Src;
