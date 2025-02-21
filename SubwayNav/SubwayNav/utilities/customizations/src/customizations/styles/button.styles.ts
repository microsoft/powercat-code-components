// @ts-nocheck
import type { IButtonProps, IButtonStyles, ITheme } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const ButtonStyles = (props: IButtonProps): Partial<IButtonStyles> => {
    return {
        root: {
            border: 'none',
        },
    };
};

export const navBarButtonSize = 32;

/**
 * We keep the icons black here and add some margin
 */
export const closeButtonStyles = (theme: ITheme | IM365Theme, minSize: number = navBarButtonSize) => {
    return {
        root: {
            minHeight: minSize,
            minWidth: minSize,
            display: 'flex',
            justifyContent: 'center',
            margin: 8,
            padding: 0,
            ...getBlackIconButtonColors(theme),
        },
    };
};

export const getBlackIconButtonColors = (theme: ITheme | IM365Theme) => {
    return {
        color: theme.semanticColors.buttonText,
        ':hover': {
            backgroundColor: theme.semanticColors.buttonBackgroundCheckedHovered,
            color: theme.semanticColors.buttonTextHovered,
        },
        ':active': {
            backgroundColor: theme.palette.neutralTertiary,
            color: theme.semanticColors.buttonTextPressed,
        },
        '.ms-Button-icon': {
            color: theme.semanticColors.buttonText,
        },
        '.ms-Button-menuIcon': {
            color: theme.semanticColors.buttonText,
        },
    };
};
