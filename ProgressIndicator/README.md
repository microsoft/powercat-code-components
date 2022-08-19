# Progress Indicator

This code component provides a wrapper around the [Fluent UI ProgressIndicator](https://developer.microsoft.com/en-us/fluentui#/controls/web/progressindicator) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅          | ✅           | ⬜                | ⬜      |

## Configuration

The control accepts the following properties:

-   **Label** - Optional label for spinner.
-   **Percentage Complete** - Percentage of the operation completed, on the scale of 0 to 1. If not set Indeterminate Indicator will be shown.
-   **Type of Indicator** -
    -   **Default Indicator**
    -   **Indeterminate Indicator**
-   **Hide Progress State** -  Specify true to hide progress state
-   **Bar Height** -  Specify height of the bar as applicable

## Configure loading behaviour

Below sample code can be referred to enhance the loading behaviour of default progress indicator

Here *var_showProgress* will be value of "Hide Progress State" or "Visible" property as appropriate & *var_progressValue*  will be for "Percentage Complete" property

```
UpdateContext({ var_showProgress: true , var_progressValue: 0 });

/* Some code ... */

UpdateContext({ var_progressValue: 0.25 });

/* Some code ... */

UpdateContext({ var_progressValue: 0.50 });

/* Some code ... */

UpdateContext({ var_progressValue: 0.70 });

/* Some code ... */

UpdateContext({ var_progressValue: 0.80 });

Notify("Successfully completed process", NotificationType.Success);

UpdateContext({ var_showProgress: false });
```

### Style Properties

-   **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.
-   **AccessibilityLabel** - Screen reader aria-label

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
