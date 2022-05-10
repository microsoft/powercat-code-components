import * as React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { ManifestPropertyNames, TextAlignmentTypes } from './ManifestConstants';
import { ContextEx } from './ContextExtended';
import { CanvasTagList } from './components/CanvasTagList';
import { getTagItemsFromDataset } from './components/DatasetMapping';
import { TagListItem, CanvasTagListProps } from './components/Component.types';

export class TagList implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    context: ComponentFramework.Context<IInputs>;
    items: TagListItem[];
    autoHeight?: number;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.context.parameters.items.paging.setPageSize(500);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const dataset = context.parameters.items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;

        if (datasetChanged) {
            this.items = getTagItemsFromDataset(dataset);
        }

        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;
        const textAlignment = context.parameters.TextAlignment.raw;
        const props = {
            tabIndex: tabIndex,
            width: allocatedWidth,
            height: allocatedHeight,
            items: this.items,
            disabled: context.mode.isControlDisabled,
            themeJSON: context.parameters.Theme.raw,
            maxHeight: this.undefinedIfZero(context.parameters.MaxHeight),
            justify: TextAlignmentTypes[textAlignment],
            fontSize: this.undefinedIfZero(context.parameters.FontSize),
            borderRadius: this.undefinedIfZero(context.parameters.BorderRadius),
            itemHeight: this.undefinedIfZero(context.parameters.ItemHeight),
            onResize: this.onResize,
        } as CanvasTagListProps;

        return React.createElement(CanvasTagList, props);
    }

    public getOutputs(): IOutputs {
        return {
            AutoHeight: this.autoHeight ?? this.context.mode.allocatedHeight,
        } as IOutputs;
    }

    public destroy(): void {
        //noop
    }

    private undefinedIfZero(property: ComponentFramework.PropertyTypes.Property) {
        return property.raw && property.raw > 0 ? property.raw : undefined;
    }

    onResize = (width: number, height: number): void => {
        this.autoHeight = height;
        this.notifyOutputChanged();
    };
}
