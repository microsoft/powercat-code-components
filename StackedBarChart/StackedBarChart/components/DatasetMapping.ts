import { ItemColumns } from '../ManifestConstants';
import { DataVizPalette, IChartDataPoint, IChartProps, getColorFromToken } from '@fluentui/react-charting';

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

export function getChartDataFromDataset(
    dataset: ComponentFramework.PropertyTypes.DataSet,
    title: string,
    ariaLabel: string,
    customColor: boolean,
): IChartProps {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return getDummyData();
    }
    return {
        chartTitle: title,
        chartDataAccessibilityData: { ariaLabel: ariaLabel },
        chartData: dataset.sortedRecordIds.map((id, index) => {
            const record = dataset.records[id];
            const key = record.getValue(ItemColumns.Key) as string;
            const keyIndex: Record<string, number> = {};
            keyIndex[key] = (keyIndex[key] || 0) + 1;
            return createChartProps(
                record,
                key + (keyIndex[key] > 1 ? `_${keyIndex[key] - 1}` : ''),
                index,
                customColor,
            );
        }),
    } as IChartProps;
}

function createChartProps(
    record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
    key: string,
    index: number,
    customColor: boolean,
): IChartDataPoint {
    return {
        legend: record.getValue(ItemColumns.Title) as string,
        data: record.getValue(ItemColumns.Value) as number,
        color: customColor ? getColorFromToken(record.getValue(ItemColumns.Color) as string) : _randomColor(index),
        xAxisCalloutData: record.getValue(ItemColumns.Callout) as string,
    } as IChartDataPoint;
}

function getDummyData(): IChartProps {
    return {
        chartTitle: 'StackChart',
        chartData: [
            {
                data: 100,
                xAxisCalloutData: '1',
                legend: 'Item ' + 1,
                color: _randomColor(1),
            },
            {
                data: 200,
                xAxisCalloutData: '2',
                legend: 'Item ' + 2,
                color: _randomColor(2),
            },
            {
                data: 300,
                xAxisCalloutData: '3',
                legend: 'Item ' + 3,
                color: _randomColor(3),
            },
        ],
    } as IChartProps;
}
