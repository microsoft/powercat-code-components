import type { IChoiceGroupOptionStyleProps, IChoiceGroupOptionStyles, IStyle } from '@fluentui/react';
import { warn } from '@fluentui/react';

export const ChoiceGroupOptionStyles = (props: IChoiceGroupOptionStyleProps): Partial<IChoiceGroupOptionStyles> => {
    const { theme, checked, disabled } = props;

    if (!theme) {
        warn('Theme is undefined or null.');
    }

    const circleAreaProperties: IStyle = [
        {
            borderColor: disabled ? theme.semanticColors.disabledBodySubtext : theme.palette.neutralPrimary,
        },
        checked && {
            borderColor: disabled
                ? theme.semanticColors.disabledBodySubtext
                : theme.semanticColors.inputBackgroundChecked,
        },
    ];

    return {
        field: {
            selectors: {
                // The circle
                ':before': circleAreaProperties,
            },
        },
    };
};
