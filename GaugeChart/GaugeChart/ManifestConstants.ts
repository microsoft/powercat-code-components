import { GaugeValueFormat } from '@fluentui/react-charting';

export const enum ManifestPropertyNames {
    dataset = 'dataset',
}

export const ChartValueFormats = {
    '1': GaugeValueFormat.Fraction,
    '0': GaugeValueFormat.Percentage,
};

export const enum ItemColumns {
    Legend = 'ItemLegend',
    Key = 'ItemKey',
    Count = 'ItemCount',
    Color = 'ItemColor',
    Size = 'ItemSize',
}
