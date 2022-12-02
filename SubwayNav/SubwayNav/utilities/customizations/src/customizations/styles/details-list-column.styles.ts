import type { IDetailsColumnStyleProps, IDetailsColumnStyles } from '@fluentui/react';

export const DetailsColumnStyles = (props: IDetailsColumnStyleProps): Partial<IDetailsColumnStyles> => {
    const { theme } = props;

    return {
        cellName: {
            fontSize: theme.fonts.small.fontSize,
        },
    };
};
