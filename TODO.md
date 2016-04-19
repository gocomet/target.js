
# TODO

## Bugfixes

- none currently
- will likely run into issues having to sync the css classes of, say, a toggler, to its target
- use events to transmit, say, 'toggled' events from the toggled element to the toggler

## Events

- document them

## API

- document
- clean up

## usage error messaging

- make
- document

## allow library consumers to create their own UI components

```javascript
target.addComponent = function(name, att, def) {

};
```

ex. usage

```javascript
target.addComponent('Accordion', 'data-target-accordion', {
	
	init: function() {

	}

});
```