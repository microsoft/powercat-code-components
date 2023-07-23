# Facepile

This code component provides a wrapper around the [Fluent UI Facepile](https://developer.microsoft.com/en-us/fluentui#/controls/web/facepile) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

- **Value** - Current value of the text field.

- **Prefix** - Prefix displayed before the text field contents. This is not included in the value. Ensure a descriptive label is present to assist screen readers, as the value does not include the prefix.

- **Suffix** - Suffix displayed after the text field contents. This is not included in the value. Ensure a descriptive label is present to assist screen readers, as the value does not include the suffix.

- **ErrorMessage** - Static error message displayed below the text field. 

- **MaskFormat** - An object defining the format characters and corresponding regexp values. Default format characters: { '9': /[0-9]/, 'a': /[a-zA-Z]/, '*': /[a-zA-Z0-9]/ }

- **Mask** - The masking string that defines the mask's behavior. A backslash will escape any character. Special format characters are: '9': [0-9] 'a': [a-zA-Z] '*': [a-zA-Z0-9]

- **DelayOutput** -  To delay output by half a second. Useful when input is provided frequently within short duration.

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps. Leaving this blank will use the default theme defined by Power Apps. See [theming](theme.md) for guidance on how to configure.

- **AccessibilityLabel** - Screen reader aria-label

### Style Properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.

- **AccessibilityLabel** - Screen reader aria-label

### Event Properties

- **InputEvent** - An event to send to the control. E.g. `SetFocus`. See below.

### Setting Focus on the control

When a new dialog is shown, and the default focus should be on the control, an explicit set focus will be needed.

To make calls to the input event, you can set a context variable that is bound to the Input Event property to a string that starts with `SetFocus` and followed by a random element to ensure that the app detects it as a change.

E.g.

```vb
UpdateContext({ctxResizableTextareaEvent:"SetFocus" & Text(Rand())}));
```

The context variable `ctxResizableTextareaEvent` would then be bound to the property `Input Event` property.

## Usage

Use the mask to define the format of the allowed input text, where placement of the `*` character allows any of the characters defined in the mask format.

Use regular expressions (regex) to define allowed characters in the mask format. By default the mask format field has a regex that covers most common characters used, but you can refine the regex value to meet your needs. Learn more about [regular expressions](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference).

## Examples

### Phone number

Use the following property values to achieve a phone number format. Use the prefix column to display a country code (could be provided as a separate dropdown).

|Property|Value|
|-|-|
|`Mask`|`***-***-****` or `(***) ***-****`|
|`Mask Format`|`[\d]` or `[0-9]` |
|`Prefix`| `+1` |

### Email address

Use the following property values to only allow alphanumeric characters and the `@` and period symbols.

|Property|Value|
|-|-|
|`Mask`|`Concat(Sequence(20),"*")` for fixed number of characters (20), or `Concat(Sequence(Len(Self.Value)+1),"*")` for any number of characters |
|`Mask Format`|`[\d\w@.]` |