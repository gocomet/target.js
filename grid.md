### Grid component

Makes elements in a row all the same height. Calculates its direct children. This doesn't replace your CSS grid; rather, it works in conjunction with it.

| Property | Value |
|:---:|:---:|
| Applicable Elements: | any |
| Applicable Targets: | none |
| Attribute Value: | mobile-layout-columns-per-row:int tablet-layout-columns-per-row:int desktop-layout-columns-per-row:int |

**Usage**

```html
<div data-target-grid="2 3 4">
	<div>Product thumbnail here</div>
	<div>Product thumbnail here</div>
	<div>Product thumbnail here (these will all have equal height)</div>
	<div>Product thumbnail here</div>
	<div>Product thumbnail here</div>
	<div>Product thumbnail here</div>
	<div>Product thumbnail here (these will all have equal height)</div>
	<div>Product thumbnail here</div>
</div>
```

Provide a space-separated list of columns per row. In the above example, there are 2 columns per row on mobile, 3 columns per row on tablet, and 4 columns per row on desktop.

An example using Foundation's grid presentational classes:

```html
<div class="row" data-target-grid="2 3 4">
	<div class="column small-6 medium-4 large-3">Product thumbnail here</div>
	<div class="column small-6 medium-4 large-3">Product thumbnail here</div>
	<div class="column small-6 medium-4 large-3">Product thumbnail here (these will all have equal height)</div>
	<div class="column small-6 medium-4 large-3">Product thumbnail here</div>
	<div class="column small-6 medium-4 large-3">Product thumbnail here</div>
	<div class="column small-6 medium-4 large-3">Product thumbnail here</div>
	<div class="column small-6 medium-4 large-3">Product thumbnail here (these will all have equal height)</div>
	<div class="column small-6 medium-4 large-3">Product thumbnail here</div>
</div>
```

**Disabling the Grid**

You can disable the Grid responsively, like you could any other Target.js element:

```html
<div data-target-grid="1 2 3" data-target-disable="mobile">...</div>
```

Alternatively, you can disable using a shortcut:

```html
<div data-target-grid="disable 2 3">...</div>
```