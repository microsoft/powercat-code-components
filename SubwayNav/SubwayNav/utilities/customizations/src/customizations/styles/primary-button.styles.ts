import type { IButtonProps, IButtonStyles } from '@fluentui/react';
import { warn } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const PrimaryButtonStyles = (props: IButtonProps): Partial<IButtonStyles> => {
    const { theme } = props;
    const m365Theme = theme as IM365Theme;

    if (!m365Theme) {
        warn('Theme is undefined or null.');
    }

    return {
        root: {
            color: m365Theme.semanticColors.primaryButtonText,
            border: 'none',
        },
        rootHovered: {
            color: m365Theme.semanticColors.primaryButtonTextHovered,
            border: 'none',
        },
        rootPressed: {
            color: m365Theme.semanticColors.primaryButtonTextPressed,
            border: 'none',
        },
        rootChecked: {
            color: m365Theme.semanticColors.primaryButtonText,
        },
    };
};
