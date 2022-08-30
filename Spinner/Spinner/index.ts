import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasSpinner, ISpinnerProps } from './Spinner';
import * as React from 'react';
import { SpinnerLabelPosition } from '@fluentui/react';
import { SpinnerSizes, SpinnerAlignmentTypes } from './ManifestTypes';

export class Spinner implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    context: ComponentFramework.Context<IInputs>;
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
        this.context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const props: ISpinnerProps = {
            label: context.parameters.Label.raw ?? '',
            ariaLabel: context.parameters.AccessibilityLabel.raw ?? '',
            themeJSON: context.parameters.Theme.raw ?? '',
            spinnerSize: SpinnerSizes[context.parameters.SpinnerSize.raw],
            labelPosition: context.parameters.LabelPosition.raw.toLowerCase() as SpinnerLabelPosition,
            justify: SpinnerAlignmentTypes[context.parameters.SpinnerAlignment.raw],
            width: allocatedWidth,
            height: allocatedHeight,
            backgroundColor: context.parameters.BackgroundColor.raw ?? undefined,
        };
        return React.createElement(CanvasSpinner, props);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {} as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // No
    }
}
