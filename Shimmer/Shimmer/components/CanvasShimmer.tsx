import * as React from 'react';
import { Shimmer, ThemeProvider, createTheme, IPartialTheme, mergeStyles } from '@fluentui/react';
import { IShimmerProps } from './Component.types';
import { getShimmerElements } from './DatasetMapping';

export const CanvasShimmer = React.memo((props: IShimmerProps) => {
    const { items, themeJSON, spacebetweenShimmer, rowDetails } = props;
    const shimmerElements: JSX.Element[] = [];
    const wrapperClass = mergeStyles({
        padding: 2,
        selectors: {
            '& > .ms-Shimmer-container': {
                margin: spacebetweenShimmer?.concat(' 0'),
            },
        },
    });

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    rowDetails
        .sort((prevRow, currentRow) => prevRow.order - currentRow.order)
        .map((row) => {
            for (let i = 0; i < row.count; i++) {
                shimmerElements.push(
                    <Shimmer
                        width={row.width ? row.width.toString().concat('%') : '100%'}
                        shimmerElements={getShimmerElements(items, row.key)}
                    />,
                );
            }
        });

    return (
        <ThemeProvider theme={theme} className={wrapperClass}>
            {shimmerElements.length > 0 && shimmerElements}
        </ThemeProvider>
    );
});
CanvasShimmer.displayName = 'CanvasShimmer';
