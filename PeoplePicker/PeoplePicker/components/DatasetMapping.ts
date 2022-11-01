import { ICustomPersonaProps } from './Component.types';
import { PersonaColumns, SuggestionColumns } from '../ManifestConstants';
import { IPersonaProps, PersonaPresence } from '@fluentui/react';

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
            key: key,
            text: (record.getValue(PersonaColumns.PersonaName) as string) ?? '',
            imageUrl: (record.getValue(PersonaColumns.PersonaImgUrl) as string) ?? '',
            imageInitials: (record.getValue(PersonaColumns.PersonaImageAlt) as string) ?? '',
            presence: getPersonaPresence((record.getValue(PersonaColumns.PersonaPresence) as string) ?? ''),
            secondaryText: (record.getValue(PersonaColumns.PersonaRole) as string) ?? '',
            isOutOfOffice: (record.getValue(PersonaColumns.PersonaOOF) as boolean) ?? false,
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
            key: key,
            text: (record.getValue(SuggestionColumns.SuggestionName) as string) ?? '',
            imageUrl: (record.getValue(SuggestionColumns.SuggestionImgUrl) as string) ?? '',
            imageInitials: (record.getValue(SuggestionColumns.SuggestionImageAlt) as string) ?? '',
            presence: getPersonaPresence((record.getValue(SuggestionColumns.SuggestionPresence) as string) ?? ''),
            secondaryText: (record.getValue(SuggestionColumns.SuggestionRole) as string) ?? '',
            isOutOfOffice: (record.getValue(SuggestionColumns.SuggestionOOF) as boolean) ?? false,
        } as IPersonaProps;
    });
}

export function getPersonaPresence(personaPresence: string): PersonaPresence {
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

export function getDataSetFromPersona(selectedPeople: IPersonaProps[]): ICustomPersonaProps[] {
    return selectedPeople.map((user) => {
        return {
            PersonaKey: user.key,
            PersonaName: user.text,
            PersonaImageAlt: user.imageAlt,
            PersonaImgUrl: user.imageUrl,
            PersonaPresence: user.presence
                ? Object.keys(PersonaPresence)[Object.values(PersonaPresence).indexOf(user.presence)]
                : '',
            PersonaRole: user.secondaryText,
        } as ICustomPersonaProps;
    });
}
