import type { IDetailsRowProps, IDetailsRowStyles } from '@fluentui/react';
import { FontWeights } from '@fluentui/react';

export const DetailsRowStyles = (props: IDetailsRowProps): Partial<IDetailsRowStyles> => {
    const { theme } = props;

    return {
        fields: {
            color: theme?.semanticColors.listText,
            selectors: {
                '& > :first-child': {
                    fontWeight: FontWeights.semibold,
                },
            },
        },
    };
};
