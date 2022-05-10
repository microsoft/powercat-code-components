/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    Theme: ComponentFramework.PropertyTypes.StringProperty;
    AccessibilityLabel: ComponentFramework.PropertyTypes.StringProperty;
    MaxDisplayedItems: ComponentFramework.PropertyTypes.WholeNumberProperty;
    OverflowIndex: ComponentFramework.PropertyTypes.WholeNumberProperty;
    InputEvent: ComponentFramework.PropertyTypes.StringProperty;
    items: ComponentFramework.PropertyTypes.DataSet;
}
export interface IOutputs {
}
