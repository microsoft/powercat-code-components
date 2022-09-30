import { ItemColumns } from '../ManifestConstants';
import { PersonaSize, OverflowButtonType, PersonaPresence } from '@fluentui/react';

export function getUrlfromImage(record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageData = undefinedIfNullish(record.getValue(ItemColumns.Image) as any) ?? '';
    return imageData ? `data:image/jpeg;base64, ${imageData.fileContent}` : imageData;
}

export function getImageUrl(record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord): string {
    return (record.getValue(ItemColumns.ImageInfo) as string) ?? '';
}

export function undefinedIfNullish<T>(value: T): T | undefined {
    return defaultIfNullish(value, undefined);
}
function defaultIfNullish<T>(value: T, defaultValue: T) {
    return (value as T) ? value : defaultValue;
}

export function getPersonaPresence(record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord): PersonaPresence {
    const personaPresence = undefinedIfNullish(record.getValue(ItemColumns.Presence));
    if (personaPresence) {
        switch ((personaPresence as string).toLowerCase()) {
            case 'away':
                return PersonaPresence.away;
            case 'blocked':
                return PersonaPresence.blocked;
            case 'busy':
                return PersonaPresence.busy;
            case 'dnd':
                return PersonaPresence.dnd;
            case 'none':
                return PersonaPresence.none;
            case 'offline':
                return PersonaPresence.offline;
            case 'online':
                return PersonaPresence.online;
            default:
                return PersonaPresence.none;
        }
    } else {
        return PersonaPresence.none;
    }
}

export function getPersonaSize(sizeSelected: string): PersonaSize {
    switch (sizeSelected.toLowerCase()) {
        case 'size8':
            return PersonaSize.size8;
        case 'size24':
            return PersonaSize.size24;
        case 'size32':
            return PersonaSize.size32;
        case 'size40':
            return PersonaSize.size40;
        case 'size48':
            return PersonaSize.size48;
        case 'size56':
            return PersonaSize.size56;
        default:
            return PersonaSize.size32;
    }
}

export function getOverflowButtonType(btnTypeSelected: string): OverflowButtonType {
    switch (btnTypeSelected.toLowerCase()) {
        case 'none':
            return OverflowButtonType.none;
        case 'descriptive':
            return OverflowButtonType.descriptive;
        case 'downarrow':
            return OverflowButtonType.downArrow;
        case 'more':
            return OverflowButtonType.more;
        default:
            return OverflowButtonType.descriptive;
    }
}
