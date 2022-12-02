import type { IM365ExtendedSemanticColors } from '../customizations/m365-extended-semantic-slots.types';
import type { IM365Theme } from '../customizations/m365-theme.types';

export const numberOfDataVisColors = 10;

export const getDataVisColorArray = (theme: IM365Theme): string[] => {
    const colors = [];

    for (let i = 1; i <= numberOfDataVisColors; i++) {
        colors.push(theme.semanticColors[`dataVis${i}` as keyof IM365ExtendedSemanticColors]);
    }

    return colors;
};
