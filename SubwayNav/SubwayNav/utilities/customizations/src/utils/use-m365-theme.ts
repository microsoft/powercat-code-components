import { useTheme } from '@fluentui/react';

import type { IM365Theme } from '../customizations/m365-theme.types';
import { useM365CustomizerTheme } from './use-m365-customizer-theme';

/**
 * A hook that grabs the IM365Theme from the current context or provider.
 * This will be compatible with both v7 customizer and v8 theme provider.
 *
 * @returns The IM365Theme from the current customizer context.
 * Returns M365LightTheme if none is present.
 */
export const useM365Theme = (): IM365Theme => {
    const customizerTheme = useM365CustomizerTheme();
    const providerTheme = useTheme() as IM365Theme;

    return providerTheme ? providerTheme : customizerTheme;
};
