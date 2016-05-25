### Src component

The Src component responsively loads images. It must be used on an `<img>` element.

- Applicable Elements: `<img>`
- Applicable Targets: none

| Property | Value |
|:---:|:---:|
| Applicable Elements: | `<img>` |
| Applicable Targets: | none |
| Attribute Value: | mobile-layout-img-src:string tablet-layout-img-src:string desktop-layout-img-src:string |

**Usage**

```html
<img data-target-src="/some-mobile-img.jpg /my-tablet-image.jpg /a-desktop-image.gif">
```

The `data-target-src` accepts a space-separated list of 3 URLs. First, mobile; second, tablet; third, desktop. Because Src is mobile-first, you can omit URLs if you want:

```html
<img data-target-src="/some-mobile-img.jpg /my-tablet-and-desktop-image.jpg">
```

Or, pass a null argument to inherit the smaller image:

```html
<img data-target-src="/some-mobile-and-tablet-img.jpg null /my-desktop-image.jpg">
```

Or:

```html
<img data-target-src="/used-for-mobile-tablet-and-desktop.jpg">
```

The Src element doesn't add its own placeholder image, so be sure to use your own:

```html
<img src="my_blank.gif" data-target-src="/some-mobile-img.jpg /my-tablet-image.jpg /a-desktop-image.gif">
```