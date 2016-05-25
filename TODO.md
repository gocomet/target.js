
# TODO

## Bugfixes

- none currently

## Restructure documenation

Move from README into own page/site

Sections:

- Installation
- Configuration
- Components
- Layouts
- Events
- Methods
	- Component instances
- Plugins (eventually)

## Events

- documentation

## API

- documentation

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