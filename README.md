
# Target.js!

(This project is still in development and has no stable release as of yet. Expect bugs.)

Target.js doesn't do much. But what it does, it does well. It adds functionality to your DOM elements using data-attributes. It lets you:

- Show elements
- Hide elements
- Toggle elements
- Click away from elements to close them
- Create responsive scrollboxes
- Increment/decrement quantity boxes

_It does_ this in a declarative way:

```html
<button data-target-toggle="#a-div">
  Toggle A Div!
</button>

<div id="a-div">
  This will get toggled!
</div>
```

_It doesn't_ interfere with native browser events or functionality. It doesn't depend on jQuery - it works vanilla DOM methods, running faster.

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

## Browser Support

- IE9+
- evergreen browsers

## Usage

### 1. Include the files under `dist/` into your markup:

- mediator.min.js (target.js' only dependency -- used as the event buss)
- MutationObserver.js (a polyfill -- only include for IE9 support)
- target.js

For example:

```html
<script src="my-js-folder/mediator.min.js"></script>
<script src="my-js-folder/MutationObserver.js"></script>
<script src="my-js-folder/target.js"></script>
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

Target.js declarations don't care what type of element they're applied to

## How does Target.js show/hide elements?

Target.js is style-agnostic -- it simply adds or removes a class on the element. You can apply your beautiful styles to that class. You can also configure that class to be whatever you want.

## Configuration

You can customize Target.js so that it doesn't conflict with any of your existing CSS classes or data-attributes. You can also define your own responsive breakpoints. Breakpoints are designed mobile-first. You overwrite the defaults during initialization, like so: (I've included the default settings)

```html
<script>
	target.js({
		activeClass: 'target-active',
		attributes: {
			Toggle: 'data-target-toggle',
			Show: 'data-target-show',
			Hide: 'data-target-hide',
			Clickoff: 'data-target-clickoff',
			Increment: 'data-target-increment',
			Decrement: 'data-target-decrement',
			disable: 'data-target-disable',
			max: 'data-target-max',
			min: 'data-target-min',
			Scrollbox: 'data-target-scrollbox'
		},
		breakpoints: {
			tablet: 768,
			desktop: 1025
		},
		debounceDelay: 100
	});
</script>
```

## Components

Specific usage for each Target.js component

### Show

Shows an element

```html
<button data-target-show="#my-target">
	Show #my-target!
</button>
```

### Hide

Hides an element

```html
<button data-target-hide="#my-target">
	Hide #my-target!
</button>
```

### Toggle

Toggles an element

```html
<button data-target-toggle="#my-target">
	Toggle #my-target!
</button>
```

### Clickoff

An element will hide itself when you click away from it

```html
<div data-target-clickoff>
	Click away from me to close!
</div>
```

### Increment/Decrement

Increments or decrements the value of an input

```html
<button data-target-decrement="#qty">-</button>
<input id="qty">1</input>
<button data-target-increment="#qty">+</button>
```

Increments and decrements can have optional min and max values

```html
<button data-target-decrement="#qty" data-target-min="-10">-</button>
<input id="qty">1</input>
<button data-target-increment="#qty" data-target-max="10">+</button>
```

The default minimum value for decrementers is 0

### Scrollbox

Creates a responsive scrollbox. When the content is taller than the threshold, the element gets a scrollbar. When the content isn't, the scrollbar disappears.

```html
<div data-target-scrollbox="600">
	<p>If this content goes over 600 pixels tall, the div will get a scrollbar</p>
</div>
```

The threshold can be set relative to the window size instead by using a negative integer:

```html
<div data-target-scrollbox="-300">
	<p>If this content is within 299 pixels of the window height, a scrollbar will appear.</p>
</div>
```

As with all Target.js elements, Scrollbox updates itself on window.resize.

## Disabling elements responsively

To disable any Target.js element, use Target's disable attribute and pass it the layouts you want to disable the element on:

```html
<div data-target-toggle="#minicart" data-target-disable="mobile">
	This does nothing on mobile layouts.
</div>
```

Disable multiple layouts via a space-separated list (like CSS classes)

```html
<div data-target-toggle="#minicart" data-target-disable="mobile tablet">
	This does nothing on mobile and tablet layouts.
</div>
```

There are three layouts in total:

- mobile
- tablet
- desktop

## Coming Soon

Features on the way:

### Plugin API

Soon, you'll be able to write plugins for Target.js, to define your own Target UI elements, and hook into Target's toolset.

### Programmatic methods

Target.js is declarative by design, but you should be able to use Target's methods programmatically if you need to. For example:

```javascript
target.show('#my-element');
```

These are in the works!