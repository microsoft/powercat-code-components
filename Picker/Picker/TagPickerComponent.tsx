import * as React from 'react';
import { CanvasTagPicker, ICanvasTagPickerProps } from './CanvasTagPicker';
import { TagItemWithTabIndex } from './fluentui-fork/TagPicker/TagItemWithTabIndex';
import useResizeObserver from '@react-hook/resize-observer';
import {
    createTheme,
    FontIcon,
    IBasePicker,
    IBasePickerStyles,
    IBasePickerSuggestionsProps,
    IPartialTheme,
    IRefObject,
    IStyle,
    ITag,
    ITagItemProps,
    ITagItemStyles,
    TagItemSuggestion,
    ThemeProvider,
    ValidationState,
    mergeStyleSets,
} from '@fluentui/react';

export interface ITagItem extends ITag {
    subName: string;
    iconName?: string;
    iconColor?: string;
    textColor?: string;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    isError?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}
export interface TagPickerComponentProps {
    width?: number;
    height?: number;
    tags: ITag[];
    tabIndex: number;
    onRemove: (item: ITag) => void;
    onAdd: (item: ITag) => void;
    filterSuggestions: (search: string) => Promise<ITag[]> | ITag[];
    onResize?: (width: number, height: number) => void;
    minimumFilterLength: number | null;
    keepTypingMessage: string | null;
    noSuggestionsMessage: string | null;
    maxTags: number | undefined;
    tagMaxWidth: number | null;
    disabled?: boolean;
    componentRef?: IRefObject<IBasePicker<ITag>>;
    error?: boolean;
    itemHeight?: number;
    fontSize?: number;
    borderRadius?: number;
    allowFreeText?: boolean;
    themeJSON?: string;
    hintText?: string;
    accessibilityLabel?: string;
    resources: ComponentFramework.Resources;
}

const getTextFromItem = (item: ITag) => item.name;

function validateInput(input: string): ValidationState {
    if (input && input.trim().length > 0) {
        return ValidationState.valid;
    } else return ValidationState.invalid;
}

function createGenericItem(input: string): ITag & { key: React.Key } {
    return { key: '', name: input } as ITag;
}

function onItemSelected(selectedItem?: ITag): ITag | null {
    if (selectedItem) {
        return selectedItem;
    }
    return null;
}

