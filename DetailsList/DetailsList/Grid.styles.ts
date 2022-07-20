export function concatClassNames(classNames: (string | undefined)[]): string | undefined {
    const classes = classNames.filter((c) => c !== undefined && c !== '').join(' ');
    return classes !== '' ? classes : undefined;
}

export const ClassNames = {
    PowerCATFluentDetailsList: 'PowerCATFluentDetailsList',
    subTextRowBreak: 'sub-text-row-wrapper-break',
    inlineLabel: 'inine-label',
    statusTag: 'status-tag',
    textTag: 'text-tag',
    imageButton: 'image-button',
    expandIcon: 'expand-icon',
    cellTypePrefix: 'celltype-',
};

export const FontStyles = {
    Normal: { fontWeight: 400 },
    Bold: { fontWeight: 600 },
};
