import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasShimmer } from './components/CanvasShimmer';
import * as React from 'react';
import { ICustomShimmerItem, IShimmerRows, IShimmerProps } from './components/Component.types';
import { getItemsFromDataset, getRowDetailsFromDataset } from './components/DatasetMapping';
import { ManifestPropertyNames } from './ManifestConstants';

export class Shimmer implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    notifyOutputChanged: () => void;
    context: ComponentFramework.Context<IInputs>;
    items: ICustomShimmerItem[];
    rowDetails: IShimmerRows[];

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
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
        const dataset = context.parameters.items;
        const rowinfo = context.parameters.rows;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;
        const rowDataChanged = context.updatedProperties.indexOf('rows_dataset') > -1 || !this.rowDetails;
        if (datasetChanged || rowDataChanged) {
            this.items = getItemsFromDataset(dataset);
            this.rowDetails = getRowDetailsFromDataset(rowinfo);
        }

        // The test harness provides width/height as strings so use parseInt
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const props: IShimmerProps = {
            width: allocatedWidth,
            height: allocatedHeight,
            items: this.items,
            themeJSON: context.parameters?.Theme.raw ?? '',
            rowDetails: this.rowDetails,
            spacebetweenShimmer: context.parameters?.SpacebetweenShimmer.raw ?? '10px',
        };
        return React.createElement(CanvasShimmer, props);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
