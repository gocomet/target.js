### Increment/Decrement components

Increments or decrements the value of an input. Targeted element must be an `<input>` element.

| Property | Value |
|:---:|:---:|
| Applicable Elements: | any |
| Applicable Targets: | `<input>` |
| Attribute Values: | CSS selector targeting one `<input>` element |

**Usage**

```html
<button data-target-decrement="#qty">-</button>
<input id="qty">1</input>
<button data-target-increment="#qty">+</button>
```

Increments and decrements can have optional min and max values

```html
<button data-target-decrement="#qty" data-target-min="-10">-</button>
<input id="qty">1</input>
<button data-target-increment="#qty" data-target-max="10">+</button>
```

- The default minimum value for decrementers is 0
- There is no default maximum value