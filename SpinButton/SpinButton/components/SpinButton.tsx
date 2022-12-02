import * as React from 'react';
import {
    SpinButton,
    ThemeProvider,
    createTheme,
    IPartialTheme,
    IIconProps,
    ISpinButtonProps,
    ISpinButtonStyles,
    mergeStyles,
} from '@fluentui/react';
import { ISpinButtonComponentProps } from './Component.types';

export const SpinButtonComponent = React.memo((props: ISpinButtonComponentProps) => {
    const { themeJSON, onChanged, min, max, step, suffix, error, setFocus } = props;
    const iconProps: IIconProps = { iconName: props.iconName };
    const [key, setKey] = React.useState<string>(suffix);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [styles, setStyles] = React.useState<Partial<ISpinButtonStyles>>();

    /* Helper method catches the updated value from the control */
    const onChange = React.useCallback(
        (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => {
            if (newValue) {
                onChanged(newValue);
            }
        },
        [onChanged],
    );

    /** Remove the suffix or any other text after the numbers, or return undefined if not a number */
    const getNumericPart = (value: string): number | undefined => {
        const valueRegex = /^(\d+(\.\d+)?).*/;
        if (valueRegex.test(value)) {
            const numericValue = Number(value.replace(valueRegex, '$1'));
            return isNaN(numericValue) ? undefined : numericValue;
        }
        return undefined;
    };

    const onValidate = (value: string): string | void => {
        let numericValue = getNumericPart(value);
        if (numericValue !== undefined) {
            numericValue = Math.min(numericValue, max);
            numericValue = Math.max(numericValue, min);
            return String(numericValue) + suffix;
        }
    };

    /** Increment the value (or return nothing to keep the previous value if invalid) */
    const onIncrement = (value: string): string | void => {
        const numericValue = getNumericPart(value);
        if (numericValue !== undefined) {
            return String(Math.min(numericValue + step, max)) + suffix;
        }
    };

    /** Decrement the value (or return nothing to keep the previous value if invalid) */
    const onDecrement = (value: string): string | void => {
        const numericValue = getNumericPart(value);
        if (numericValue !== undefined) {
            return String(Math.max(numericValue - step, min)) + suffix;
        }
    };

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    React.useEffect(() => {
        // To render with changed suffix
        setKey(suffix);
    }, [suffix]);

    React.useEffect(() => {
        error === true
            ? setStyles({ spinButtonWrapper: { '::after': { borderColor: '#BA3D22 !important' } } })
            : setStyles({ spinButtonWrapper: { '::after': { borderColor: 'rgb(96, 94, 92) !important' } } });

        if (setFocus && setFocus !== '' && rootRef) {
            const spinBtnElement = (rootRef.current as HTMLElement).getElementsByClassName('ms-spinButton-input');
            if (spinBtnElement && spinBtnElement.length > 0) {
                (spinBtnElement[0] as HTMLInputElement).focus();
            }
        }
    }, [setFocus, rootRef, error, setStyles]);

    //This is required to override width styles in custom pages
    const wrapperClass = mergeStyles({
        width: props.width,
    });

    const spinButtonProps = {
        ...{
            ...props,
            iconProps: iconProps,
            onChange: onChange,
            onValidate: onValidate,
            onIncrement: onIncrement,
            onDecrement: onDecrement,
            key: key,
            ref: rootRef,
            styles: styles,
            className: wrapperClass,
        },
    } as ISpinButtonProps;

    return (
        <ThemeProvider theme={theme} className={'PowerCATSpinButton'}>
            <SpinButton {...spinButtonProps} />
        </ThemeProvider>
    );
});
SpinButtonComponent.displayName = 'SpinButtonComponent';
