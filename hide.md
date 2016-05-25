### Hide component

When clicked, hides the targeted element/elements

| Property | Value |
|:---:|:---:|
| Applicable Elements: | any |
| Applicable Targets: | any |
| Attribute Value: | any valid CSS selector |

**Usage**

```html
<button data-target-hide="#my-target">
	Hide #my-target!
</button>
```

You can target more than one element:

```html
<div data-target-show="#my-target,.some-more-targets,body">
	Hide a bunch of stuff
</div>
```