# Auto Width Label code component

This code component acts similar to the standard canvas app label, but will expand dynamically in width to accommodate the text. This functionality is currently not supported in canvas apps today.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

### Text Properties

- **Text** - The text value of the label.

### Style Properties

- **Padding Left** - The padding to add inside the label.
- **Padding Right** - The padding to add inside the label.
- **Padding Top** - The padding to add inside the label.
- **Padding Bottom** - The padding to add inside the label.


### State Dependent Style Properties

Not all combinations of style/state are implemented by every component.
The Resizable text area has the following style properties:

|                 | Normal           | Hover                  | Focused                | Disabled              | Disabled : hover |
| --------------- | ---------------- | ---------------------- | ---------------------- | --------------------- | ---------------- |
| **Text Font**   |                  |                        |                        |                       |                  |
| Name            | Font Name        |                        |                        |                       |                  |
| Size            | Font Size        |                        |                        |                       |                  |
| Font size units | Font Size Units  |                        |                        |                       |                  |
| Color           | Font Color       | Hover Font Color       | Focus Font Color       | Disabled Font Color   |                  |
| Weight          | Font Weight      | Hover Font Weight      | Focus Font Weight      | Disabled Font Weight  |                  |
| **Fill**        |                  |                        |                        |                       |                  |
| Color           | Fill Color       | Hover Fill Color       | Focus Fill Color       | Disabled Fill Color   |                  |
| **Border**      |                  |                        |                        |                       |                  |
| Color           | Border Color     | Hover Border Color     | Focus Border Color     | Disabled Border Color |                  |
| Thickness       | Border Thickness | Hover Border Thickness | Focus Border Thickness |                       |                  |
| Radius          | Border Radius    |                        |                        |                       |                  |
| Style           |                  |                        |                        |                       |                  |

### General Properties

- **Auto Width** (output) - The width set by the component to accommodate the text.

## Design challenges

The following are items of note that were encountered when creating this component:

#### Configurable pseudo styles 

Under many circumstances, code components have fixed or limited style capabilities. This code component has a large number of configurable styles similar to the native controls. Because of this, CSS pseudo styles for hover/focus/disabled cannot be used, and instead must be manually set using focus/mouse over events. If this component was a React component, this would be made easier using style classes.

#### OnSelect event

The standard label control raises the `OnSelect` event when clicked (if enabled). Since the `AutoWidthLabel` is a field control, there is no way of calling the `openDatasetItem` method (that in turn raises `OnSelect`) since this is only available on Dataset properties.

The `OnChange` event could be used, however this would collide with the `AutoWidth` property, and since there is not always a one-to-one match with every `notifyOutputChange`-`getOutputs`-`OnChange` (rate limited for performance), some complex Power FX expressions would be needed to check to see if the Event type had changed since the last `OnChange`, with some random element. This would not be idea.

Currently - this challenge is unresolved.

## Unsupported techniques

The following items are considered unsupported techniques at this time and will be removed once the platform allows:

#### Non-zero tab index in canvas apps

When canvas apps (not custom pages) add html controls such as buttons and inputs to the DOM, it assigns a non-zero `tabindex`. E.g.:

```html
<button class="appmagic-button-container no-focus-outline" tabindex="15"...>
```

The result is that if html elements are added by code components without a non-zero `tabindex` assigned, they will not be set focus in the correct order when using keyboard tabbing.

To overcome this, there is an undocumented property that can be read inside the code component provided by the context:

```typescript
const assignedTabIndex = (context as any).accessibility?.assignedTabIndex ?? 0;
```

**Note:** The context is cast to `any` (or an extended Context type) to allow reading of the accessibility property.

This technique is not needed in model-driven apps/custom pages, and the `tabindex` is not set on the `textarea` control.

#### Tooltips in canvas apps

When a code component is added to a canvas app, a tooltip can be set in the same way as a standard Label control. This tooltip cannot be read using the  standard documented types. Instead, an undocumented property can be used:

```typescript
const accessibleLabel = (context as any).accessibility?.assignedTooltip ?? "";
```

**Note:** The context is cast to any (or an extended Context type) to allow reading of the accessibility property.
