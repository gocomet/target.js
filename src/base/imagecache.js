// utility object for tracking which images are already cached
// track localStorage to prevent bug
// in which an image stored in cache
// would not be loaded
// because target will try to load it and wait for onload event
// but browser will not load cached images
import utils from '../core/utils';

const CACHE_NAME = 'targetJsImgsLoaded';

let imageCache = {
  
  init() {

    if (!utils.isIOS && localStorage && localStorage[CACHE_NAME]) {

      this.images = localStorage[CACHE_NAME];

    } else {

      this.images = '';

    }

    this.img = document.createElement('img');
  
  },

  contains(item) {
  
    return this.images.indexOf(item) !== -1;

  },

  add(item) {

    if (!this.contains(item)) {

      this.images += item;

    }
    
    if (!utils.isIOS && localStorage) {

      localStorage[CACHE_NAME] = this.images;

    }

  }

}

imageCache.init();

module.exports = imageCache;
