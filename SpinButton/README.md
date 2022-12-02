# SpinButton

This code component provides a wrapper around the [Fluent UI Spinbutton](https://developer.microsoft.com/en-us/fluentui#/controls/web/spinbutton) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Properties

- **Label** - Descriptive label for the control.

- **IconName** - Name of the Fluent UI icon (see [Fluent UI Icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons)).

- **Min** - Max value of the control. If not provided, the control has no maximum value.

- **Max** - Min value of the control. If not provided, the control has no minimum value.

- **Step** - Difference between two adjacent values of the control. This value is used to calculate the precision of the input if no precision is given. The precision calculated this way will always be >= 0.

- **Value** - Current value of the control.

- **Suffix** - Suffix to define any unit, e.g. cm, kg, ml

## Additional properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps. Leaving this blank will use the default theme defined by Power Apps. See [theming](theme.md) for guidance on how to configure.
- **AccessibilityLabel** -  Screen reader aria-label

## Example

### Connecting SpinButton to a Edit Form control

1. Unlock the data card
1. Hide the default control for the field
1. Add the SpinButton into the field
1. Update the `Update` property to reference the SpinButton.Value

```powerapps-dot
Search( Accounts, SearchBox_1.SearchText, "name" )
```