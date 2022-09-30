import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasFacepile } from './components/CanvasFacepile';
import { IFacepileprops, ICustomFacepile } from './components/Component.types';
import { getitemFromDataset } from './components/DatasetMapping';
import { getPersonaSize, getOverflowButtonType } from './components/Helper';
import { ContextEx } from './ContextExtended';
import * as React from 'react';
import { IFacepilePersona } from '@fluentui/react';
import { InputEvents, ManifestPropertyNames } from './ManifestConstants';

export class Facepile implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    onClick: (ev: unknown, persona: IFacepilePersona) => void;
    context: ComponentFramework.Context<IInputs>;
    eventName: string | undefined = undefined;
    items: ICustomFacepile[];
    inputEvent?: string | null;
    focusKey = '';
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
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
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;
        const ariaLabel = context.parameters?.AccessibilityLabel.raw ?? '';
        const dataset = context.parameters.items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;
        const inputEvent = this.context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.inputEvent !== inputEvent;
        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            // Simulate SetFocus until this is unlocked by the platform
            this.focusKey = inputEvent;
        }

        if (datasetChanged) {
            this.items = getitemFromDataset(dataset);
        }

        const props: IFacepileprops = {
            height: allocatedHeight,
            width: allocatedWidth,
            tabIndex: tabIndex,
            items: this.items,
            setFocus: this.focusKey,
            displayedPersonas: context.parameters.MaxDisplayablePersonas.raw ?? 5,
            personaSize: getPersonaSize(context.parameters.PersonaSize.raw),
            overflowButtonType: getOverflowButtonType(context.parameters.OverflowButtonType.raw),
            ariaLabel: ariaLabel,
            imagesFadeIn: context.parameters.ImageShouldFadeIn.raw,
            onSelected: this.onSelect,
            showAddButton: context.parameters.ShowAddButton.raw,
            overflowButtonAriaLabel: context.parameters.OverflowButtonAriaLabel.raw ?? '',
            addbuttonAriaLabel: context.parameters.AddbuttonAriaLabel.raw ?? '',
        };
        return React.createElement(CanvasFacepile, props);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { EventName: this.eventName };
    }

    onSelect = (eventName: string, itemPersona?: IFacepilePersona): void => {
        if (itemPersona && itemPersona.data) {
            this.context.parameters.items.openDatasetItem(itemPersona.data.getNamedReference());
        }
        this.eventName = eventName;
        this.notifyOutputChanged();
    };

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
