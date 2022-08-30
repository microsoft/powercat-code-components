# Fluent Shimmer

This code component provides a wrapper around the [Fluent UI Shimmer](https://developer.microsoft.com/en-us/fluentui#/controls/web/shimmer) control bound to a button for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

- **Items** - The action items to render
  - **ItemType** - The Shimmer element type from the list of three shimmer elements, i.e. cirlce, gap & line. 
  - **ItemHeight** - Height of ShimmerElement.
  - **ItemWidth** - Width of ShimmerElement
  - **ItemVerticalAlign** - To specify how the element should align. i.e. 'top', 'center' or'bottom'.

- **RowCount** - Number of Shimmers to render

- **SpacebetweenShimmer** - Space or Gap between each Shimmer incase of muliple rows.   

### Style Properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.
- **AccessibilityLabel** - Screen reader aria-label

### Usage

Here is an example which can be used to create a Shimmer effect as shown in the below screen shot.

![image](./media/Shimmer.gif)

### Items Property value

Each Record in the below table can have following values.

|Property Name|Property Value|Required|
|--|--|--|
|ItemType|"circle"|Yes|
|ItemWidth|"20"||
|ItemHeight|10||


```
Table(
    {
        ItemWidth: "3.8",
        ItemHeight: 25,
        ItemType: "circle"
    },
    {
        ItemWidth: "5",
        ItemHeight: 10,
        ItemType: "gap"
    },
    {
        ItemWidth: "100",
        ItemHeight: 20,
        ItemType: "line"
    },
    {
        ItemWidth: "10",
        ItemHeight: 10,
        ItemType: "gap"
    },
    {
        ItemWidth: "100",
        ItemHeight: 20,
        ItemType: "line"
    })
```

### Example Theme

The following is an example of setting theme based on the output from the [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). 

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

For more information on the color palette to be used while working with Shimmer, refer **IShimmerColors Interface** section of [IShimmerElement](https://developer.microsoft.com/en-us/fluentui#/controls/web/shimmer#IShimmerElement) documentation.
