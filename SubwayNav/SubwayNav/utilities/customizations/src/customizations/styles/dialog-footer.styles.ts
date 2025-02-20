// @ts-nocheck
import type { IDialogFooterStyleProps, IDialogFooterStyles } from '@fluentui/react';

export const DialogFooterStyles = (props: IDialogFooterStyleProps): Partial<IDialogFooterStyles> => {
    return {
        action: {
            marginLeft: '0',
            marginRight: '16px',
        },
        // we know this is semantically wrong but we don't want to change the base dom structure
        actionsRight: {
            textAlign: 'left',
        },
    };
};
