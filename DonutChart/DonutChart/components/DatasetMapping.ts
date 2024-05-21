import { DataVizPalette, IChartDataPoint, getColorFromToken } from '@fluentui/react-charting';
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
    const colorArray = _colors[index % _colors.length];
    return getColorFromToken(colorArray[Math.floor(Math.random() * colorArray.length)]);
}

function getKeyWithSuffix(keyIndex: Record<string, number>, key: string): string {
    if (keyIndex[key] !== undefined) {
        keyIndex[key]++;
        return `${key}_${keyIndex[key]}`;
    } else {
        keyIndex[key] = 1;
        return key;
    }
}

export function getChartDataFromDataset(
    dataset: ComponentFramework.PropertyTypes.DataSet,
    customColor: boolean,
): IChartDataPoint[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        return Array.from({ length: 3 }, (_, i) => getDummyAction(`Action${i + 1}`, i));
    }
    const keyIndex: Record<string, number> = {};
    return dataset.sortedRecordIds.map((id, index) => {
        const record = dataset.records[id];
        const key = getKeyWithSuffix(keyIndex, record.getValue(ItemColumns.Key) as string);
        return {
            id: record.getRecordId(),
            key: key,
            legend: record.getValue(ItemColumns.Legend) as string,
            color: customColor ? getColorFromToken(record.getValue(ItemColumns.Color) as string) : _randomColor(index),
            data: record.getValue(ItemColumns.Value) as number,
        } as IChartDataPoint;
    });
}

function getDummyAction(key: string, index: number): IChartDataPoint {
    return {
        id: key,
        key: key,
        legend: key,
        color: _randomColor(index),
        data: 30,
    } as IChartDataPoint;
}
