import * as React from 'react';
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

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);
    return (
        <ThemeProvider theme={theme}>
            <Spinner
                aria-label={ariaLabel}
                label={label}
                size={getSpinnerSize(spinnerSize)}
                labelPosition={labelPosition}
            />
        </ThemeProvider>
    );
});
CanvasSpinner.displayName = 'CanvasSpinner';
