# SearchBox

This code component provides a wrapper around the [Fluent UI SearchBox](https://developer.microsoft.com/en-us/fluentui#/controls/web/searchbox) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Properties

- **SearchText** - The action items to render. The first item is considered the root item.

- **IconName** - Name of the Fluent UI icon (see [Fluent UI Icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons)).

- **Underlined** - Whether or not the SearchBox is underlined.

- **DisableAnimation** - Whether or not to animate the SearchBox icon on focus.

- **PlaceholderText** - Placeholder for the search box.

## Additional properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps. Leaving this blank will use the default theme defined by Power Apps. See [theming](theme.md) for guidance on how to configure.
- **AccessibilityLabel** -  Screen reader aria-label

## Example

### Connecting SearchBox to a Datasource

On any dataset `Items` property (e.g., in a gallery or DetailsList controls), add the following Power Fx formula:

```powerapps-dot
Search( Accounts, SearchBox_1.SearchText, "name" )
```