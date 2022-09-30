import { IFacepilePersona } from '@fluentui/react';
import { ItemColumns } from '../ManifestConstants';
import { ICustomFacepile } from './Component.types';
import { undefinedIfNullish, getImageUrl, getUrlfromImage } from './Helper';

export function getitemFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): ICustomFacepile[] {
    if (dataset.error || dataset.paging.totalResultCount === undefined) {
        // Dataset is not defined so return dummy items
        return getDummyAction();
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
            personaName: record.getFormattedValue(ItemColumns.DisplayName),
            imageUrl: undefinedIfNullish(record.getValue(ItemColumns.IsImage) as boolean)
                ? getUrlfromImage(record)
                : getImageUrl(record),
            data: record,
            presence: record.getValue(ItemColumns.Presence) as string,
            clickable: (record.getValue(ItemColumns.Clickable) as boolean) ?? false,
        } as ICustomFacepile;
    });
}

export function getFacepilePersonas(
    items: ICustomFacepile[],
    onClick: (ev?: unknown, item?: IFacepilePersona) => void,
): ICustomFacepile[] {
    return items.map((item: ICustomFacepile) => ({
        id: item.id,
        key: item.key,
        personaName: item.personaName,
        presence: item.presence,
        imageUrl: item.imageUrl,
        ...(item.clickable && { onClick: onClick }),
    })) as ICustomFacepile[];
}

function getDummyAction(): ICustomFacepile[] {
    return [
        {
            id: '1',
            key: '1',
            personaName: 'Megan Bowen',
            imageUrl:
                'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png',
            imageInitials: 'Item ' + 1,
            initialsColor: 1,
            presence: 'none',
        },
        {
            id: '2',
            key: '2',
            personaName: 'Diego Siciliano',
            imageUrl:
                'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-male.png',
            imageInitials: 'Item ' + 1,
            initialsColor: 1,
            presence: 'none',
        },
    ] as ICustomFacepile[];
}
