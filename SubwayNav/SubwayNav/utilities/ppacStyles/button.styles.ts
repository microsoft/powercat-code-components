import type { IButtonProps, IButtonStyles } from '@fluentui/react';

export const ButtonStyles = (props: IButtonProps): Partial<IButtonStyles> => {
    return {
        root: {
            border: `1px solid ${props.theme?.semanticColors.buttonBorder}`,
        },
    };
};
