import * as React from 'react';
import { Shimmer, ThemeProvider, createTheme, IPartialTheme, mergeStyles } from '@fluentui/react';
import { IShimmerProps } from './Component.types';
<<<<<<< HEAD

export const CanvasShimmer = React.memo((props: IShimmerProps) => {
    const { shimmerElements, themeJSON, spacebetweenShimmer, rowCount } = props;
=======
import { getShimmerElements } from './DatasetMapping';

export const CanvasShimmer = React.memo((props: IShimmerProps) => {
    const { items, themeJSON, spacebetweenShimmer, rowDetails } = props;
    const shimmerElements: JSX.Element[] = [];
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
    const wrapperClass = mergeStyles({
        padding: 2,
        selectors: {
            '& > .ms-Shimmer-container': {
                margin: spacebetweenShimmer?.concat(' 0'),
            },
        },
<<<<<<< HEAD
        width:props.width
=======
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
    });

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

<<<<<<< HEAD
    return (
        <ThemeProvider theme={theme} className={wrapperClass}>
            {[...Array(rowCount)].map((key) => {
                return <Shimmer key={key} shimmerElements={shimmerElements} />;
            })}
=======
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
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
        </ThemeProvider>
    );
});
CanvasShimmer.displayName = 'CanvasShimmer';
