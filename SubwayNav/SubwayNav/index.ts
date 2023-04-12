import * as React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasSubwayNav } from './components/CanvasSubwayNav';
import { InputEvents, ManifestPropertyNames } from './ManifestConstants';
import { IOutputSchemaMap, StepSchema } from '../SubwayNav/components/StepSchema';
import { ISubNavItem, ISubNavProps, ICustomSubwayNavProps } from './components/components.types';
import { getItemsFromDataset, getDatasetfromItems } from './components/DatasetMapping';
import { ISubwayNavNodeProps } from './utilities/subway-nav/subway-node.types';
import { ContextEx } from './ContextExtended';

export class SubwayNav implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    context: ComponentFramework.Context<IInputs>;
    inputEvent?: string | null;
    items: ISubNavItem[];
    focusKey = '';
    steps: ICustomSubwayNavProps[] | undefined;
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
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const inputEvent = context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.inputEvent !== inputEvent;

        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            // Simulate SetFocus until this is unlocked by the platform
            this.focusKey = inputEvent;
        }

        const dataset = context.parameters.items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;

        if (datasetChanged) {
            this.items = getItemsFromDataset(dataset);
        }

        const ariaLabel = context.parameters?.AccessibilityLabel.raw ?? '';

        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;
        const props: ISubNavProps = {
            width: allocatedWidth,
            height: allocatedHeight,
            items: this.items,
            onSelected: this.onSelect,
            themeJSON: context.parameters?.Theme.raw ?? '',
            setFocus: this.focusKey,
            tabIndex: tabIndex,
            ariaLabel: ariaLabel,
            applyDarkTheme: context.parameters?.ApplyDarkTheme.raw ?? false,
            disabled: context.mode.isControlDisabled,
            wizardComplete: context.parameters.WizardCompleteorError.raw,
            showAnimation: context.parameters.ShowAnimation.raw,
        };
        return React.createElement(CanvasSubwayNav, props);
    }

    /**
     * It is called by the framework to determine the schema of the data returned by getOutputs.  This is used to expose sub objects in formulas in the studio.
     * @returns a schema for the output data properties.
     */
    public getOutputSchema(): Promise<IOutputSchemaMap> {
        return Promise.resolve(StepSchema.getStepSchema());
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            Steps: this.steps,
        } as IOutputs;
    }

    onSelect = (item: ISubNavItem, steps: ISubwayNavNodeProps[]): void => {
        if (item && item.data) {
            this.steps = getDatasetfromItems(steps);
            this.context.parameters.items.openDatasetItem(item.data.getNamedReference());
            this.notifyOutputChanged();
        }
    };

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
