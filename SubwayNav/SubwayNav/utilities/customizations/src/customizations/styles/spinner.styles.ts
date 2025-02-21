// @ts-nocheck
import type { ISpinnerStyleProps, ISpinnerStyles } from '@fluentui/react';
import { warn } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const SpinnerStyles = (props: ISpinnerStyleProps): Partial<ISpinnerStyles> => {
    const { theme } = props;
    const m365Theme = theme as IM365Theme;

    if (!m365Theme) {
        warn('Theme is undefined or null.');
    }

    return {
        circle: {
            borderTopColor: m365Theme.palette.themeDarkAlt,
        },
        label: {
            color: m365Theme.palette.themeDarkAlt,
        },
    };
};
