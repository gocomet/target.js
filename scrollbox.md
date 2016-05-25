### Scrollbox

Creates a responsive scrollbox. When the content is taller than the threshold, the element gets a scrollbar. When the content isn't, the scrollbar disappears.

| Property | Value |
|:---:|:---:|
| Applicable Elements: | any block-display element |
| Applicable Targets: | none |
| Attribute Value: | height:int |

**Usage**

```html
<div data-target-scrollbox="600">
	<p>If this content goes over 600 pixels tall, the div will get a scrollbar</p>
</div>
```

If the integer is negative, the threshold will be set relative to the window size:

```html
<div data-target-scrollbox="-300">
	<p>If this content is within 299 pixels of the window height, a scrollbar will appear.</p>
</div>
```

As with all Target.js elements, Scrollbox updates itself on window.resize.