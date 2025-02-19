import { IToolbarItem } from './Component.types';
import { ItemColumns, StringConstants } from '../../ManifestConstant';

export function getItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): IToolbarItem[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
    // Dataset is not defined so return empty array
        return [];
    }
    const keyIndex: Record<string, number> = {};
    return dataset.sortedRecordIds.map((id) => {
        const record = dataset.records[id];
        // Prevent duplicate keys by appending the duplicate index
        let key = (record.getFormattedValue(ItemColumns.Key) as string) ?? '';
        if (keyIndex[key] !== undefined) {
            keyIndex[key]++;
            key += `_${keyIndex[key]}`;
        } else keyIndex[key] = 1;
        return {
            id: record.getRecordId(),
            key: key,
            name: record.getFormattedValue(ItemColumns.DisplayName),
            disabled: defaultIfNullorUndefined(record.getValue(ItemColumns.Disabled) as boolean, false),
            iconName: record.getFormattedValue(ItemColumns.IconName),
            iconStyle: defaultIfNullorUndefined(record.getFormattedValue(ItemColumns.IconStyle), StringConstants.Regular), // Keep icon style - Regular as fallback
            visible: defaultIfNullorUndefined(record.getValue(ItemColumns.Visible) as boolean, true),
            tooltip: record.getFormattedValue(ItemColumns.Tooltip),
            appearance: defaultIfNullorUndefined(record.getFormattedValue(ItemColumns.Appearance), '').toLowerCase(),
            data: record,
        } as IToolbarItem;
    });
}

function defaultIfNullorUndefined<T>(value: T | null | undefined, defaultValue: T) {
    return value === null || value === undefined ? defaultValue : value;
}
