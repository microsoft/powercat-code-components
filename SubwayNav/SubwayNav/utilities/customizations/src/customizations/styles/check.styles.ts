// @ts-nocheck
import type { ICheckStyleProps, ICheckStyles } from '@fluentui/react';
import { FontWeights, warn } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const CheckStyles = ({ checked, theme }: ICheckStyleProps): Partial<ICheckStyles> => {
    const m365Theme = theme as IM365Theme;

    if (!m365Theme) {
        warn('Theme is undefined or null.');
    }

    return {
        root: [
            {
                cursor: 'pointer',
                width: '16px',
                height: '16px',
                '::before': {
                    transition: 'all ease-in-out 200ms',
                    // Because the ::before element is layering on top of CircleRing <i> border, we are increasing the border
                    // radius here to 3px, so it doesn’t compete. When both are 2px, the contour might look fuzzy.
                    borderRadius: '3px',
                    backgroundColor: 'transparent',
                    inset: 0,
                    height: '100%',
                    width: '100%',
                },
            },
            checked && {
                ':hover': {
                    '::before': {
                        backgroundColor: m365Theme.semanticColors.inputBackgroundCheckedHovered,
                    },
                    '[data-icon-name="CircleRing"]': {
                        borderColor: m365Theme.semanticColors.inputBackgroundCheckedHovered,
                    },
                },
                '::before': {
                    backgroundColor: m365Theme.semanticColors.inputBackgroundChecked,
                },
                '[data-icon-name="StatusCircleCheckmark"]': {
                    opacity: 1,
                },
            },
        ],
        check: [
            {
                fontSize: '18px',
                lineHeight: '16px',
                margin: '0',
                width: '16px',
                height: '16px',
                fontWeight: FontWeights.regular,
                transition: 'opacity ease-in-out 100ms',
                opacity: 0,
                boxSizing: 'border-box',
            },
            checked && {
                color: m365Theme.semanticColors.alwaysWhite,
            },
        ],
        circle: [
            {
                fontSize: 0,
                width: '16px',
                height: '16px',
                borderRadius: 2,
                borderColor: m365Theme.semanticColors.inputBorder,
                borderWidth: '1px',
                borderStyle: 'solid',
                transition: 'all ease-in-out 200ms',
                boxSizing: 'border-box',
            },
            checked && {
                color: m365Theme.semanticColors.alwaysWhite,
                borderColor: m365Theme.semanticColors.inputBackgroundChecked,
            },
        ],
    };
};
