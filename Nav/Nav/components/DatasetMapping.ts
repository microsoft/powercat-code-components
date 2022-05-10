import { NavItem } from './Component.types';
import { INavLink } from '@fluentui/react';
import { ItemColumns } from '../ManifestConstants';

export function getMenuItemsFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): NavItem[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return getDummyAction();
    }
    return dataset.sortedRecordIds.map((id) => {
        const record = dataset.records[id];
        return {
            id: record.getRecordId(),
            key: record.getValue(ItemColumns.Key) as string,
            name: record.getValue(ItemColumns.DisplayName) as string,
            enabled: record.getValue(ItemColumns.Enabled) as boolean,
            iconName: record.getValue(ItemColumns.IconName) as string,
            iconColor: record.getValue(ItemColumns.IconColor) as string,
            parentItemKey: record.getValue(ItemColumns.ParentKey) as string,
            visible: record.getValue(ItemColumns.Visible) as boolean,
            isExpanded: record.getValue(ItemColumns.Expanded) as boolean,
            data: record,
        } as NavItem;
    });
}

/**
 * This method is primarily to structure the links as a tree to support Fluent UI Nav
 * @param items
 * @returns
 */
export function getTreeBasedGrpLinks(items: NavItem[]): NavItem[] {
    let root: NavItem[] = [];
    //Creating a custom rootID for NavGroupLink root node.
    const rootID = 'rootID'.concat(items[0].key, items[items.length - 1].key);
    items.map((item) => {
        // identify root and orphan items and replace their parentkey with rootID
        if (item.parentItemKey !== undefined) {
            if (
                items
                    .map((item) => {
                        return item.key;
                    })
                    .indexOf(item.parentItemKey) === -1
            ) {
                item.parentItemKey = rootID;
            }
        } else {
            item.parentItemKey = rootID;
        }
    });
    //add custom root to accomodate orphan items or links
    items.unshift({ id: rootID, name: rootID, key: rootID, parentItemKey: null } as unknown as NavItem);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyMapping = items.reduce((prevGrp: any, currentGrp, i) => {
        prevGrp[currentGrp.key] = i;
        return prevGrp;
    }, {});
    items.map((grp) => {
        // Handle the root element
        if (grp.parentItemKey == null) {
            root = [grp] as unknown as NavItem[];
            return;
        }
        if (items[keyMapping[grp.key]].visible !== false) {
            const parentGrp = items[keyMapping[grp.parentItemKey]] as unknown as INavLink;
            parentGrp.links = [...(parentGrp.links || []), grp];
        }
    });
    return root;
}

function getDummyAction(): NavItem[] {
    return [
        {
            id: '1',
            key: '1',
            name: 'Item ' + 1,
        },
        {
            id: '2',
            key: '2',
            name: 'Item ' + 2,
            isExpanded: true,
        },
        {
            id: '3',
            key: '3',
            name: 'Item ' + 3,
            isExpanded: true,
        },
        {
            id: '4',
            key: '4',
            name: 'Item ' + 4,
            visible: false,
        },
        {
            id: '5',
            key: '5',
            name: 'Item ' + 5,
            parentItemKey: '3',
        },
        {
            id: '6',
            key: '6',
            name: 'Item ' + 6,
            parentItemKey: '2',
            isExpanded: false,
        },
        {
            id: '7',
            key: '7',
            name: 'Item ' + 7,
            parentItemKey: '6',
        },
        {
            id: '8',
            key: '8',
            name: 'Item ' + 8,
            parentItemKey: '7',
            isExpanded: true,
        },
        {
            id: '9',
            key: '9',
            name: 'Item ' + 9,
            parentItemKey: '8',
        },
        {
            id: '10',
            key: '10',
            name: 'Item ' + 10,
            parentItemKey: '9',
            isExpanded: true,
        },
        {
            id: '11',
            key: '11',
            name: 'Item ' + 11,
        },
        {
            id: '12',
            key: '12',
            name: 'Item ' + 12,
        },
        {
            id: '13',
            key: '13',
            name: 'Item ' + 13,
            parentItemKey: '12',
        },
        {
            id: '14',
            key: '14',
            name: 'Item ' + 14,
            parentItemKey: '12',
        },
        {
            id: '15',
            key: '15',
            name: 'Item ' + 12,
            parentItemKey: '15',
        },
    ] as unknown as NavItem[];
}
