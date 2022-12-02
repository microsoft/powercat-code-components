import { IInputs, IOutputs } from './generated/ManifestTypes';
import { SpinButtonComponent } from './components/SpinButton';
import { ISpinButtonComponentProps } from './components/Component.types';
import * as React from 'react';
import { Async } from '@fluentui/react';
import { InputEvents } from './ManifestConstants';

export class SpinButton implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private static readonly DELAY_TIMEOUT: number = 500;
    context: ComponentFramework.Context<IInputs>;
    notifyOutputChanged: ((debounce?: boolean) => void) | null;
    spinButtonValue: string | null;
    setFocus = '';
    asyncFluent: Async;
    debouncedOutputChanged: (debounce?: boolean) => void;
    delayOutput: boolean;

    constructor() {
        this.onChange = this.onChange.bind(this);
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
        this.context = context;
        this.context.mode.trackContainerResize(true);
        if (this.notifyOutputChanged) {
            this.debouncedOutputChanged = this.asyncFluent.debounce(this.notifyOutputChanged, SpinButton.DELAY_TIMEOUT);
        }
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const stepValue = context.parameters.Step.raw ?? 1;
        let suffix = context.parameters.Suffix.raw ?? '';
        suffix = suffix.length > 0 ? ' '.concat(suffix) : '';
        const defaultValue = (context.parameters.DefaultValue.raw ?? '0').concat(suffix) as string;
        this.delayOutput = context.parameters.DelayOutput.raw;

        const inputEvent = this.context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.setFocus !== inputEvent;

        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            this.setFocus = inputEvent;
        }
        const props: ISpinButtonComponentProps = {
            label: context.parameters.Label.raw ?? '',
            iconName: context.parameters.IconName.raw ?? '',
            defaultValue: defaultValue,
            min: context.parameters.Min.raw ?? 0,
            max: context.parameters.Max.raw ?? 100,
            step: stepValue,
            incrementButtonAriaLabel: 'Increase value by ' + stepValue + suffix,
            decrementButtonAriaLabel: 'Decrease value by ' + stepValue + suffix,
            themeJSON: context.parameters.Theme.raw ?? '',
            disabled: context.mode.isControlDisabled,
            width: allocatedWidth,
            height: allocatedHeight,
            suffix: suffix,
            onChanged: this.onChange,
            error: context.parameters.Error.raw,
            setFocus: this.setFocus,
        };

        return React.createElement(SpinButtonComponent, props);
    }

    /**
     * Called when a change is detected from the control.
     * Updates the output value passed to Power Apps.
     * @param newValue a string returned as the input search text
     */
    private onChange = (newValue: string | undefined): void => {
        this.spinButtonValue = newValue ?? null;
        this.delayOutput
            ? this.debouncedOutputChanged && this.debouncedOutputChanged()
            : this.notifyOutputChanged && this.notifyOutputChanged();
    };

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            Value: this.spinButtonValue,
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
