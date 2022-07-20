import { CanvasCommandItem } from './Component.types';
import {
    ContextualMenuItemType,
    getColorFromString,
    getShade,
    IButtonStyles,
    ICommandBarItemProps,
    IContextualMenuItem,
    IIconProps,
    Shade,
} from '@fluentui/react';
import { ItemColumns } from '../ManifestConstants';

export function getMenuItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): CanvasCommandItem[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return [getDummyAction('1'), getDummyAction('2'), getDummyAction('3')];
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
            enabled: defaultIfNull(record.getValue(ItemColumns.Enabled) as boolean, true),
            iconName: record.getFormattedValue(ItemColumns.IconName),
            iconColor: record.getFormattedValue(ItemColumns.IconColor),
            farItem: undefinedIfNull(record.getValue(ItemColumns.FarItem) as boolean),
            overflow: undefinedIfNull(record.getValue(ItemColumns.Overflow) as boolean),
            parentItemKey: record.getFormattedValue(ItemColumns.ParentKey),
            iconOnly: undefinedIfNull(record.getValue(ItemColumns.IconOnly) as boolean),
            checked: undefinedIfNull(record.getValue(ItemColumns.Checked) as boolean),
            visible: defaultIfNull(record.getValue(ItemColumns.Visible) as boolean, true),
            split: undefinedIfNull(record.getValue(ItemColumns.Split) as boolean),
            isHeader: (record.getValue(ItemColumns.ItemHeader) as boolean) ?? undefined,
            topDivider: (record.getValue(ItemColumns.ItemTopDivider) as boolean) ?? undefined,
            divider: (record.getValue(ItemColumns.ItemDivider) as boolean) ?? undefined,
            data: record,
        } as CanvasCommandItem;
    });
}

function getDummyAction(key: string): CanvasCommandItem {
    return {
        id: key,
        key: key,
        name: 'Item ' + key,
        iconName: 'Unknown',
    } as CanvasCommandItem;
}

export function getCommandsWithChildren(
    items: CanvasCommandItem[],
    disabled: boolean,
    onClick: (ev?: React.MouseEvent<HTMLButtonElement>, item?: IContextualMenuItem | undefined) => boolean,
): ICommandBarItemProps[] {
    return items
        .filter((i) => !i.parentItemKey && i.visible !== false)
        .map((i) => {
            return getCommandBarItemProps(items, i, disabled, onClick);
        });
}

export function getCommandBarItemProps(
    items: CanvasCommandItem[],
    item: CanvasCommandItem,
    disabled: boolean,
    onClick: (ev?: React.MouseEvent<HTMLButtonElement>, item?: IContextualMenuItem | undefined) => boolean,
): ICommandBarItemProps {
    const subItems = items
        .filter((i) => i.parentItemKey === item.key && i !== item && i.visible !== false)
        .map((i) => {
            return getCommandBarItemProps(items, i, disabled, onClick);
        });

    const buttonStyles = {
        root: {
            background: 'rgba(255, 255, 255,0)',
        },
    } as IButtonStyles;

    const iconProps =
        item.iconName &&
        ({
            iconName: item.iconName,
        } as IIconProps);

    // If custom icon color, find the shade slots for the hover/pressed state
    if (iconProps && item.iconColor) {
        const iconColor = item.iconColor;
        iconProps.styles = { root: { color: item.iconColor + ' !important' } };

        // Attempt to set a darker shade for hover/pressed colors
        const primaryColor = getColorFromString(iconColor);
        if (primaryColor) {
            const iconColorDarker = getShade(primaryColor, Shade.Shade8);
            const secondaryColorStyle = { color: iconColorDarker?.str + ' !important' };
            buttonStyles.iconHovered = secondaryColorStyle;
            buttonStyles.iconPressed = secondaryColorStyle;
            buttonStyles.iconExpanded = secondaryColorStyle;
            buttonStyles.iconChecked = secondaryColorStyle;
            buttonStyles.iconExpandedHovered = secondaryColorStyle;
        }
    }

    const props = {
        key: item.key,
        text: item.name,
        disabled: item.enabled === false || disabled,
        onClick: onClick,
        iconOnly: item.iconOnly === true,
        iconProps: iconProps,
        split: item.split,
        canCheck: item.checked !== undefined,
        checked: item.checked,
        data: item,
        buttonStyles: buttonStyles,
        subMenuProps:
            subItems.length > 0
                ? {
                      items: subItems,
                  }
                : undefined,
    } as ICommandBarItemProps;

    if (item.isHeader === true && subItems.length > 0) {
        // Semantic Section
        props.itemType = ContextualMenuItemType.Section;
        props.sectionProps = {
            title: item.name,
            topDivider: item.topDivider,
            bottomDivider: item.divider,
            items: subItems,
        };
    } else if (item.isHeader === true) {
        // Simple Section Break
        props.itemType = ContextualMenuItemType.Header;
    } else if (item.divider === true) {
        // Divider Break
        props.itemType = ContextualMenuItemType.Divider;
    } else {
        props.itemType = ContextualMenuItemType.Normal;
        props.subMenuProps =
            subItems.length > 0
                ? {
                      items: subItems,
                  }
                : undefined;
    }
    return props;
}

function undefinedIfNull<T>(value: T | null) {
    return defaultIfNull(value, undefined);
}
function defaultIfNull<T>(value: T | null, defaultValue: T) {
    return value === null ? defaultValue : value;
}
