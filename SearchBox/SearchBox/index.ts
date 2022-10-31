import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SearchBoxComponent } from "./components/SearchBox";
import { ISearchBoxComponentProps } from "./components/Component.types";

export class SearchBox implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    context: ComponentFramework.Context<IInputs>;
    notifyOutputChanged: () => void;
    searchTextValue: string | null;

    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init( context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        const props: ISearchBoxComponentProps = {
            onChanged: this.onChange,
            themeJSON: context.parameters.Theme.raw ?? '',
            ariaLabel: context.parameters?.AccessibilityLabel.raw ?? ''
        };

        return React.createElement(SearchBoxComponent,
             props);
    }

    /**
     * Called when a change is detected from the control. Updates the searchTextValue variable that is assigned to the output SearchText.
     * @param newValue a string returned as the input search text
     */
    private onChange = (newValue: string | undefined): void => {
        this.searchTextValue = newValue ?? null;
        this.notifyOutputChanged();
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            SearchText: this.searchTextValue 
        } as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {}
}
