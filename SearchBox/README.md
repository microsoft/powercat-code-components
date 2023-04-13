# SearchBox

This code component provides a wrapper around the [Fluent UI SearchBox](https://developer.microsoft.com/en-us/fluentui#/controls/web/searchbox) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Properties

- **Search Text** - Use this property to get or set value for the control.

- **Icon Name** - Name of the Fluent UI icon (see [Fluent UI Icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons)).

- **Underlined** - Whether or not the SearchBox is underlined.

- **Disable Animation** - Whether or not to animate the SearchBox icon on focus.

- **Placeholder Text** - Placeholder for the search box.

- **Delay Output** - To delay output by half a second. Useful when input is provided frequently within short duration.

## Additional properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps. Leaving this blank will use the default theme defined by Power Apps. See [theming](theme.md) for guidance on how to configure.
- **AccessibilityLabel** -  Screen reader aria-label

## Example

### Connecting SearchBox to a Datasource

On any dataset `Items` property (e.g., in a gallery or DetailsList controls), add the following Power Fx formula:

```powerapps-dot
Search( Accounts, SearchBox_1.SearchText, "name" )
```