// @ts-nocheck
import type { ISearchBoxStyleProps, ISearchBoxStyles } from '@fluentui/react';

export const SearchBoxStyles = (props: ISearchBoxStyleProps): Partial<ISearchBoxStyles> => {
    return {
        root: {
            selectors: {
                '::after': {
                    borderWidth: 1,
                },
            },
        },
    };
};
