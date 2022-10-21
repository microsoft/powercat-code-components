export interface IOutputSchemaMap {
    [propertyKey: string]: Record<string, unknown>;
}

export class PersonaSchema {
    public static getPersonaSchema(): IOutputSchemaMap {
        return personaSchema;
    }
}

const personaDetails = {
    type: 'object',
    properties: {
        PersonaKey: { type: 'number' },
        PersonaName: { type: 'string' },
        PersonaImgUrl: { type: 'string', format: 'uri', 'x-ms-media-kind': 'image' },
        PersonaImageAlt: { type: 'string' },
        PersonaRole: { type: 'string' },
        PersonaPresence: { type: 'number' },
    },
};

const personaSchema = {
    SelectedUsers: {
        type: 'array',
        items: personaDetails,
    },
    SearchText: {
        type: 'string',
    },
    AutoHeight: {
        type: 'number',
    },
};
