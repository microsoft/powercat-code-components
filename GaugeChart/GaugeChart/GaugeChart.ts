import * as React from 'react';
import { ChartValueFormats, ManifestPropertyNames } from './ManifestConstants';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { IGaugeChartSegment } from '@fluentui/react-charting';
import { CanvasGaugeChart, IGaugeChartCanvasProps } from './components/CanvasGaugeChart';
import { getChartDataFromDataset } from './components/DatasetMapping';

export class GaugeChart implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    notifyOutputChanged: () => void;
    items: IGaugeChartSegment[];
    context: ComponentFramework.Context<IInputs>;
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
        const dataset = context.parameters.items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;

        if (datasetChanged) {
            this.items = getChartDataFromDataset(dataset, context.parameters.CustomColors.raw);
        }
        // The test harness provides width/height as strings so use parseInt
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

        const props: IGaugeChartCanvasProps = {
            width: allocatedWidth,
            height: allocatedHeight,
            chartTitle: context.parameters.Title.raw ?? '',
            sublabel: context.parameters.Sublabel.raw ?? '',
            chartValue: context.parameters.ChartValue.raw ?? 0,
            minValue: context.parameters.MinValue.raw ?? 0,
            maxValue: context.parameters.MaxValue.raw ?? 0,
            hideLegend: context.parameters.HideLegend.raw,
            hideMinMax: context.parameters.HideMinMax.raw,
            themeJSON: context.parameters.Theme.raw ?? '',
            chartValueFormat: ChartValueFormats[context.parameters.ChartValueFormat.raw],
            segments: this.items,
        };
        return React.createElement(CanvasGaugeChart, props);
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
