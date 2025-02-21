// @ts-nocheck
import type { IPanelProps, IPanelStyles, IStyle } from '@fluentui/react';
import { warn } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const detailPanelGutterWidth = 32;
export const detailPanelScrollablePanelButtomPadding = 32;

export const detailPanelSharedPaddingStyle: IStyle = {
    paddingLeft: detailPanelGutterWidth,
    paddingRight: detailPanelGutterWidth,
};

export const PanelStyles = (props: IPanelProps): Partial<IPanelStyles> => {
    const { theme } = props;

    const m365Theme = theme as IM365Theme;

    if (!m365Theme) {
        warn('Theme is undefined or null.');
    }

    return {
        main: [
            {
                boxShadow: m365Theme.effects.elevation64,
                background: m365Theme.semanticColors.panelBackground,
            },
        ],
        content: [detailPanelSharedPaddingStyle, { paddingBottom: detailPanelScrollablePanelButtomPadding }],
        header: [detailPanelSharedPaddingStyle], // this only gets applied in the case of a simple text header.
        footerInner: [detailPanelSharedPaddingStyle],
        closeButton: {
            color: m365Theme.semanticColors.menuIcon,
            selectors: {
                ':hover': {
                    color: m365Theme.semanticColors.menuIcon,
                },
            },
        },
    };
};
