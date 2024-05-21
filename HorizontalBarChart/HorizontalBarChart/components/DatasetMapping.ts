import { DataVizPalette, IChartProps, IHorizontalDataPoint, getColorFromToken } from '@fluentui/react-charting';
import { ItemColumns } from '../ManifestConstants';

export const _colors = [
    [DataVizPalette.color1, DataVizPalette.color2, DataVizPalette.color3, DataVizPalette.color4],
    [DataVizPalette.color5, DataVizPalette.color6, DataVizPalette.color7, DataVizPalette.color8],
    [
        DataVizPalette.color9,
        DataVizPalette.color10,
        DataVizPalette.color11,
        DataVizPalette.color12,
        DataVizPalette.color13,
    ],
    [
        DataVizPalette.color14,
        DataVizPalette.color15,
        DataVizPalette.color16,
        DataVizPalette.color17,
        DataVizPalette.color18,
    ],
    [
        DataVizPalette.color19,
        DataVizPalette.color20,
        DataVizPalette.color21,
        DataVizPalette.color22,
        DataVizPalette.color23,
        DataVizPalette.color24,
        DataVizPalette.color25,
    ],
    [
        DataVizPalette.color26,
        DataVizPalette.color27,
        DataVizPalette.color28,
        DataVizPalette.color29,
        DataVizPalette.color30,
    ],
    [
        DataVizPalette.color31,
        DataVizPalette.color32,
        DataVizPalette.color33,
        DataVizPalette.color34,
        DataVizPalette.color35,
    ],
    [
        DataVizPalette.color36,
        DataVizPalette.color37,
        DataVizPalette.color38,
        DataVizPalette.color39,
        DataVizPalette.color40,
    ],
];

export function _randomColor(index: number): string {
    const colorGroup = _colors[index % _colors.length];
    return getColorFromToken(colorGroup[Math.floor(Math.random() * colorGroup.length)]);
}

function createChartProps(
    record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
    key: string,
    index: number,
    ariaLabel: string | undefined,
    customColor: boolean,
): IChartProps {
    return {
        id: record.getRecordId(),
        key,
        chartTitle: record.getValue(ItemColumns.Title) as string,
        chartTitleAccessibilityData: ariaLabel,
        chartData: [
            {
                horizontalBarChartdata: {
                    x: record.getValue(ItemColumns.Value) as number,
                    y: record.getValue(ItemColumns.TotalValue) as number,
                } as IHorizontalDataPoint,
                legend: record.getValue(ItemColumns.Legend) as string,
                xAxisCalloutData: record.getValue(ItemColumns.XPopover) as string,
                yAxisCalloutData: record.getValue(ItemColumns.YPopover) as string,
                color: customColor
                    ? getColorFromToken(record.getValue(ItemColumns.Color) as string)
                    : _randomColor(index),
            },
        ],
    } as IChartProps;
}

export function getChartDataFromDataset(
    dataset: ComponentFramework.PropertyTypes.DataSet,
    customColor: boolean,
    ariaLabel: string | undefined,
): IChartProps[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        return Array.from({ length: 3 }, (_, index) => getDummyAction(`Action ${index + 1}`, index + 1));
    }
    const keyIndex: Record<string, number> = {};
    return dataset.sortedRecordIds.map((id, index) => {
        const record = dataset.records[id];
        const key = record.getValue(ItemColumns.Key) as string;
        keyIndex[key] = (keyIndex[key] || 0) + 1;
        return createChartProps(
            record,
            key + (keyIndex[key] > 1 ? `_${keyIndex[key] - 1}` : ''),
            index,
            ariaLabel,
            customColor,
        );
    });
}

function getDummyAction(key: string, index: number): IChartProps {
    return {
        id: key,
        key,
        chartTitle: key,
        chartData: [
            {
                horizontalBarChartdata: {
                    x: index * 10,
                    y: 50,
                } as IHorizontalDataPoint,
                legend: key,
                color: _randomColor(index),
            },
        ],
    } as IChartProps;
}
