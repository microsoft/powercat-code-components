# Command Bar

This code component provides a wrapper around the [Fluent UI Command Bar](https://developer.microsoft.com/en-us/fluentui#/controls/web/commandbar) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

- **Items** - The action items to render
  - **ItemDisplayName** - The Display Name of the command bar item.
  - **ItemKey** - The key to use to indicate which item is selected, and when adding sub items. The keys must be unique.
  - **ItemEnabled** - Set to false if the option is disabled.
  - **ItemVisible** - Set to false if the option is not visible.
  - **ItemChecked** - Set to true if the option is checked (e.g. split buttons in a command bar).
  - **ItemSplit** - Set to true if the option can be clicked and used as a drop down flyout menu.
  - **ItemIconName** - The Fluent UI icon to use (see [Fluent UI icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons)).
  - **ItemIconColor** - The color to render the icon as (e.g. named, rgb or hex value).
  - **ItemIconOnly** - Do not show the text label - only the icon.
  - **ItemOverflow** - Render the option in the overflow items.
  - **ItemFarItem** - Render the option in the far items group of a command bar.
  - **ItemHeader** - Render the item as a section header. If there are items that have their **ItemParentKey** set to the key of this item, then they are added as semantically grouped items under this section.
  - **ItemTopDivider** - Render a divider at the top of the section.
  - **ItemDivider** - Render the item as a section divider - or if the item is a header (`ItemHeader` = true), then controls whether to render a divider at the bottom of the section.
  - **ItemParentKey** - Render the option as child item of another option.
  - **ItemStyles** - Button styles to apply to this item (see [Button Styles](https://developer.microsoft.com/en-us/fluentui#/controls/web/button#IButtonStyles)).


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

### Forked FocusZone

Since canvas apps (not custom pages) assigned a positive tab index to its controls (see below) - the Fluent UI `FocusZone` has to be modified to allow for the default tab index to be specified from its props rather than always being zero. The `Pivot`/`CommandBar` components also need to be forked to accommodate this change since they do not allow for providing a custom `FocusZone` implementation. See [the Fluent UI fork read me](CommandsMenusNavs\fluentui-fork\README.md) for more information.

[Code for Fluent UI 8.29.0 that is forked](https://github.com/microsoft/fluentui/releases/tag/%40fluentui%2Freact_v8.29.0)

## Unsupported techniques

The following items are considered unsupported techniques at this time and will be removed once the platform allows:

### Non-zero tab index in canvas apps 

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

