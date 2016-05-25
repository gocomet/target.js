### Toggle component

Toggles an element

| Property | Value |
|:---:|:---:|
| Applicable Elements: | any |
| Applicable Targets: | any |
| Attribute Value: | any valid CSS selector |

**Usage**

```html
<button data-target-toggle="#my-target">
	Toggle #my-target!
</button>
```

You can target more than one element:

```html
<div data-target-show="#my-target,.some-more-targets,body">
	Toggle a bunch of stuff
</div>
```