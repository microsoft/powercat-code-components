# Fluent Message bar

This code component provides a wrapper around the [Fluent UI Messagebar](https://react.fluentui.dev/?path=/docs/components-messagebar--docs#intent) control for use in canvas & custom pages.

| Canvas apps | Custom pages | Model-driven apps | Portals |
| ----------- | ------------ | ----------------- | ------- |
| ✅           | ✅            | ⬜                 | ⬜       |

## Configuration

The control accepts the following properties:

 - **Title** - This denotes title of the chart.
 - **Body** - This denotes body of the message bar.For best experience keep content to under 100 characters
 - **Shape** - This denotes the shape of the message bar (rounded, square):
   - **rounded**
   - **square**
 - **Intent** - This determines the message type, such as informational, success, warning, or error:
   - **info**
   - **warning**
   - **error**
   - **success**
 - **LinkText** - This denotes the text of the hyperlink
  - **URL** - This denotes the url that needs to be added for the link
  - **HideDismiss** - This determines whether the dismiss icon should be visible or hidden. By default, this will be set to false

### Toolbar Properties (Action Items)

This component supports a customizable toolbar that can include action items, configured through the `Items` property.

- **Items** - A collection of action items to be displayed in the toolbar. Each item has:
  - **ItemDisplayName** - The display name of the item.
  - **ItemKey** - A unique key identifying the item.
  - **ItemDisabled** - A flag indicating if the item should be disabled.
  - **ItemVisible** - A flag to toggle the visibility of the item.
  - **ItemIconName** - The name of the icon to display with the item.
  - **ItemIconStyle** - Specifies the style of the icon (e.g., "Regular").
  - **ItemAppearance** - Sets the appearance of the item, such as its style or color.
  - **ItemTooltip** - Provides additional information about the item when hovered.

### Common Properties

- **Height** - Controls the height of the Messagebar.
- **Width** - Controls the width of the Messagebar.
- **OnSelect** - An event triggered when an item in the toolbar is selected

## Configure "Dismiss" button on click behaviour
Use any appropriate expressions in the Power Fx language on the "**OnDismiss**" property. This property can be used to control the visibilty of the message bar control by configuring a contextual variable to false and assigning the variable Visible property

E.g.
```vb
UpdateContext({hideMessageBar:false});
```