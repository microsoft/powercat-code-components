# PeoplePicker

This code component provides a wrapper around the [Fluent UI PeoplePicker](https://developer.microsoft.com/en-us/fluentui#/controls/web/peoplepicker) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

- **Items** - The Pre-selected Persona(members) to appear on Peoplepicker
  - **PersonaName** - Display Name of the Persona.
  - **PersonaKey** - The key identify the specific Item. The key must be unique.
  - **PersonaImgUrl** - Url or Base64 Content of Persona Image(Profile Picture).
    - **PersonaRole** - Secondary Text, Preferably JobTitle of the Persona
  - **PersonaPresence** - Optional - To defined the Presence of the persona. Value should be from one of the followings :
    - away
    - blocked
    - busy
    - dnd
    - none
    - offline
    - online
  - **PersonaOOF** -  True or False, Based on whether the persona if Out of office or not.

- **Suggestions_Items** - List of Suggested members to pick from. This is a required dataset property
  - **SuggestionName** - Display Name of the Persona.
  - **SuggestionKey** - The key identify the specific Item. The key must be unique.
  - **SuggestionImgUrl** - Url or Base64 Content of Persona Image(Profile Picture).
  - **SuggestionRole** - Secondary Text, Preferably JobTitle of the Persona
  - **SuggestionPresence** - Optional - To defined the Presence of the persona. Value should be from one of the followings :
    - away
    - blocked
    - busy
    - dnd
    - none
    - offline
    - online
  - **SuggestionOOF** -  True or False, Based on whether the persona if Out of office or not.
  - **PeoplePickerType** - Type of Peoplepicker to be used.
  - **MaxPeople** - Maximum number of user(s) to be allowed for selection
  - **NoResultFoundMesage** - Messgae to be shown if no result are found based on the specified search text.
  - **MinimumSearchTermLength** - Minimum search term length to be entered before providing the suggestions.
  - **SearchTermToShortMessage** - Custom message to be shown when the search text is less than *MinimumSearchTermLength*.
  - **Error** - To highlighting the people picker in red to represent that it has certain error which required validation.
  - **ShowSecondaryText** - Specify Yes or no, depending upon whether the Secondary text(e.g. JobTitle) to be shown or not.

### Style Properties

- **Theme** - Accepts a JSON string that is generated using [Fluent UI Theme Designer (windows.net)](https://fabricweb.z5.web.core.windows.net/pr-deploy-site/refs/heads/master/theming-designer/). Leaving this blank will use the default theme defined by Power Apps.

- **AccessibilityLabel** - Screen reader aria-label

### Usage

Following are the exmples on how to use the PeoplePicker component.

Note that PeoplePicker completely support other sources from where the input collection can be retrieved.

## With Office365Users Connector

Step 1) Setup OnSearch Property. Add the below PowerFx command to create a UserCollection.

```Power Fx
ClearCollect(
    UserCollection,
    AddColumns(
        Office365Users.SearchUser(
            {
                searchTerm: Self.SearchText,
                top: 500
            }
        ),
        "ImageURL",
        Substitute(
            JSON(
                Office365Users.UserPhotoV2(Id),
                JSONFormat.IncludeBinaryData
            ),
            """",
            ""
        )
    )
)
```

Step 2) Setup the Suggestions_Items Property by specifying this UserCollection.

```Power Fx
UserCollection
```

Note : In Step 1, we are making a consecutive request to get UserPhoto. This leads to increase in time of fetching the results. If you want to decrease the fetching time and can compromise on not showing the profile images, then use the below code instead of UserCollection & Skip Step 1) altogether.

```Power Fx
Office365Users.SearchUser({searchTerm:Self.SearchText,top:500})
```

Step 3) Map the Columns according your need. Below is an example of Column-Property Mapping

|Property Name|DataSet Column|
|--|--|
|SuggestionKey|"Mail"|
|SuggestionName|"DisplayName"|
|SuggestionRole|"JobTitle"|
|SuggestionImgUrl|"ImageURL"|

At this point, the people picker should be working and the selected members can be obtained from SelectedPeople Property.

```Power Fx
PeoplePicker1.SelectedPeople
```

## With Dataverse tables - AADUsers or Users

Step 1) Setup the Suggestions_Items Property by specifying the below code snippet.

Add Users or specific users(using below code) from table to the items collection(under Suggestions_Items peroperty) of peoplepicker.

### For AAD Users table

```Power Fx

Search('AAD Users', Self.SearchText,"displayname" ,"mail")

```

### For Users table

```Power Fx

Search('Users', Self.SearchText,"fullname","internalemailaddress")

```

Step 2) Map the Columns according your need. Below is an example of Column-Property Mapping

|Property Name|AADUser Table Column|User Table Column|
|--|--|--|
|SuggestionKey|"mail"|"internalemailaddress"|
|SuggestionName|"displayname"|"fullname"|
|SuggestionRole|"jobtitle"|"jobtitle"|

At this point, the people picker should be working and the selected members can be obtained from SelectedPeople Property.

```Power Fx
PeoplePicker1.SelectedPeople
```

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
