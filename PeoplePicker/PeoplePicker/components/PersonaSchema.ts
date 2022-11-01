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
        PersonaKey: { type: 'string' },
        PersonaName: { type: 'string' },
        PersonaImgUrl: { type: 'string', format: 'uri', 'x-ms-media-kind': 'image' },
        PersonaImageAlt: { type: 'string' },
        PersonaRole: { type: 'string' },
        PersonaPresence: { type: 'string' },
    },
};

const personaSchema = {
    SelectedPeople: {
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
