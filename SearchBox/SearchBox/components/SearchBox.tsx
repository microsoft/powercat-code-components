import * as React from 'react';
import { SearchBox, createTheme, IPartialTheme, ThemeProvider, IIconProps, mergeStyles } from '@fluentui/react';
import { ISearchBoxComponentProps } from './Component.types';

export const SearchBoxComponent = React.memo((props: ISearchBoxComponentProps) => {
    const {
        onChange,
        themeJSON,
        ariaLabel,
        placeholderText,
        underLined,
        disabled,
        disableAnimation,
        setFocus,
        value,
    } = props;
    const filterIcon: IIconProps = { iconName: props.iconName };
    const [searchText, setSearchText] = React.useState(value);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    React.useEffect(() => {
        value !== searchText && setSearchText(value);
    }, [value]);

    function onChangeEvent(ev?: React.ChangeEvent<HTMLInputElement>, newValue?: string) {
        setSearchText(newValue);
        onChange(ev, newValue);
    }

    const wrapperClass = mergeStyles({
        width: props.width,
    });

    React.useEffect(() => {
        if (setFocus && setFocus !== '' && rootRef) {
            const searchBoxes = (rootRef.current as HTMLElement).getElementsByClassName('ms-SearchBox-field');
            if (searchBoxes && searchBoxes.length > 0) {
                (searchBoxes[0] as HTMLInputElement).focus();
            }
        }
    }, [setFocus, rootRef]);

    return (
        <ThemeProvider theme={theme}>
            <SearchBox
                placeholder={placeholderText}
                onChange={onChangeEvent}
                ariaLabel={ariaLabel}
                underlined={underLined}
                iconProps={filterIcon}
                disabled={disabled}
                disableAnimation={disableAnimation}
                className={wrapperClass}
                ref={rootRef}
                value={searchText}
            />
        </ThemeProvider>
    );
});
SearchBoxComponent.displayName = 'SearchBoxComponent';
