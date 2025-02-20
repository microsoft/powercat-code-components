// @ts-nocheck
import type { ISettings } from '@fluentui/react';
import { CustomizerContext, useTheme } from '@fluentui/react';
import { useContext } from 'react';

const useM365CustomizerStyles = (): { [key: string]: ISettings } => {
    return useContext(CustomizerContext).customizations.scopedSettings;
};

/**
 * A hook that grabs the style object from the customizer and theme provider contexts.
 *
 * If both are present it favors the styles from the theme provider.
 */
export const useThemeStyles = (): { [key: string]: ISettings } => {
    const customizerStyles = useM365CustomizerStyles();
    const providerTheme = useTheme();

    return providerTheme?.components ? providerTheme?.components : customizerStyles;
};
