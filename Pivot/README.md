# Pivot

This code component wraps the [Fluent Pivot control](https://developer.microsoft.com/en-us/fluentui#/controls/web/pivot) for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

- **RenderType** - The type of control to render as.
  - **Pivot Tabs** - See [See Fluent UI Pivot Tabs](https://developer.microsoft.com/en-us/fluentui#/controls/web/pivot)
- **SelectedKey** - The key to select. This will be updated via the **OnChange** event when the user interacts with the control.
- **Items** - The action items to render
  - **ItemDisplayName** - The Display Name of the nav item
  - **ItemKey** - The key to use to indicate which item is selected, and when adding sub items. The keys must be unique.
  - **ItemEnabled** - Set to false if the option is disabled
  - **ItemVisible** - Set to false if the option is not visible
  - **ItemChecked** - Set to true if the option is checked (e.g. split buttons in a command bar)
  - **ItemIconName** - The Fluent UI icon to use (see [Fluent UI icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons))
  - **ItemCount** - Show an item count on a Pivot item link.


### Style Properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.
- **RenderSize** - The pivot control can be rendered in two sizes (large/normal)
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

### Example Theme

The following is an example of setting the theme based on the output from the [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). 

```
Set(varThemeBlue, {
  palette: {
    themePrimary: ColorValue("#0078d4"),
    themeLighterAlt: ColorValue("#eff6fc"),
    themeLighter: ColorValue("#deecf9"),
    themeLight: ColorValue("#c7e0f4"),
    themeTertiary: ColorValue("#71afe5"),
    themeSecondary: ColorValue("#2b88d8"),
    themeDarkAlt: ColorValue("#106ebe"),
    themeDark: ColorValue("#005a9e"),
    themeDarker: ColorValue("#004578"),
    neutralLighterAlt: ColorValue("#faf9f8"),
    neutralLighter: ColorValue("#f3f2f1"),
    neutralLight: ColorValue("#edebe9"),
    neutralQuaternaryAlt: ColorValue("#e1dfdd"),
    neutralQuaternary: ColorValue("#d0d0d0"),
    neutralTertiaryAlt: ColorValue("#c8c6c4"),
    neutralTertiary: ColorValue("#a19f9d"),
    neutralSecondary: ColorValue("#605e5c"),
    neutralPrimaryAlt: ColorValue("#3b3a39"),
    neutralPrimary:ColorValue( "#323130"),
    neutralDark: ColorValue("#201f1e"),
    black: ColorValue("#000000"),
    white: ColorValue("#ffffff")
  }});

Set(varThemeBlueJSON,"{""palette"":{
  ""themePrimary"": ""#0078d4"",
  ""themeLighterAlt"": ""#eff6fc"",
  ""themeLighter"": ""#deecf9"",
  ""themeLight"": ""#c7e0f4"",
  ""themeTertiary"": ""#71afe5"",
  ""themeSecondary"": ""#2b88d8"",
  ""themeDarkAlt"": ""#106ebe"",
  ""themeDark"": ""#005a9e"",
  ""themeDarker"": ""#004578"",
  ""neutralLighterAlt"": ""#faf9f8"",
  ""neutralLighter"": ""#f3f2f1"",
  ""neutralLight"": ""#edebe9"",
  ""neutralQuaternaryAlt"": ""#e1dfdd"",
  ""neutralQuaternary"": ""#d0d0d0"",
  ""neutralTertiaryAlt"": ""#c8c6c4"",
  ""neutralTertiary"": ""#a19f9d"",
  ""neutralSecondary"": ""#605e5c"",
  ""neutralPrimaryAlt"": ""#3b3a39"",
  ""neutralPrimary"": ""#323130"",
  ""neutralDark"": ""#201f1e"",
  ""black"": ""#000000"",
  ""white"": ""#ffffff""
}
}");
```

The Theme JSON string is passed to the component property, whilst the varTheme can be used to style other standard components such as buttons using the individual colors.

## Design challenges

The following are items of note that were encountered when creating this component:

#### Forked FocusZone

Since canvas apps (not custom pages) assigned a positive tab index to its controls (see below) - the Fluent UI `FocusZone` has to be modified to allow for the default tab index to be specified from its props rather than always being zero. The `Pivot`/`CommandBar` components also need to be forked to accommodate this change since they do not allow for providing a custom `FocusZone` implementation. See [the Fluent UI fork read me](CommandsMenusNavs\fluentui-fork\README.md) for more information.

## Unsupported techniques

The following items are considered unsupported techniques at this time and will be removed once the platform allows:

#### Non-zero tab index in canvas apps 

When canvas apps add html controls such as buttons and inputs to the DOM, it assigns a non-zero `tabindex`. E.g.:

```html
<button class="appmagic-button-container no-focus-outline" tabindex="15"...>
```

The result is that if html elements are added by code components without a non-zero `tabindex` assigned, they will not be set focus in the correct order when using keyboard tabbing.

To overcome this, there is an undocumented property that can be read inside the code component provided by the context:

```typescript
const assignedTabIndex = (context as any).accessibility?.assignedTabIndex ?? 0;
```

**Note:** The context is cast to any (or an extended Context type) to allow reading of the accessibility property.

This technique is not needed in model-driven apps, and the `tabindex` is not set on the `textarea` control.

