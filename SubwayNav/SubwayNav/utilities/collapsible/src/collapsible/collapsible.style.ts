import type { ITheme } from '@fluentui/react';
import { AnimationClassNames, FontWeights, getFocusStyle } from '@fluentui/react';

import type { ICollapsibleStyle, ICollapsibleStyleProps } from './collapsible.types';

export const getCollapsibleStyles = ({
    isExpanded,
    theme,
    disabled,
    isRequired,
}: ICollapsibleStyleProps): ICollapsibleStyle => ({
    root: {
        borderTop: `1px solid ${theme?.semanticColors?.bodyDivider ?? ''}`,
    },
    headerContainer: { display: 'flex', margin: 0 },
    headerButton: [
        getFocusStyle(theme as ITheme, { inset: -2 }),
        theme?.fonts?.medium,
        {
            fontWeight: FontWeights.semibold,
            cursor: disabled ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'flex-start',
            background: 'transparent',
            border: 'none',
            flex: '1 1 auto',
            textAlign: 'inherit',
            padding: '12px 0px 27px',
            margin: 0,
            color: disabled ? theme?.semanticColors?.disabledBodyText : theme?.semanticColors?.bodyText,
        },
        isExpanded && { paddingBottom: 24 },
    ],
    headerSpacer: { flex: '0 0 12px' },
    titleContainer: {
        flex: 'content 1 auto',
    },
    icon: [
        {
            transition: 'transform 200ms',
            alignSelf: 'baseline',
            marginTop: '1px',
            color: disabled ? theme?.semanticColors?.buttonTextDisabled : theme?.semanticColors?.buttonText,
            fontSize: theme?.fonts?.mediumPlus.fontSize,
            flex: '0 0 auto',
        },
        isExpanded && {
            transform: 'rotate(-180deg)',
        },
    ],
    content: [
        {
            paddingBottom: '44px',
        },
        isExpanded && AnimationClassNames.slideDownIn20,
    ],
    requiredMarker: [
        {
            color: theme?.semanticColors?.errorText,
            fontWeight: FontWeights.bold,
            flex: '1 1 auto',
        },
        isRequired && {
            selectors: {
                '::after': {
                    content: "'*'",
                },
            },
        },
    ],
});
