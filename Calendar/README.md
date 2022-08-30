# Fluent Calendar

This code component provides a wrapper around the [Fluent UI Calendar](https://developer.microsoft.com/en-us/fluentui#/controls/web/calendar) control bound to a button for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅          | ✅           | ⬜                | ⬜      |

## Configuration

The control accepts the following properties:

-   **Selected Date** - The date value to be pre-selected or Selected after on change event. 
For e.g. : 
```
//Today's Date
Today() 
// or based on language
DateValue("24/7/2022",Language())
// or specific regional language
DateValue("24/07/2022","en-GB")
```
-   **Language** - Language in which the calendar should render. Important : Read 'Calendar Language' section of this documentation to know the language supported currently.
For e.g. :
Language()
//or
"en-US"

-   **Show Go to Today** - Specify Yes or No to show or hide Go to Today option.
-   **Is a Month Picker** - Specify Yes or No to show or hide month picker.
-   **Is a Day Picker** - Specify Yes or No to show or hide day picker.
-   **Highlight Selected Month** - Specify Yes to highlight selected month in calendar
-   **Highlight Current Month** - Specify Yes to highlight current month in calendar
-   **Show Week Numbers** - Specify Yes or No to show or hide week numbers.
-   **Show Six Weeks by Default** - - Specify Yes to show six weeks by default.
-   **Minimum Date** - If specified a date value, navigation beyond that date will not be allowed.
-   **Maximum Date** - If specified a date value, navigation beyond that date will not be allowed. Refer example provided for Selected Date. 
-   **First Day of Week** - Select the day to be displayed as first day of week in calendar.

### Style Properties

-   **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.

-   **BackgroundColor** - Background color for the component. e.g. White or #ffffff

-   **AccessibilityLabel** - Screen reader aria-label


### Event Properties

-   **InputEvent** - An event to send to the control. E.g. `SetFocus`. See below.

### Using OnChange

When a date is selected, value can be obtained by the selectedDate output property. Below is a set of sample code which can be added in 'OnChange' property, depending on how to output need to be visualized.

```
Set(var_SelectedDate, If(!IsBlank(Self.selectedDateValue), Text(Self.selectedDateValue, ShortDate, Language())));
// Example - Output: 7/14/2022

```

```
Set(var_SelectedDate, If(!IsBlank(Self.selectedDateValue), Text(Self.selectedDateValue, LongDate, Language())));
// Example - Output: Sunday, July 3, 2022

```

```
Set(var_SelectedDate, If(!IsBlank(Self.selectedDateValue), Text(Self.selectedDateValue, ShortDate, "en-GB")));
// Example - Output: 14/07/2022
```

### Setting Focus on the control

When a new dialog is shown, and the default focus should be on the control, an explicit set focus will be needed.

To make calls to the input event, you can set a context variable that is bound to the Input Event property to a string that starts with `SetFocus` and followed by a random element to ensure that the app detects it as a change.

E.g.

```vb
UpdateContext({ctxResizableTextareaEvent:"SetFocus" & Text(Rand())}));
```

The context variable `ctxResizableTextareaEvent` would then be bound to the property `Input Event` property.

### Calendar Language

Below list of languages are currently unavailable. Inorder to include new language, refer the [Readme file](/Calendar/loc/Readme.md)
 - Czech(cs-CZ)
 - Spanish-Mexico(es-MX)
 - Galician(gl-ES)
 - Hindi (hi-IN)
 - Croatian(hr-HR)
 - Hungarian(hu-HU)
 - Indonesian(id-ID)
 - Latvian(lv-LV)
 - Korean(ko-KR)
 - Kazakh(kk-KZ)
 - Slovenian(sl-SL)
 - Serbian (Cyrillic)
 - Thai(th-TH)
 - Ukrainian(uk-UA)

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
