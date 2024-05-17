import * as React from 'react';
import { getChartDataFromDataset } from './components/DatasetMapping';
import { ChartDataMode, HorizontalBarChartVariant, IChartProps } from '@fluentui/react-charting';
import { ChartModes, ManifestPropertyNames, Variants } from './ManifestConstants';
import { CanvasHorizontalChart, ICanvasHorizontalBarChartProps } from './components/CanvasHorizontalChart';
import { IInputs, IOutputs } from './generated/ManifestTypes';

export class HorizontalBarChart implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    items: IChartProps[];
    context: ComponentFramework.Context<IInputs>;
    notifyOutputChanged: () => void;
    customColor: boolean;
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
        const customColor = context.parameters.CustomColors.raw;
        const ariaLabel = context.parameters.AccessibilityLabel.raw ?? undefined;
        if (datasetChanged || customColor !== this.customColor) {
            this.customColor = context.parameters.CustomColors.raw;
            this.items = getChartDataFromDataset(dataset, this.customColor, ariaLabel);
        }
        // The test harness provides width/height as strings so use parseInt
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const props: ICanvasHorizontalBarChartProps = {
            data: this.items,
            hideLabels: context.parameters.HideLabels.raw,
            hideTooltip: context.parameters.HideTooltip.raw,
            barHeight: context.parameters.BarHeight.raw ?? 15,
            width: allocatedWidth,
            themeJSON: context.parameters.Theme.raw ?? undefined,
            styles: { root: { height: allocatedHeight } },
            chartDataMode: ChartModes[context.parameters.ChartDataMode.raw] as ChartDataMode,
            variant: Variants[context.parameters.Variant.raw] as HorizontalBarChartVariant,
        };
        return React.createElement(CanvasHorizontalChart, props);
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
