
# Target.js!

>(Target.js is in active development -- expect changes and features to come!)

Target.js doesn't do much. But what it does, it does well. It adds functionality to your DOM elements using data-attributes. It lets you:

- show/hide/toggle elements
- click away from elements to close them
- create responsive scrollboxes
- responsively load images
- increment/decrement quantity boxes
- give your thumbnails equal heights

_It does_ this in a declarative way:

```html
<button data-target-toggle="#a-div">
  Toggle a div!
</button>

<div id="a-div">
  This will get toggled!
</div>
```

_It doesn't_ interfere with native browser events or functionality. It doesn't depend on jQuery - it uses vanilla DOM methods, running faster.

Target.js is designed to give you JS functionality without having to write any JavaScript - just include declarations in your HTML markup, and off you go!

## This is pretty simple stuff. Why not just slap in a few lines of jQuery instead?

You could easily write piecemeal code to show/hide/toggle/etc elements, but Target.js does some really powerful things under the hood to make your life _really_ easy:

### 1. Truly responsive functionality

Target.js elements can change their behaviour depending on the screen size (you can configure your breakpoints): for example, let's say you have a cart button. On desktop and tablet, you want the cart button to toggle the minicart. But, on mobile, you want that cart button to link directly to the cart page. Using target.js, you need zero JS!

```html
<a href="/cart" data-target-toggle="#minicart" data-target-disable="mobile">
	Cart
</a>
```

In the above example, the link will toggle the `#minicart` element, but on mobile, target.js functionality will disable on that element, and will fallback to default functionality, linking to `/cart`.

Target.js handles screen resizes in realtime. So, as you adjust your screen size, Target.js will update the behaviour of its elements.

### 2. Realtime DOM reactivity

Adding some attributes on elements is all well and good, but things are never that simple. What if you need to load in elements via AJAX? What if you're creating elements via a JS templating system like Handlebars?

Target.js watches the DOM for changes: if a new element is introduced with one of Target.js' data-attributes, it will automatically initialize it. That means you can swap target elements in and out of your page anyway you want, and they will _just work_.

### 3. Event-driven communication

Target.js elements and their targets communicate with each other via events; this results in a two-way state bind, so that if a target is shown, the element that shows it also gets an active state.

## Browser Support

- IE9+
- evergreen browsers

## Usage

### 1. Include target.js (or target.min.js) from your markup.

For example:

```html
<script src="my-js-folder/target.js"></script>
```

or:

```html
<script src="my-js-folder/target.min.js"></script>
```

### 2. Initialize Target.js

```html
<script>
	target.init();
</script>
```

### 3. Declare Target.js elements

```html
<div data-target-scrollbox="400">
	This is a responsive scrollbox!
</div>

<div data-target-clickoff>
	Click away from this element to close!
</div>
```

### 4. Add styles

```css
.minicart {
	display: none;
}

.minicart.target-active {
	display: block;
}
```

### Get Started

Head on over to <a href="//gocomet.github.io/target.js/docs.html">the documentation</a> for installation, configuration, and usage!
