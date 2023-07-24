import * as React from 'react';
import { MaskedTextField, IMaskedTextFieldProps, createTheme, IPartialTheme, ThemeProvider } from '@fluentui/react';
import { ICanvasMaskedTextFieldProps } from './Component.types';

export const CanvasMaskedTextField = React.memo((props: ICanvasMaskedTextFieldProps) => {
    const { prefixValue, suffixValue, onChange, value, width, themeJSON, maskPattern, setFocus } = props;
    const [trackedValue, setValue] = React.useState(value);
    const rootRef = React.useRef<HTMLDivElement>(null);
    // Generates theme
    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    // Tracks current value
    React.useEffect(() => {
        value !== trackedValue && setValue(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    function onChangeEvent(ev?: React.ChangeEvent<HTMLInputElement>, newValue?: string) {
        setValue(newValue);
        onChange(ev, newValue);
    }

    function isRegexValid(maskPattern: string) {
        try {
            new RegExp(maskPattern);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Mask format (provided by user or defaults to all characters)
    const maskFormat: { [key: string]: RegExp } = {
        '*':
            maskPattern !== ''
                ? isRegexValid(maskPattern)
                    ? new RegExp(maskPattern)
                    : /[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@_'{}~\t]/
                : /[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@_'{}~\t]/,
    };

    // Tracks width
    const textFieldStyles = React.useMemo(() => {
        return {
            root: { width: width },
        } as IMaskedTextFieldProps;
    }, [width]);

    React.useEffect(() => {
        if (setFocus && setFocus !== '' && rootRef) {
            const searchBoxes = (rootRef.current as HTMLElement).getElementsByClassName('ms-TextField-field');
            if (searchBoxes && searchBoxes.length > 0) {
                (searchBoxes[0] as HTMLInputElement).focus();
            }
        }
    }, [setFocus, rootRef]);

    // Customized properties
    const textFieldProps = {
        ...{
            ...props,
            onChange: onChangeEvent,
            value: trackedValue,
            styles: textFieldStyles,
            maskFormat: maskFormat,
            ref: rootRef,
            ...(prefixValue && { prefix: prefixValue }),
            ...(suffixValue && { suffix: suffixValue }),
        },
    } as ICanvasMaskedTextFieldProps;

    return (
        <ThemeProvider theme={theme}>
            <MaskedTextField {...textFieldProps} />
        </ThemeProvider>
    );
});

CanvasMaskedTextField.displayName = 'CanvasMaskedTextField';
