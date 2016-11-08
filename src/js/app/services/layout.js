/**
 * Layout
 *
 * provide convenient syntax
 * for determining layout of page
 * used only by Window
 */
class Layout {
  
  constructor(refObj, breakpoints) {
  
    this.refObj = refObj;
    this.breakpoints = breakpoints;
  
  }
  
  get mobile() {

    return this.refObj._w < this.breakpoints.tablet;

  }

  get tablet() {

    return this.refObj._w >= this.breakpoints.tablet && this.refObj._w < this.breakpoints.desktop;

  }

  get desktop() {

    return this.refObj._w >= this.breakpoints.desktop;

  }

  get large() {

    return this.refObj._w >= this.breakpoints.large

  }

}

module.exports = Layout;
