
# TODO

## Improvements

- automatically disable callbacks from within addDomEventHandler
- performance - hook into requestAnimationFrame before making DOM changes?
- error messaging from every component on incorrect initialization

## Bugfixes

- examine and fix current Clickoff bug

## Examples

- create and document

## usage error messaging

- make
- document

## allow library consumers to create their own UI components

```javascript
target.define('ComponentName', 'data-target-component', {
	init: function() {

	},

	customMethod: function() {

	}
});
```