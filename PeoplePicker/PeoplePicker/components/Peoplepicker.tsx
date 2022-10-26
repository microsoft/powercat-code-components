import * as React from 'react';
import { IPersonaProps } from '@fluentui/react';
import {
    IBasePickerSuggestionsProps,
    IPeoplePickerItemSelectedProps,
    NormalPeoplePicker,
    PeoplePickerItem,
    ValidationState,
    IPeoplePickerProps,
    ThemeProvider,
    CompactPeoplePicker,
    ListPeoplePicker,
    createTheme,
    IPartialTheme,
} from '@fluentui/react';
import { CanvasPeoplePickerProps } from './Component.types';
import { usePrevious } from '@fluentui/react-hooks';
import useResizeObserver from '@react-hook/resize-observer';

export const CanvasPeoplePicker = React.memo((props: CanvasPeoplePickerProps) => {
    const {
        selectedItems,
        suggestedPeople,
        themeJSON,
        showSecondaryText,
        filterSuggestions,
        minimumFilterLength,
        keepTypingMessage,
        noresultfoundText,
        isPickerDisabled,
        error,
        peoplepickerType,
        accessibilityLabel,
        suggestionsHeaderText,
        componentRef,
        onResize,
        updateSearchTerm,
        defaultSelected,
        onFocus,
        onBlur,
        width,
        hintText,
        maxPeople,
    } = props;

    const [peopleList, setPeopleList] = React.useState<IPersonaProps[]>(suggestedPeople);
    const [selectedPeople, setselectedPeople] = React.useState<IPersonaProps[] | undefined>(defaultSelected);
    const prevSelectedPeople = usePrevious(defaultSelected);
    const prevpeopleList = usePrevious(suggestedPeople);
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const suggestionProps: IBasePickerSuggestionsProps = {
        suggestionsHeaderText: suggestionsHeaderText,
        mostRecentlyUsedHeaderText: suggestionsHeaderText,
        noResultsFoundText:
            searchTerm && minimumFilterLength && searchTerm.length < minimumFilterLength
                ? keepTypingMessage
                : noresultfoundText,
        loadingText: 'Loading',
        showRemoveButtons: true,
        suggestionsAvailableAlertText: 'People Picker Suggestions available',
        suggestionsContainerAriaLabel: suggestionsHeaderText,
    };

    const classNames = React.useMemo(() => {
        return [
            error === true ? 'error-condition ms-PeoplePicker' : 'ms-PeoplePicker',
            isPickerDisabled === true ? 'is-disabled ms-PeoplePicker' : 'ms-PeoplePicker',
        ].join(' ');
    }, [error, isPickerDisabled]);

    const target = React.useRef<HTMLElement>(null);
    useResizeObserver(target, (entry) => {
        if (onResize) onResize(entry.contentRect.width, entry.contentRect.height);
    });

    React.useEffect(() => {
        if (defaultSelected && prevSelectedPeople !== defaultSelected) {
            // Set Preselected members as selected People
            selectedItems(defaultSelected);
            setselectedPeople(defaultSelected);
        }
        if (prevpeopleList !== suggestedPeople) {
            setPeopleList(suggestedPeople);
        }
    }, [
        peopleList,
        selectedPeople,
        selectedItems,
        suggestedPeople,
        defaultSelected,
        prevSelectedPeople,
        prevpeopleList,
    ]);

    const rootStyle = React.useMemo(() => {
        // This is needed for custom pages to ensure the People Picker grows to the full width
        return {
            width: width,
            height: 'fit-content',
        } as React.CSSProperties;
    }, [width]);

    const filterSuggestedUsers = React.useCallback(
        (filterText: string): IPersonaProps[] | Promise<IPersonaProps[]> => {
            setSearchTerm(filterText);
            if (filterText && filterText.length >= minimumFilterLength) {
                return filterSuggestions(filterText);
            } else {
                updateSearchTerm(filterText);
                return [];
            }
        },
        [filterSuggestions, updateSearchTerm, minimumFilterLength],
    );

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const onRemoveSuggestion = (item: IPersonaProps): void => {
        const indexPeopleList: number = peopleList.indexOf(item);

        if (indexPeopleList >= 0) {
            const newPeople: IPersonaProps[] = peopleList
                .slice(0, indexPeopleList)
                .concat(peopleList.slice(indexPeopleList + 1));
            setPeopleList(newPeople);
        }
    };

    const renderItemWithSecondaryText = (props: IPeoplePickerItemSelectedProps) => {
        const newProps = {
            ...props,
            item: {
                ...props.item,
                ValidationState: ValidationState.valid,
                showSecondaryText: true,
            },
        };

        return <PeoplePickerItem {...newProps} />;
    };

    const onChange = (items?: IPersonaProps[]): void => {
        if (Array.isArray(items) && items.length) {
            selectedItems(items);
        } else {
            // return empty array
            selectedItems([]);
        }
    };
    const peoplepickerProps: IPeoplePickerProps = {
        // eslint-disable-next-line react/jsx-no-bind
        onResolveSuggestions: filterSuggestedUsers,
        getTextFromItem: getTextFromItem,
        pickerSuggestionsProps: suggestionProps,
        className: classNames,
        pickerCalloutProps: { doNotLayer: false }, // This must be false otherwise the flyout appears underneath other components in the app
        // eslint-disable-next-line react/jsx-no-bind
        onRemoveSuggestion: onRemoveSuggestion,
        onRenderItem: showSecondaryText ? renderItemWithSecondaryText : undefined,
        onValidateInput: validateInput,
        inputProps: {
            'aria-label': accessibilityLabel,
            onFocus: onFocus,
            onBlur: onBlur,
            placeholder: hintText,
        },
        defaultSelectedItems: props.defaultSelected,
        componentRef: componentRef,
        onInputChange: onInputChange,
        disabled: isPickerDisabled,
        itemLimit: maxPeople,
        onChange: onChange,
    } as IPeoplePickerProps;
    switch (peoplepickerType.toLowerCase()) {
        case 'normal people picker':
            return (
                <ThemeProvider theme={theme} ref={target} className={'PowerCATPeoplepicker'} style={rootStyle}>
                    <NormalPeoplePicker {...peoplepickerProps} />
                </ThemeProvider>
            );
        case 'list people picker':
            return (
                <ThemeProvider theme={theme} ref={target} className={'PowerCATPeoplepicker'} style={rootStyle}>
                    <ListPeoplePicker {...peoplepickerProps} />
                </ThemeProvider>
            );
        case 'compact people picker':
            return (
                <ThemeProvider theme={theme} ref={target} className={'PowerCATPeoplepicker'} style={rootStyle}>
                    <CompactPeoplePicker {...peoplepickerProps} />
                </ThemeProvider>
            );
        default:
            return (
                <ThemeProvider theme={theme} ref={target} className={'PowerCATPeoplepicker'} style={rootStyle}>
                    <NormalPeoplePicker {...peoplepickerProps} />
                </ThemeProvider>
            );
    }
});
CanvasPeoplePicker.displayName = 'CanvasPeoplePicker';

function getTextFromItem(persona: IPersonaProps): string {
    return persona.text as string;
}

function validateInput(input: string): ValidationState {
    if (input.indexOf('@') !== -1) {
        return ValidationState.valid;
    } else if (input.length > 1) {
        return ValidationState.warning;
    } else {
        return ValidationState.invalid;
    }
}

/**
 * Takes in the picker input and modifies it in whichever way
 * the caller wants, i.e. parsing entries copied from Outlook (sample
 * input: "Aaron Reid <aaron>").
 *
 * @param input The text entered into the picker.
 */
function onInputChange(input: string): string {
    const outlookRegEx = /<.*>/g;
    const emailAddress = outlookRegEx.exec(input);

    if (emailAddress && emailAddress[0]) {
        return emailAddress[0].substring(1, emailAddress[0].length - 1);
    }

    return input;
}
