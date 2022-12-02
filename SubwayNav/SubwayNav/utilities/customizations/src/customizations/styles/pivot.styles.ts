import type { IPivotStyleProps, IPivotStyles } from '@fluentui/react';
import { HighContrastSelector, warn } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const PivotStyles = (props: IPivotStyleProps): Partial<IPivotStyles> => {
    const { theme } = props;
    const m365Theme = theme as IM365Theme;

    if (!m365Theme) {
        warn('M365Styles-Pivot error: Theme is undefined or null.');
    }

    return {
        link: [
            {
                ':hover': {
                    backgroundColor: m365Theme.semanticColors.dashboardBackdrop,
                },
                [HighContrastSelector]: {
                    border: 'none',
                },
            },
        ],
        linkIsSelected: [
            {
                ':hover': {
                    backgroundColor: m365Theme.semanticColors.dashboardBackdrop,
                },
                [HighContrastSelector]: {
                    border: 'none',
                },
            },
        ],
    };
};

// This accounts for the padding built into the Pivot
// And left aligns to text of the pivot with the rest of the content.
// Hover backplate will spill over passed content
//
// Because this change is so drastic, we're NOT exporting it as part of our default M365Styles.
// Folks are encouraged to use the M365Pivot which gets this baked in.

export const rootPivotMargin: Partial<IPivotStyles> = {
    root: {
        marginLeft: -8,
    },
};
