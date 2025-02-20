// @ts-nocheck
import type { IButtonProps, IButtonStyles } from '@fluentui/react';
import { HighContrastSelector } from '@fluentui/react';

export const DefaultButtonStyles = (props: IButtonProps): Partial<IButtonStyles> => {
    const { theme } = props;

    return {
        root: {
            border: 'none',
            [HighContrastSelector]: {
                border: `1px solid ${theme?.semanticColors.buttonBorder}`,
            },
        },
    };
};
