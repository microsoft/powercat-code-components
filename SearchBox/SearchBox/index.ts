import * as React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { SearchBoxComponent } from './components/SearchBox';
import { ISearchBoxComponentProps } from './components/Component.types';
import { InputEvents, InputProperties } from './ManifestConstants';
import { Async } from '@fluentui/react';

export class SearchBox implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private static readonly DELAY_TIMEOUT: number = 500;
    context: ComponentFramework.Context<IInputs>;
    notifyOutputChanged: ((debounce?: boolean) => void) | null;
    notifyOutputChangedNoDebounce: () => void;
    searchTextValue: string;
    defaultValue: string;
    setFocus = '';
    asyncFluent: Async;
    debouncedOutputChanged: (debounce?: boolean) => void;
    delayOutput: boolean;

    constructor() {
        this.onChanged = this.onChanged.bind(this);
        this.asyncFluent = new Async();
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.notifyOutputChangedNoDebounce = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
        if (this.notifyOutputChanged) {
            this.debouncedOutputChanged = this.asyncFluent.debounce(this.notifyOutputChanged, SearchBox.DELAY_TIMEOUT);
        }
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        this.delayOutput = context.parameters.DelayOutput.raw;
        const inputEvent = this.context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.setFocus !== inputEvent;
        const valueChanged = context.updatedProperties.indexOf(InputProperties.SearchText) > -1;
        if (valueChanged) {
            const value = context.parameters.SearchText.raw;
            // If the default value is different from searchText value
            if (value && this.searchTextValue !== value) {
                this.searchTextValue = value;
                this.notifyOutputChangedNoDebounce();
            }
        }
        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            this.setFocus = inputEvent;
        }
        const props: ISearchBoxComponentProps = {
            onChange: this.onChanged,
            themeJSON: context.parameters.Theme.raw ?? '',
            ariaLabel: context.parameters?.AccessibilityLabel.raw ?? '',
            underLined: context.parameters.Underlined.raw ?? false,
            iconName: context.parameters.IconName.raw ?? '',
            placeholderText: context.parameters.PlaceHolderText.raw ?? '',
            disabled: context.mode.isControlDisabled,
            disableAnimation: context.parameters.DisableAnimation.raw ?? false,
            width: allocatedWidth,
            height: allocatedHeight,
            setFocus: this.setFocus,
            borderColor: context.parameters.BorderColor.raw ?? '',
            value: this.searchTextValue ?? '',
        };

        return React.createElement(SearchBoxComponent, props);
    }

    /**
     * Called when a change is detected from the control. Updates the searchTextValue variable that is assigned to the output SearchText.
     * @param newValue a string returned as the input search text
     */
    private onChanged = (event: React.ChangeEvent<HTMLInputElement>, newValue: string): void => {
        // If the new Value is different from searchTextValue
        if (this.searchTextValue !== newValue) {
            this.searchTextValue = newValue;
            this.delayOutput
                ? this.debouncedOutputChanged && this.debouncedOutputChanged()
                : this.notifyOutputChanged && this.notifyOutputChanged();
        }
    };

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            SearchText: this.searchTextValue,
        } as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        this.notifyOutputChanged = null;
        this.asyncFluent.dispose();
    }
}
