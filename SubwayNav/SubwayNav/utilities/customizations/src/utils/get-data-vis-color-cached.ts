// @ts-nocheck
import type { IM365ExtendedSemanticColors } from '../customizations/m365-extended-semantic-slots.types';
import type { IM365Theme } from '../customizations/m365-theme.types';
import { getDataVisColorArray } from './get-data-vis-color-array';
import type { GetDataVisColorCachedFunction } from './get-data-vis-color-cached.types';

let cachedValues: Map<string, { incrementer: number; itemMap: Map<string, string> }>;
let prevTheme: IM365Theme | undefined;

export const getDataVisColorCached: GetDataVisColorCachedFunction = <T extends keyof IM365ExtendedSemanticColors>(
    theme: IM365Theme,
    key: string,
    itemKey: string,
    themeChangeKey?: T,
): string => {
    const themeChangeKeyValue = themeChangeKey || 'bodyBackground';

    // if no theme exists or the theme changes, store the new theme and reset our cache
    if (!prevTheme || prevTheme.semanticColors[themeChangeKeyValue] !== theme.semanticColors[themeChangeKeyValue]) {
        prevTheme = theme;
        cachedValues = new Map();
    }

    let returnColor: string;
    const keyValue = cachedValues.get(key);

    if (keyValue) {
        const itemValue = keyValue.itemMap.get(itemKey);

        if (itemValue) {
            // our value exists, simply return it
            returnColor = itemValue;
        } else {
            const colors = getDataVisColorArray(theme);

            // our value doesn't exist so create an entry and increment
            returnColor = colors[keyValue.incrementer++ % colors.length];
            keyValue.itemMap.set(itemKey, returnColor);
        }
    } else {
        const colors = getDataVisColorArray(theme);

        let incrementer = 0;

        returnColor = colors[incrementer++ % colors.length];
        const itemMap: Map<string, string> = new Map();

        itemMap.set(itemKey, returnColor);
        cachedValues.set(key, { incrementer, itemMap });
    }

    return returnColor;
};
