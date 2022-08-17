import { ICustomShimmerItem, IShimmerRows } from './Component.types';
import { ItemColumns, RowColumns } from '../ManifestConstants';
import { IShimmerElement, ShimmerElementType } from '@fluentui/react';
export function getItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): ICustomShimmerItem[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return getDummyItems(0).concat(getDummyItems(1));
    }
    const keyIndex: Record<string, number> = {};
    return dataset.sortedRecordIds.map((id) => {
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
            type: record.getValue(ItemColumns.Type) as string,
            height: record.getValue(ItemColumns.Height) as number,
            width: record.getValue(ItemColumns.Width) as string,
            verticalAlign: record.getValue(ItemColumns.VerticalAlign) as string,
            rowkey: record.getValue(ItemColumns.RowKey) as string,
            data: record,
        } as ICustomShimmerItem;
    });
}

export function getRowDetailsFromDataset(rowdataset: ComponentFramework.PropertyTypes.DataSet): IShimmerRows[] {
    if (rowdataset.error || rowdataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return [getDummyRow('1')];
    }
    const keyIndex: Record<string, number> = {};
    return rowdataset.sortedRecordIds.map((id) => {
        const record = rowdataset.records[id];
        // Prevent duplicate keys by appending the duplicate index
        let key = record.getValue(RowColumns.Key) as string;
        if (keyIndex[key] !== undefined) {
            keyIndex[key]++;
            key += `_${keyIndex[key]}`;
        } else keyIndex[key] = 1;
        return {
            id: record.getRecordId(),
            key: record.getValue(RowColumns.Key) as string,
            count: record.getValue(RowColumns.Count) as number,
            order: record.getValue(RowColumns.Order) as number,
            width: record.getValue(RowColumns.Width) as number,
            data: record,
        } as IShimmerRows;
    });
}

export function getShimmerElements(items: ICustomShimmerItem[], rowKey: string): IShimmerElement[] {
    return items
        .filter((item) => item.rowkey === rowKey)
        .map((item: ICustomShimmerItem) => ({
            type: getShimmerElementType(item.type),
            ...(typeof item.width !== 'undefined' && item.width !== null && { width: item.width + '%' }),
            ...(typeof item.height !== 'undefined' && item.height !== null && { height: item.height }),
            ...(typeof item.verticalAlign !== 'undefined' &&
                item.verticalAlign !== null && { width: item.verticalAlign }),
        })) as IShimmerElement[];
}

function getDummyRow(key: string): IShimmerRows {
    return {
        id: key,
        key: key,
        count: key === '1' ? 5 : 1,
        order: parseInt(key),
        width: 100,
    } as IShimmerRows;
}

export function getShimmerElementType(shimmerElementType: string): ShimmerElementType {
    let currentElementType: ShimmerElementType = ShimmerElementType.line;
    switch (shimmerElementType.toLowerCase()) {
        case 'circle':
            currentElementType = ShimmerElementType.circle;
            break;
        case 'gap':
            currentElementType = ShimmerElementType.gap;
            break;
        default:
            currentElementType;
    }
    return currentElementType;
}

function getDummyItems(index: number): ICustomShimmerItem[] {
    return [
        {
            id: 1,
            key: 1,
            width: index === 0 ? '3.8' : '1.8',
            height: index === 0 ? 60 : 20,
            rowkey: '1',
            type: index === 0 ? 'circle' : 'line',
        },
        {
            id: 2,
            key: 2,
            width: '2',
            height: 10,
            rowkey: '1',
            type: 'gap',
        },
        {
            id: 3,
            key: 3,
            width: '20',
            height: 10,
            rowkey: '1',
            type: 'line',
        },
        {
            id: 4,
            key: 4,
            width: '2',
            height: 10,
            rowkey: '1',
            type: 'gap',
        },
        {
            id: 5,
            key: 5,
            width: '2.8',
            height: 30,
            rowkey: '1',
            type: 'line',
        },
        {
            id: 6,
            key: 6,
            width: '2',
            height: 10,
            rowkey: '1',
            type: 'gap',
        },
        {
            id: 7,
            key: 7,
            width: '20',
            height: 10,
            rowkey: '1',
            type: 'line',
        },
        {
            id: 8,
            key: 8,
            width: '1',
            height: 10,
            rowkey: '1',
            type: 'gap',
        },
    ] as unknown as ICustomShimmerItem[];
}
