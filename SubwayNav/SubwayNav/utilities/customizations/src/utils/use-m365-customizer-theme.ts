// @ts-nocheck
import { createTheme, useCustomizationSettings } from '@fluentui/react';

import { M365LightCustomizations } from '../customizations/m365-light-theme';
import type { IM365Theme } from '../customizations/m365-theme.types';

/**
 * A hook that grabs the IM365Theme from the current customization context.
 *
 * @returns The IM365Theme from the current customizer context.
 * Returns M365LightTheme if none is present.
 */
export const useM365CustomizerTheme = (): IM365Theme => {
    const theme = useCustomizationSettings(['theme']).theme;

    return theme ?? { ...createTheme({}), ...M365LightCustomizations.settings.theme };
};
