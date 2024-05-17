import { DataVizPalette, IGaugeChartSegment, getColorFromToken } from '@fluentui/react-charting';
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
    return getColorFromToken(_colors[index][Math.floor(Math.random() * _colors[index].length)]);
}

export function getChartDataFromDataset(
    dataset: ComponentFramework.PropertyTypes.DataSet,
    customColor: boolean,
): IGaugeChartSegment[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return [getDummyAction('First', 1), getDummyAction('Second', 2), getDummyAction('Third', 3)];
    }
    const keyIndex: Record<string, number> = {};
    if (customColor) {
        return dataset.sortedRecordIds.map((id, index) => {
            const record = dataset.records[id];

            // Prevent duplicate keys by appending the duplicate index
            let key = record.getValue(ItemColumns.Key) as string;
            if (keyIndex[key] !== undefined) {
                keyIndex[key]++;
                key += `_${keyIndex[key]}`;
            } else keyIndex[key] = 1;
            return {
                id: record.getRecordId(),
                key: key,
                legend: record.getValue(ItemColumns.Legend) as string,
                size: record.getValue(ItemColumns.Size) as number,
                color: _randomColor(index),
            } as IGaugeChartSegment;
        });
    }
    return dataset.sortedRecordIds.map((id, index) => {
        const record = dataset.records[id];

        // Prevent duplicate keys by appending the duplicate index
        let key = record.getValue(ItemColumns.Key) as string;
        if (keyIndex[key] !== undefined) {
            keyIndex[key]++;
            key += `_${keyIndex[key]}`;
        } else keyIndex[key] = 1;
        return {
            id: record.getRecordId(),
            key: key,
            legend: record.getValue(ItemColumns.Legend) as string,
            size: record.getValue(ItemColumns.Size) as number,
            color: _randomColor(index),
        } as IGaugeChartSegment;
    });
}

function getDummyAction(key: string, index: number): IGaugeChartSegment {
    return {
        id: key,
        key: key,
        legend: key,
        color: _randomColor(index),
        size: 30,
    } as IGaugeChartSegment;
}
