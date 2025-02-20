// @ts-nocheck
import { addAlphaChannelToHex } from '../customizations/add-alpha-channel-to-hex';
import { M365LightCustomizations } from '../customizations/m365-light-theme';
import type { IM365Theme } from '../customizations/m365-theme.types';

// tslint:disable
const deepClone = (object: any) => {
    if (object === undefined) {
        return undefined;
    }

    const keys = Object.keys(object);
    const newObject = { ...object };

    keys.forEach((key) => {
        if (typeof object[key] === 'object' || Array.isArray(object[key])) {
            newObject[key] = deepClone(object[key]);
        }
    });

    return newObject;
};
// tslint:enable

/**
 * Since we use a different background color in panels,
 * most of the fabric components that use other background colors look off.
 * This function takes an IM365Theme and creates a new theme with all the relevant backgrounds being set to
 * panelBackground
 *
 * @param currentTheme The theme you would like to make panel friendly
 */
export function getPanelTheme(currentTheme: IM365Theme): IM365Theme {
    // Handle the case of undefined that we get in some testing scenarios.
    if (!currentTheme) {
        return M365LightCustomizations.settings.theme as IM365Theme;
    }

    const newTheme = deepClone(currentTheme);

    newTheme.semanticColors.inputBackground = currentTheme.semanticColors.panelBackground;
    newTheme.semanticColors.menuBackground = currentTheme.semanticColors.panelBackground;
    newTheme.semanticColors.listBackground = currentTheme.semanticColors.panelBackground;
    newTheme.semanticColors.bodyFrameBackground = currentTheme.semanticColors.panelBackground;
    newTheme.semanticColors.bodyBackground = currentTheme.semanticColors.panelBackground;
    newTheme.palette.whiteTranslucent40 = addAlphaChannelToHex(currentTheme.semanticColors.panelBackground, 40);

    return newTheme as IM365Theme;
}
