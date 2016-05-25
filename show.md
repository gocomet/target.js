### Show component

When clicked, shows the targeted element/elements

| Property | Value |
|:---:|:---:|
| Applicable Elements: | any |
| Applicable Targets: | any |
| Attribute Value: | any valid CSS selector |

**Usage**

```html
<button data-target-show="#my-target">
	Show #my-target!
</button>
```

You can target more than one element:

```html
<div data-target-show="#my-target,.some-more-targets,body">
	Show a bunch of stuff
</div>
```