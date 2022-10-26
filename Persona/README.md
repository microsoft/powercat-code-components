# Persona

This code component provides a wrapper around the [Fluent UI Persona](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

- **ImageUrl** - Url to the image to use, should be a square aspect ratio and big enough to fit in the image area.

- **ImageInitials** - The user's initials to display in the image area when there is no image.

- **Text** - Primary text to display, usually the name of the person.

- **SecondaryText** - Secondary text to display, usually the role of the user.

- **TertiaryText** - Tertiary text to display, usually the status of the user. The tertiary text will only be shown when using size72 or size100.

- **OptionalText** - Optional text to display, usually a custom message set. The optional text will only be shown when using size100.

- **ImageAlt** - Alt text for the image to use.

- **HidePersonaDetails** - Whether to not render persona details, and just render the persona image/initials.

- **PersonaSize** - Size of the persona to appear on screen.

- **Presence** - Presence of the person to display - will not display presence if undefined. Value should be from one of the followings :
    away
    blocked
    busy
    dnd
    none
    offline
    online

### Style Properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.

- **AccessibilityLabel** - Screen reader aria-label

### Usage

Following is an example on how to use the Persona component:

    Text: "Megan Brower"
    SecondaryText: "Software Engineer"
    TertiaryText: "In a meeting"
    OptionalText: "Available at 4:00pm"
    HidePersonaDetails: false
    ImageUrl: User().Image
    PersonaSize: PowerCAT.Persona.PersonaSize.Size100
    Presence: PowerCAT.Persona.Presence.Online
    

### Example Theme

The following is an example of setting the theme based on the output from the [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/).

```Power Fx
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



