import { CanvasContextMenuItem } from './Component.types';
import { IContextualMenuItem } from '@fluentui/react';
import { ItemColumns } from '../ManifestConstants';

export function getMenuItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): CanvasContextMenuItem[] {
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
            parentItemKey: record.getValue(ItemColumns.ParentKey) as string,
            iconOnly: record.getValue(ItemColumns.IconOnly) as boolean,
            checked: record.getValue(ItemColumns.Checked) as boolean,
            visible: record.getValue(ItemColumns.Visible) as boolean,
            data: record,
        } as CanvasContextMenuItem;
    });
}

function getDummyAction(key: string): CanvasContextMenuItem {
    return {
        id: key,
        key: key,
        name: 'Item ' + key,
        iconName: 'Unknown',
    } as CanvasContextMenuItem;
}

export function getCommandsWithChildren(
    items: CanvasContextMenuItem[],
    disabled: boolean,
    onClick: (ev?: unknown, item?: IContextualMenuItem | undefined) => boolean,
): IContextualMenuItem[] {
    return items
        .filter((i) => !i.parentItemKey && i.visible !== false)
        .map((i) => {
            return getCommandBarItemProps(items, i, disabled, onClick);
        });
}

export function getCommandBarItemProps(
    items: CanvasContextMenuItem[],
    item: CanvasContextMenuItem,
    disabled: boolean,
    onClick: (ev?: unknown, item?: IContextualMenuItem | undefined) => boolean,
): IContextualMenuItem {
    const subItems = items
        .filter((i) => i.parentItemKey === item.key && i.visible !== false)
        .map((i) => {
            return getCommandBarItemProps(items, i, disabled, onClick);
        });
    return {
        key: item.key,
        text: item.name,
        disabled: item.enabled === false || disabled,
        onClick: onClick,
        iconOnly: item.iconOnly === true,
        iconProps: {
            iconName: item.iconName,
            styles: { root: { color: item.iconColor } },
        },
        checked: item.checked,
        data: item,
        buttonStyles: { root: { background: 'rgba(255, 255, 255,0)' } },
        subMenuProps:
            subItems.length > 0
                ? {
                      items: subItems,
                  }
                : undefined,
    } as IContextualMenuItem;
}
