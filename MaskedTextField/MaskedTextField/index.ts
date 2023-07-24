import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasMaskedTextField } from './components/CanvasTextField';
import { ICanvasMaskedTextFieldProps } from './components/Component.types';
import { InputEvents, InputProperties } from './ManifestConstants';
import { Async } from '@fluentui/react';
import * as React from 'react';

export class MaskedTextField implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private static readonly DELAY_TIMEOUT: number = 500;
    //private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    context: ComponentFramework.Context<IInputs>;
    notifyOutputChanged: ((debounce?: boolean) => void) | null;
    notifyOutputChangedNoDebounce: () => void;
    trackedValue: string;
    defaultValue: string;
    asyncFluent: Async;
    debouncedOutputChanged: (debounce?: boolean) => void;
    delayOutput: boolean;
    setFocus = '';
    /**
     * Empty constructor.
     */
    constructor() {
        this.onChanged = this.onChanged.bind(this);
        this.asyncFluent = new Async();
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.notifyOutputChangedNoDebounce = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
        if (this.notifyOutputChanged) {
            this.debouncedOutputChanged = this.asyncFluent.debounce(
                this.notifyOutputChanged,
                MaskedTextField.DELAY_TIMEOUT,
            );
        }
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        this.delayOutput = context.parameters.DelayOutput.raw;
        // Set focus logic
        const inputEvent = this.context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.setFocus !== inputEvent;
        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            this.setFocus = inputEvent;
        }
        // Track value from the input
        this.trackedValue = context.parameters.Value.raw ?? '';
        const valueChanged = context.updatedProperties.indexOf(InputProperties.Value) > -1;
        if (valueChanged) {
            const value = context.parameters.Value.raw;
            // If the default value is different from searchText value
            if (value && this.trackedValue !== value) {
                this.trackedValue = value;
                this.notifyOutputChangedNoDebounce();
            }
        }

        // Input properties
        const props: ICanvasMaskedTextFieldProps = {
            width: allocatedWidth,
            prefixValue: context.parameters.Prefix.raw ?? '',
            suffixValue: context.parameters.Suffix.raw ?? '',
            errorMessage: context.parameters.ErrorMessage.raw ?? '',
            maskPattern: context.parameters.MaskFormat.raw ?? '',
            mask: context.parameters.Mask.raw ?? '',
            onChange: this.onChanged,
            value: this.trackedValue ?? '',
            themeJSON: context.parameters.Theme.raw ?? '',
            ariaLabel: context.parameters?.AccessibilityLabel.raw ?? '',
            maskChar: '',
            disabled: context.mode.isControlDisabled,
            setFocus: this.setFocus,
        };
        return React.createElement(CanvasMaskedTextField, props);
    }

    /**
     * Called when a change is detected from the control. Updates the trackedValue variable that is assigned to the output TextField.
     * @param newValue a string returned as the input search text
     */
    private onChanged = (event?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
        // If the new Value is different from searchTextValue
        if (this.trackedValue !== newValue) {
            this.trackedValue = newValue ?? '';
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
            Value: this.trackedValue,
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
