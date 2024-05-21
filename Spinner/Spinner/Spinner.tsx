import * as React from 'react';
import {
    Spinner,
    SpinnerSize,
    createTheme,
    mergeStyles,
    IPartialTheme,
    ThemeProvider,
    SpinnerLabelPosition,
} from '@fluentui/react';

export interface ISpinnerProps {
    label?: string;
    spinnerSize: SpinnerSize;
    themeJSON?: string;
    ariaLabel?: string;
    labelPosition?: SpinnerLabelPosition;
    justify?: string;
    height: number;
    width: number;
    backgroundColor?: string;
}

export const CanvasSpinner = React.memo((props: ISpinnerProps) => {
    const { label, ariaLabel, spinnerSize, labelPosition, themeJSON, justify, height, backgroundColor } = props;
    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    function getSpinnerContainerStyle() {
        // Vertical center spinner
        return mergeStyles({
            height: height,
            display: 'flex',
            justifyContent: justify,
            backgroundColor: backgroundColor,
            width: props.width,
        });
    }

    return (
        <ThemeProvider theme={theme} className={getSpinnerContainerStyle()}>
            <Spinner aria-label={ariaLabel} label={label} size={spinnerSize} labelPosition={labelPosition} />
        </ThemeProvider>
    );
});
CanvasSpinner.displayName = 'CanvasSpinner';
