# SearchBox

This code component provides a wrapper around the [Fluent UI SearchBox](https://developer.microsoft.com/en-us/fluentui#/controls/web/searchbox) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Properties

- **SearchText** - Text that is input by the user. Refer to this as the input for search functions. 

- **IconName** - Name of the Fluent UI icon (see [Fluent UI Icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons)).

- **Underlined** - Whether or not the SearchBox is underlined.

- **DisableAnimation** - Whether or not to animate the SearchBox icon on focus.

- **PlaceholderText** - Placeholder for the search box.

## Additional properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps. Leaving this blank will use the default theme defined by Power Apps. See [theming](theme.md) for guidance on how to configure.

- **AccessibilityLabel** -  Screen reader aria-label

- **InputEvent** - An event to send to the control. E.g. `SetFocus`.

### Setting Focus on the control

When a new dialog is shown, and the default focus should be on the control, an explicit set focus will be needed.

To make calls to the input event, you can set a context variable that is bound to the Input Event property to a string that starts with `SetFocus` and followed by a random element to ensure that the app detects it as a change.

E.g.

```vb
UpdateContext({ctxResizableTextareaEvent:"SetFocus" & Text(Rand())}));
```

## Example

### Connecting SearchBox to a Datasource

On any dataset `Items` property (e.g., in a gallery or DetailsList controls), add the following Power Fx formula:

```powerapps-dot
Search( Accounts, SearchBox_1.SearchText, "name" )
```