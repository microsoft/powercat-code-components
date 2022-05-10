import { TagListItem } from './Component.types';
import { ItemColumns } from '../ManifestConstants';

export function getTagItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): TagListItem[] {
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
            borderColor: record.getValue(ItemColumns.BorderColor) as string,
            backgroundColor: record.getValue(ItemColumns.BackgroundColor) as string,
            iconOnly: record.getValue(ItemColumns.IconOnly) as boolean,
            visible: record.getValue(ItemColumns.Visible) as boolean,
            data: record,
        } as TagListItem;
    });
}

function getDummyAction(key: string): TagListItem {
    return {
        id: key,
        key: key,
        name: 'Item ' + key,
        iconName: 'Unknown',
    } as TagListItem;
}
