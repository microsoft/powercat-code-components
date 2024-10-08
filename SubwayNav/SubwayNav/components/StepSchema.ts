export interface IOutputSchemaMap {
    [propertyKey: string]: Record<string, unknown>;
}

export class StepSchema {
    public static getStepSchema(): IOutputSchemaMap {
        return stepSchema;
    }
}

const stepDetails = {
    type: 'object',
    properties: {
        ItemKey: { type: 'string' },
        ItemLabel: { type: 'string' },
        ItemState: { type: 'string' },
        ItemDisabled: { type: 'boolean' },
        ItemVisuallyDisabled: { type: 'boolean' },
        ParentItemKey: { type: 'string' },
        ItemIcon: { type: 'string' },
        ItemColor: { type: 'string' },
    },
};

const stepSchema = {
    Steps: {
        type: 'array',
        items: stepDetails,
    },
};
