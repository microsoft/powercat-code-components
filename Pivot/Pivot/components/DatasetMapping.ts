import { PivotLink } from './Component.types';
import { ItemColumns } from '../ManifestConstants';

export function getPivotItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): PivotLink[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return [getDummyAction('1'), getDummyAction('2'), getDummyAction('3')];
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
            name: record.getValue(ItemColumns.DisplayName) as string,
            enabled: record.getValue(ItemColumns.Enabled) as boolean,
            iconName: record.getValue(ItemColumns.IconName) as string,
            iconColor: record.getValue(ItemColumns.IconColor) as string,
            textColor: record.getValue(ItemColumns.TextColor) as string,
            parentItemKey: record.getValue(ItemColumns.ParentKey) as string,
            iconOnly: record.getValue(ItemColumns.IconOnly) as boolean,
            checked: record.getValue(ItemColumns.Checked) as boolean,
            visible: record.getValue(ItemColumns.Visible) as boolean,
            itemCount: (record.getValue(ItemColumns.ItemCount) as number) ?? undefined,
            data: record,
        } as PivotLink;
    });
}

function getDummyAction(key: string): PivotLink {
    return {
        id: key,
        key: key,
        name: 'Item ' + key,
        iconName: 'Unknown',
    } as PivotLink;
}
