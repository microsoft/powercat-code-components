# Keyboard Shortcuts code component

This code component registers Key Press event handlers to allow keyboard short cuts to be used inside canvas apps or custom pages. It is not intended for use in model-driven or portal apps.

**Note:** Some keyboard shortcuts are used by Power Apps when using maker studio, and some are used by the browser. For this reason, this component will not work for all keyboard shortcuts until the user places focus inside the app.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The Keyboard Shortcuts code component has the following properties:

- `KeyConfig` (bound) - An array of strings indicating which keyboard short cuts to listen for. The string must be serialized using JSON (see below).
- `OnKey` (output) - The keyboard key code that was detected.

After adding the Keyboard Shortcuts code component to the form, configure the `KeyConfig` property with an  array of key combinations.

E.g.

```json
["alt + r","alt + a","alt + d","alt + b","alt + p","alt + l","alt + t","alt + k"]
```

See [the KeyboardJS library](http://itsgreggreg.github.io/KeyboardJS/) for more information on the keyboard combination strings.

## Responding to the key press events

When a key combination is used, the `OnChange` event is raised. The `OnKey` property then holds the combination.

You could have an `OnChange` event similar to:

```vb
If(Self.OnKey="alt + a",SetFocus(txtTextbox1));
If(Self.OnKey="alt + r",UpdateContext({ctxResizableTextareaEvent:"SetFocus" & Text(Rand())}));
If(Self.OnKey="alt + b",SetFocus(txtTextbox2));
If(Self.OnKey="alt + k",UpdateContext({ctxPickerEvent:"SetFocus" & Text(Rand())}));
If(Self.OnKey="alt + d",UpdateContext({ctxDropdownEvent:"SetFocus" & Text(Rand())}));
If(Self.OnKey="alt + l",UpdateContext({ctxTagListEvent:"SetFocus" & Text(Rand())}));
If(Self.OnKey="alt + t",UpdateContext({ctxTableEvent:"SetFocusOnRow" & Text(Rand())}));
```

This event handler sets focus on various controls given the key combination used.

## Style Properties

The Keyboard Shortcuts code component has no style properties since it has no user interface.

## Design challenges

#### Keep recently visited screens in memory

When the **Keep recently visited screens in memory** setting is enabled inside canvas apps, the code components from previous screens will not be destroyed when the next screen is shown. Additionally, the destroy of the previous component my occur after the `init` of the next screen when this setting is off. For this reason, the code component must not remove the global keypress event listeners between component instantiation/destruction. To this end, the component never calls the `keyboardJS.stop()` method.

## Unsupported techniques

The following items are considered unsupported techniques at this time and will be removed once the platform allows:

#### DOM global event key press handlers

The `KeyboardJS` library adds a set of global event listeners to the document object in the browser. This is technically not supported, since code components are not meant to affect the DOM outside of the container element that they are provided.
