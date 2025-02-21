// @ts-nocheck
import type { IOverlayStyleProps, IOverlayStyles } from '@fluentui/react';
import { warn } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const OverlayStyles = (props: IOverlayStyleProps): Partial<IOverlayStyles> => {
    const { isDark, theme } = props;

    const m365Theme = theme as IM365Theme;

    if (!m365Theme) {
        warn('Theme is undefined or null.');
    }

    return {
        root: [
            {
                backgroundColor: m365Theme.semanticColors.overlayBackground,
            },
            isDark && [
                {
                    backgroundColor: m365Theme.semanticColors.overlayBackground,
                },
            ],
        ],
    };
};
