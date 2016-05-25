
# Target.js!

>(Target.js is in active development -- expect a lot of bugs, a lot of changes, and a lot of features to come!)

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

### 1. Include the files under `dist/` from your markup:

- `proto.es5.js` (a target.js dependency -- used for object inheritance)
- `mediator.min.js` (a target.js dependency -- used as the event buss)
- `weakmap.js` (a polyfill -- only include for IE9 support)
- `MutationObserver.js` (a polyfill -- only include for IE9 support)
- `target.js`

For example:

```html
<script src="my-js-folder/proto.es5.js"></script>
<script src="my-js-folder/mediator.min.js"></script>
<script src="my-js-folder/weakmap.js"></script>
<script src="my-js-folder/MutationObserver.js"></script>
<script src="my-js-folder/target.js"></script>
```

or:

```html
<script src="my-js-folder/target.bundled.js"></script>
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

## How does Target.js show/hide elements?

Target.js is style-agnostic -- it simply adds or removes a class on the element. You can apply your beautiful styles to that class. You can also configure that class to be whatever you want.

## Configuration

You can customize Target.js so that it doesn't conflict with any of your existing CSS classes or data-attributes. You can also define your own responsive breakpoints. Breakpoints are designed mobile-first. You overwrite the defaults during initialization, like so: (I've included the default settings)

```html
<script>
	target.init({
		activeClass: 'target-active',
		attributes: {
			Toggle: 'data-target-toggle',
			Show: 'data-target-show',
			Hide: 'data-target-hide',
			Clickoff: 'data-target-clickoff',
			Increment: 'data-target-increment',
			Decrement: 'data-target-decrement',
			Scrollbox: 'data-target-scrollbox',
			Grid: 'data-target-grid',
			disable: 'data-target-disable',
			max: 'data-target-max',
			min: 'data-target-min',
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

>Fun fact: most Target.js components don't care what type of element they're applied to. However, some declarations do care.

Components:

- [Show](show.md)
- [Hide](hide.md)
- [Toggle](toggle.md)
- [Clickoff](clickoff.md)
- [Increment/Decrement](increment-decrement.md)
- [Scrollbox](scrollbox.md)
- [Grid](grid.md)
- [Src](src.md)

## Two-way Event Bind

Target.js components have a two-way bind, using events, with their targeted element. For example, when an element is shown by a Target.js component, that component element will also receive an active state.

For example:

```html
<button data-target-toggle="#menu">
	Menu
</button>

<div id="#menu">
	Menu Stuff here
</div>
```

In the above example, when the button is clicked, this will be the result:

```html
<button data-target-toggle="#menu" class="target-active">
	Menu
</button>

<div id="#menu" class="target-active">
	Menu Stuff here
</div>
```

Let's add another element that can close the menu:

```html
<button data-target-toggle="#menu" class="target-active">
	Menu
</button>

<div id="#menu" class="target-active">
	<button data-target-hide="#menu">x</button>
	Menu Stuff here
</div>
```

When our new close button is clicked, the original toggle button will also go back to its original state

```html
<button data-target-toggle="#menu">
	Menu
</button>

<div id="#menu">
	<button data-target-hide="#menu">x</button>
	Menu Stuff here
</div>
```

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

## Events

Target.js fires events you can hook into when its elements do things. Following the mediator.js conventions, you "subscribe" to events.

### show

The "show" event is fired when an element is shown or toggled on.

**Example**

```html
<script>
target.events.subscribe('show', function(el) {
	console.log(el, ' has been shown');
});
</script>
```

### hide

The "hide" event is fired when an element is hidden or toggled off.

**Example**

```html
<script>
target.events.subscribe('hide', function(el) {
	console.log(el, ' has been hidden');
});
</script>
```

### min

The "min" event is fired when an input has reached its minimum value

**Example**

```html
<script>
target.events.subscribe('min', function(input) {
	console.log(input, ' is at its minimum value: ' + input.value);
});
</script>
```

### max

The "max" event is fired when an input has reached its maximum value

**Example**

```html
<script>
target.events.subscribe('max', function(input) {
	console.log(input, ' is at its maximum value: ' + input.value);
});
</script>
```

## Methods

Target.js is declarative by nature, designed so you don't need to use JS at all. But, you may want to! You can use target.js's static methods to hook into Target.js programmatically.

### target.api.show

- Shows an element using Target.js' active CSS class.
- fires a "show" event for each element shown, passing the element as the only argument
- activates an active state on any Target.js element that references the shown element

**Usage**

`target.api.show(<element:DOMElement> or <list:NodeList> or <selector:string>)`

Accepts 1 argument: either a DOM Element, an array of DOM Elements, or a CSS selector

**Examples**

```html
<script>
target.api.show('#my-modal');
</script>
```

or

```html
<script>
var myModal = document.getElementById('my-modal');
target.api.show(myModal);
</script>
```

or 

```html
<script>
var modals = document.querySelectorAll('.modals');
target.api.show(modals);
</script>
```

or

```html
<script>
target.api.show('.modals');
</script>
```

etc.

### target.api.hide

- Hides an element using Target.js' active CSS class.
- fires a "hide" event for each element hidden, passing the element as the only argument
- deactivates the active state on any Target.js element that references the hidden element

**Usage**

`target.api.hide(<element:DOMElement> or <list:NodeList> or <selector:string>)`

Accepts 1 argument: either a DOM Element, an array of DOM Elements, or a CSS selector

**Examples**

```html
<script>
target.api.hide('#my-modal');
</script>
```

or

```html
<script>
var myModal = document.getElementById('my-modal');
target.api.hide(myModal);
</script>
```

or 

```html
<script>
var modals = document.querySelectorAll('.modals');
target.api.hide(modals);
</script>
```

or

```html
<script>
target.api.hide('.modals');
</script>
```

etc.

### target.api.toggle

- Toggles an element using Target.js' active CSS class.
- fires either a "show" or "hide" event for each element toggled, passing the element as the only argument
- activates an active state on any Target.js element that references the shown element

**Usage**

`target.api.toggle(<element:DOMElement> or <list:NodeList> or <selector:string>)`

Accepts 1 argument: either a DOM Element, an array of DOM Elements, or a CSS selector

**Examples**

```html
<script>
target.api.toggle('#my-modal');
</script>
```

or

```html
<script>
var myModal = document.getElementById('my-modal');
target.api.toggle(myModal);
</script>
```

or 

```html
<script>
var modals = document.querySelectorAll('.modals');
target.api.toggle(modals);
</script>
```

or

```html
<script>
target.api.toggle('.modals');
</script>
```

### target.api.get

Return an instance of a Target.js component

Accepts 1 argument: a CSS selector targeting one element, or a DOM element

>NOTE: the element _must_ already be a target.js component (it must have a target.js data-attribute on it)

**Usage**

`var minicartToggle = target.api.get('#minicart-toggle');`

Using the `get` method will give you access to all of a Component's public methods:

`minicartToggle.disable();`
`minicartToggle.enable();`

etc.

## Coming Soon

Features on the way:

### Plugin API

Soon, you'll be able to write plugins for Target.js, to define your own Target UI elements, and hook into Target's DOM observation and responsive toolset.
