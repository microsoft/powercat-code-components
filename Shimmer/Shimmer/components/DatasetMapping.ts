import { ICustomShimmerItem } from './Component.types';
import { ItemColumns } from '../ManifestConstants';
import { IShimmerElement, ShimmerElementType } from '@fluentui/react';
export function getItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): ICustomShimmerItem[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return getDummyItems();
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
            data: record,
        } as ICustomShimmerItem;
    });
}

export function getShimmerElements(items: ICustomShimmerItem[]): IShimmerElement[] {
    return items.map((item: ICustomShimmerItem) => ({
        type: getShimmerElementType(item.type),
        ...(typeof item.width !== 'undefined' && item.width !== null && { width: item.width + '%' }),
        ...(typeof item.height !== 'undefined' && item.height !== null && { height: item.height }),
        ...(typeof item.verticalAlign !== 'undefined' && item.verticalAlign !== null && { width: item.verticalAlign }),
    })) as IShimmerElement[];
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

function getDummyItems(): ICustomShimmerItem[] {
    return [
        {
            width: '3.8',
            height: 25,
            type: 'circle',
        },
        {
            width: '5',
            height: 10,
            type: 'gap',
        },
        {
            width: '100',
            height: 20,
            type: 'line',
        },
        {
            width: '10',
            height: 10,
            type: 'gap',
        },
        {
            width: '100',
            height: 20,
            type: 'line',
        }
    ] as unknown as ICustomShimmerItem[];
}