export const TagPickerComponent = React.memo((props: TagPickerComponentProps) => {
    const {
        width,
        tags,
        onRemove,
        onAdd,
        filterSuggestions,
        minimumFilterLength,
        keepTypingMessage,
        noSuggestionsMessage,
        maxTags,
        tagMaxWidth,
        tabIndex,
        disabled,
        componentRef,
        onResize,
        error,
        borderRadius,
        itemHeight,
        fontSize,
        allowFreeText,
        themeJSON,
        hintText,
        accessibilityLabel,
        resources,
    } = props;

    const [searchTerm, setSearchTerm] = React.useState<string>('');

    const onChange = React.useCallback(
        (items?: ITag[]): void => {
            // Determine if tags have been added or removed
            if (items != null && tags) {
                const removed = tags.filter(function (item) {
                    return items.indexOf(item) === -1;
                });
                if (removed && removed.length > 0) {
                    onRemove(removed[0]);
                }
                const added = items.filter(function (item) {
                    return tags.indexOf(item) === -1;
                });
                if (added && added.length > 0) {
                    onAdd(added[0]);
                }
            }
        },
        [onAdd, onRemove, tags],
    );

    const filterSuggestedTags = React.useCallback(
        (filterText: string): Promise<ITag[]> | ITag[] => {
            setSearchTerm(filterText);
            return filterSuggestions(filterText);
        },
        [setSearchTerm, filterSuggestions],
    );

    const rootStyle = React.useMemo(() => {
        // This is needed for custom pages to ensure the Tag Picker grows to the full width
        return {
            width: width,
            height: 'fit-content',
        } as React.CSSProperties;
    }, [width]);

    const defaultTagStyles = React.useMemo(() => {
        return {
            root: {
                maxWidth: tagMaxWidth || '100%',
                lineHeight: itemHeight ?? undefined,
                height: itemHeight ?? undefined,
                fontSize: fontSize ?? undefined,
                borderRadius: borderRadius ?? undefined,
            },
            close: {
                borderRadius: borderRadius ?? undefined,
            },
        } as ITagItemStyles;
    }, [borderRadius, fontSize, itemHeight, tagMaxWidth]);

    const pickerStyles = React.useMemo(() => {
        return {
            root: {
                fontSize: fontSize ?? undefined,
            },
            input: {
                fontSize: fontSize ?? undefined,
            },
        } as IBasePickerStyles;
    }, [fontSize]);

    const renderItem = React.useCallback(
        (props: ITagItemProps) => {
            const {
                isError,
                iconName,
                iconColor,
                textColor,
                backgroundColor,
                borderColor,
                hoverBorderColor,
                hoverBackgroundColor,
            } = props.item as ITagItem;
            const className = (props.className ?? '') + (isError === true ? ' is-error' : '');
            const tagStyle = {
                color: textColor,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: borderColor ? 1 : undefined,
                borderStyle: borderColor ? 'solid' : undefined,
            };
            const hoverStyle = {
                ...tagStyle,
                background: hoverBackgroundColor ?? undefined,
                borderColor: hoverBorderColor ?? undefined,
            };
            const tagStyles = mergeStyleSets(defaultTagStyles, {
                root: {
                    ...tagStyle,
                    borderRadius: borderRadius ?? undefined,
                    fontSize: fontSize ?? undefined,
                    ':hover': hoverStyle,
                    ':focus-within': hoverStyle,
                },
                close: {
                    color: textColor,
                    ':hover': hoverStyle,
                    ':focus-within': hoverStyle,
                    ':focus::after': {
                        outline: hoverBorderColor ? 'none !important' : undefined,
                    },
                } as IStyle,
            });

            return (
                <TagItemWithTabIndex {...props} className={className} styles={tagStyles} tabIndex={tabIndex}>
                    {iconName && <FontIcon role="img" iconName={iconName} style={{ color: iconColor }} />}
                    {props.item.name}
                </TagItemWithTabIndex>
            );
        },
        [borderRadius, defaultTagStyles, fontSize, tabIndex],
    );

    const renderSuggestionItem = React.useCallback(
        (props: ITagItem) => {
            const { textColor, backgroundColor, borderColor } = props as ITagItem;
            // If there is background color, then add padding
            const margin = backgroundColor ? 3 : undefined;
            const tagStyles = {
                height: itemHeight ?? undefined,
                fontSize: fontSize ?? undefined,
                borderRadius: borderRadius ?? undefined,
                color: textColor,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: borderColor ? 1 : undefined,
                borderStyle: borderColor ? 'solid' : undefined,
                marginTop: margin,
                marginBottom: margin,
                marginLeft: margin,
            };
            return (
                <TagItemSuggestion styles={{ suggestionTextOverflow: tagStyles }}>
                    <div style={{ textAlign: 'left', lineHeight: 1 }}>
                        {props.name}
                        <br />
                        <span style={{ fontSize: '80%' }}>{props.subName}</span>
                    </div>
                </TagItemSuggestion>
            );
        },
        [borderRadius, fontSize, itemHeight],
    );

    const pickerSuggestionsProps: IBasePickerSuggestionsProps = React.useMemo(() => {
        return {
            noResultsFoundText:
                searchTerm && minimumFilterLength && searchTerm.length < minimumFilterLength
                    ? (keepTypingMessage as string)
                    : (noSuggestionsMessage as string),
        };
    }, [searchTerm, keepTypingMessage, noSuggestionsMessage, minimumFilterLength]);

    const target = React.useRef<HTMLElement>(null);

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const classNames = React.useMemo(() => {
        return [error === true ? 'error-condition' : '', disabled === true ? 'is-disabled' : ''].join(' ');
    }, [error, disabled]);

    useResizeObserver(target, (entry) => {
        if (onResize) onResize(entry.contentRect.width, entry.contentRect.height);
    });

    const canvasTagPickerProps = {
        inputProps: { tabIndex: tabIndex, placeholder: hintText },
        componentRef: componentRef,
        onResolveSuggestions: filterSuggestedTags,
        getTextFromItem: getTextFromItem,
        pickerSuggestionsProps: pickerSuggestionsProps,
        selectedItems: tags,
        onChange: onChange,
        onValidateInput: validateInput,
        createGenericItem: createGenericItem,
        onItemSelected: onItemSelected,
        resolveDelay: 200,
        pickerCalloutProps: { doNotLayer: false }, // This must be false otherwise the flyout appears underneath other components in the app
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRenderSuggestionsItem: renderSuggestionItem as any,
        onRenderItem: renderItem,
        itemLimit: maxTags,
        disabled: disabled,
        className: classNames,
        acceptFreeText: allowFreeText,
        styles: pickerStyles,
        removeButtonAriaLabel: resources.getString('Aria_TagRemove'),
        selectionAriaLabel: accessibilityLabel,
    } as ICanvasTagPickerProps;
    return (
        <ThemeProvider theme={theme} applyTo="none" ref={target} className={'PowerCATTagPicker'} style={rootStyle}>
            <CanvasTagPicker {...canvasTagPickerProps} />
        </ThemeProvider>
    );
});
TagPickerComponent.displayName = 'TagPickerComponent';
