import * as React from 'react';
<<<<<<< HEAD
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
=======
import { Spinner, SpinnerSize, createTheme, IPartialTheme, ThemeProvider, SpinnerLabelPosition } from '@fluentui/react';

export interface ISpinnerProps {
    label?: string;
    spinnerSize: string;
    themeJSON?: string;
    ariaLabel?: string;
    labelPosition?: SpinnerLabelPosition;
}

function getSpinnerSize(size: string): SpinnerSize {
    let selectedSize: SpinnerSize = SpinnerSize.medium;
    switch (size) {
        case 'xSmall':
            selectedSize = SpinnerSize.xSmall;
            break;
        case 'Small':
            selectedSize = SpinnerSize.small;
            break;
        case 'Medium':
            selectedSize = SpinnerSize.medium;
            break;
        case 'Large':
            selectedSize = SpinnerSize.large;
            break;
        default:
            selectedSize;
    }
    return selectedSize;
}

export const CanvasSpinner = React.memo((props: ISpinnerProps) => {
    const { label, ariaLabel, spinnerSize, labelPosition, themeJSON } = props;

>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);
<<<<<<< HEAD

    function getSpinnerContainerStyle() {
        // Vertical center spinner
        return mergeStyles({
            height: height,
            display: 'flex',
            justifyContent: justify,
            backgroundColor: backgroundColor,
            width: props.width
        });
    }

    return (
        <ThemeProvider theme={theme} className={getSpinnerContainerStyle()}>
            <Spinner aria-label={ariaLabel} label={label} size={spinnerSize} labelPosition={labelPosition} />
=======
    return (
        <ThemeProvider theme={theme}>
            <Spinner
                aria-label={ariaLabel}
                label={label}
                size={getSpinnerSize(spinnerSize)}
                labelPosition={labelPosition}
            />
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
        </ThemeProvider>
    );
});
CanvasSpinner.displayName = 'CanvasSpinner';
