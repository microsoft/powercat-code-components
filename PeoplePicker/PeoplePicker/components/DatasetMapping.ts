import { ICustomPersonaProps } from './Component.types';
import { PersonaColumns, SuggestionColumns } from '../ManifestConstants';
import { IPersonaProps } from '@fluentui/react';

export function getPersonaFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): IPersonaProps[] {
    const keyIndex: Record<string, number> = {};
    return dataset.sortedRecordIds.map((id) => {
        const record = dataset.records[id];
        // Prevent duplicate keys by appending the duplicate index
        let key = (record.getValue(PersonaColumns.PersonaKey) as string) ?? '';
        if (keyIndex[key] !== undefined) {
            keyIndex[key]++;
            key += `_${keyIndex[key]}`;
        } else keyIndex[key] = 1;
        return {
            id: key,
            key: key,
            text: (record.getValue(PersonaColumns.PersonaName) as string) ?? '',
            imageUrl: (record.getValue(PersonaColumns.PersonaImgUrl) as string) ?? '',
            imageInitials: (record.getValue(PersonaColumns.PersonaImageAlt) as string) ?? '',
            presence: (record.getValue(PersonaColumns.PersonaPresence) as number) ?? '',
            secondaryText: (record.getValue(PersonaColumns.PersonaRole) as string) ?? '',
        } as IPersonaProps;
    });
}

export function getSuggestionFromDataset(dataset: ComponentFramework.PropertyTypes.DataSet): IPersonaProps[] {
    const keyIndex: Record<string, number> = {};
    return dataset.sortedRecordIds.map((id) => {
        const record = dataset.records[id];
        // Prevent duplicate keys by appending the duplicate index
        let key = (record.getValue(SuggestionColumns.SuggestionKey) as string) ?? '';
        if (keyIndex[key] !== undefined) {
            keyIndex[key]++;
            key += `_${keyIndex[key]}`;
        } else keyIndex[key] = 1;
        return {
            id: key,
            key: key,
            text: (record.getValue(SuggestionColumns.SuggestionName) as string) ?? '',
            imageUrl: (record.getValue(SuggestionColumns.SuggestionImgUrl) as string) ?? '',
            imageInitials: (record.getValue(SuggestionColumns.SuggestionImageAlt) as string) ?? '',
            presence: (record.getValue(SuggestionColumns.SuggestionPresence) as number) ?? undefined,
            secondaryText: (record.getValue(SuggestionColumns.SuggestionRole) as string) ?? '',
        } as IPersonaProps;
    });
}

export function getDataSetfromPersona(selectedUsers: IPersonaProps[]): ICustomPersonaProps[] {
    return selectedUsers.map((user) => {
        return {
            PersonaKey: user.key,
            PersonaName: user.text,
            PersonaImageAlt: user.imageAlt,
            PersonaImgUrl: user.imageUrl,
            PersonaPresence: user.presence,
            PersonaRole: user.secondaryText,
        } as ICustomPersonaProps;
    });
}
