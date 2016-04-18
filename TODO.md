
# TODO

## Bugfixes

- none currently
- will likely run into issues having to sync the css classes of, say, a toggler, to its target

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

## allow for programmatic methods as well

```javascript
target.show('#blue-div');
```

## add dynamic element generation button in demo page

```javascript
;(function(undefined) {
	'use strict';

	var addBtn = document.getElementById('#add-button');

	addBtn.addEventListener('click', function() {

		var button = document.createElement('button');

		button.id = 'hey-friend';
		button.innerHTML = 'dynamic button: hides blue, shows green';
		button.setAttribute('data-target-hide', '#blue-div');
		button.setAttribute('data-target-show', '#green-div');

		document.body.appendChild(button);
	
	});
	
})();
```