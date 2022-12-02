import type { ICheckboxProps, ICheckboxStyles } from '@fluentui/react';
import { warn } from '@fluentui/react';

import type { IM365Theme } from '../m365-theme.types';

export const CheckboxStyles = (props: ICheckboxProps): Partial<ICheckboxStyles> => {
    const m365Theme = props.theme as IM365Theme;
    const { checked, disabled } = props;

    if (!m365Theme) {
        warn('Theme is undefined or null.');
    }

    const checkboxBorderColor = disabled
        ? m365Theme.palette.neutralTertiaryAlt
        : checked
        ? m365Theme.palette.themePrimary
        : m365Theme.palette.neutralSecondaryAlt;

    return {
        checkbox: {
            border: `1px solid ${checkboxBorderColor}`,
        },
        checkmark: [
            'ms-Checkbox-checkmark',
            {
                // This is literally the fix that came in fabric 7, just re-implemented here.
                color: m365Theme.semanticColors.inputForegroundChecked,
            },
        ],
    };
};
