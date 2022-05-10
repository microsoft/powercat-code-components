import * as React from 'react';
import { CanvasCommandItem, CanvasCommandBarProps } from './components/Component.types';
import { CanvasCommandBar } from './components/CanvasCommandBar';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { InputEvents, ManifestPropertyNames } from './ManifestConstants';
import { ContextEx } from './ContextExtended';
import { getMenuItemsFromDataset } from './components/DatasetMapping';

export class CommandBar implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    inputEvent?: string | null;
    context: ComponentFramework.Context<IInputs>;
    items: CanvasCommandItem[];
    focusKey = '';

    public init(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.context.parameters.items.paging.setPageSize(500);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const inputEvent = this.context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.inputEvent !== inputEvent;

        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            // Simulate SetFocus until this is unlocked by the platform events
            this.focusKey = inputEvent;
        }

        const dataset = context.parameters.items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;

        if (datasetChanged) {
            this.items = getMenuItemsFromDataset(dataset);
        }

        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;

        const props = {
            tabIndex: tabIndex,
            width: allocatedWidth,
            height: allocatedHeight,
            items: this.items,
            onSelected: this.onSelect,
            disabled: context.mode.isControlDisabled,
            setFocus: this.focusKey,
            themeJSON: context.parameters.Theme.raw,
            visible: context.mode.isVisible,
        } as CanvasCommandBarProps;

        return React.createElement(CanvasCommandBar, props);
    }

    public getOutputs(): IOutputs {
        return {} as IOutputs;
    }

    public destroy(): void {
        //noop
    }

    onSelect = (item?: CanvasCommandItem): void => {
        if (item && item.data) {
            this.context.parameters.items.openDatasetItem(item.data.getNamedReference());
        }
    };
}
