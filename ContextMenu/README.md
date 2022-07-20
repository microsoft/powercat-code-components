# Fluent Context Menu

This code component provides a wrapper around the [Fluent UI Context Menu](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu) control bound to a button for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

- **Items** - The action items to render. The first item is considered the root item.
  - **ItemDisplayName** - The Display Name of the menu item.
  - **ItemKey** - The key to use to indicate which item is selected, and when adding sub items. The keys must be unique.
  - **ItemEnabled** - Set to false if the option is disabled.
  - **ItemVisible** - Set to false if the option is not visible.
  - **ItemChecked** - Set to true if the option is checked.
  - **ItemIconName** - The Fluent UI icon to use (see [Fluent UI icons](https://developer.microsoft.com/en-us/fluentui#/styles/web/icons))
  - **ItemIconColor** - The color to render the icon as (e.g. named, rgb or hex value).
  - **ItemIconOnly** - Do not show the text label - only the icon.
  - **ItemHeader** - Render the item as a section header. If there are items that have their **ItemParentKey** set to the key of this item, then they are added as semantically grouped items under this section.
  - **ItemTopDivider** - Render a divider at the top of the section.
  - **ItemDivider** - Render the item as a section divider - or if the item is a header (`ItemHeader` = true), then controls whether to render a divider at the bottom of the section.
  - **ItemParentKey** - Render the option as child item of another option.


### Style Properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.
- **Chevron** - Show or hide the down chevron on the root button
- **Icon color** (Optional) - color of the icon on the context menu button.
- **Hover icon color** (Optional) - color of the icon when hovered over the context menu button.
- **Icon size** (px)  (Optional) - the size of the icon on the context menu button.
- **Font size** (px) (Optional) - the size of the text on the context menu button.
- **Font color** (Optional) - the color of the text on the context menu button.
- **Hover font color** (Optional) - the color of the text when hovered over the context menu button.
- **Fill color** (Optional) - the background color of the context menu button.
- **Hover fill color** (Optional) - the background color when hovered over the context menu button.
- **Text alignment** - The alignment of the button text. Possible values: Center, Left or Right
- **Accessibility label** - Screen reader aria-label

### Event Properties

- **Input event** - An event to send to the control. E.g. `SetFocus`. See below.

### OnSelect Event

When a menu item is selected, the `OnSelect` event is raised, with the `SelectedItem` set to the corresponding item.

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
