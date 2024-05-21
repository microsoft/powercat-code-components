import * as React from 'react';
import { Shimmer, ThemeProvider, createTheme, IPartialTheme, mergeStyles } from '@fluentui/react';
import { IShimmerProps } from './Component.types';

export const CanvasShimmer = React.memo((props: IShimmerProps) => {
    const { shimmerElements, themeJSON, spacebetweenShimmer, rowCount } = props;
    const wrapperClass = mergeStyles({
        padding: 2,
        selectors: {
            '& > .ms-Shimmer-container': {
                margin: spacebetweenShimmer?.concat(' 0'),
            },
        },
        width: props.width,
    });

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    return (
        <ThemeProvider theme={theme} className={wrapperClass}>
            {[...Array(rowCount)].map((key) => {
                return <Shimmer key={key} shimmerElements={shimmerElements} />;
            })}
        </ThemeProvider>
    );
});
CanvasShimmer.displayName = 'CanvasShimmer';
