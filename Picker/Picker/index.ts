import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import { ITagItem, TagPickerComponent, TagPickerComponentProps } from './TagPickerComponent';
import { ITag, IBasePicker } from '@fluentui/react';
import {
    OutputEvents,
    ManifestPropertyNames,
    SuggestionsColumns,
    TagsColumns,
    InputEvents,
    InputProperties,
} from './ManifestConstants';
import { ContextEx } from './ContextExtended';

export class Picker implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    context: ComponentFramework.Context<IInputs>;
    sortedTagIds: string[] = [];
    resources: ComponentFramework.Resources;
    tags: ITagItem[];
    isFullScreen = false;
    tagEvent = '';
    tagDisplayName: string | undefined = '';
    tagKey: string | undefined = '';
    suggestions: ITagItem[];
    searchText: string;
    previousSearchText: string;
    ref?: IBasePicker<ITag>;
    height?: number;
    suggestionsFilterPending?: (suggestions: ITag[]) => void;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.resources = this.context.resources;
        this.context.parameters.Suggestions.paging.setPageSize(500);
        this.context.parameters.Tags.paging.setPageSize(500);
    }

    addTag = (item: ITag): void => {
        if (item) {
            this.tagEvent = OutputEvents.Add;
            this.tagKey = item.key.toString();
            this.tagDisplayName = item.name.toString();
            this.notifyOutputChanged();
        }
    };

    removeTag = (item: ITag): void => {
        if (item) {
            this.tagEvent = OutputEvents.Remove;
            this.tagKey = item.key.toString();
            this.tagDisplayName = item.name.toString();
            this.notifyOutputChanged();
        }
    };

    componentRefCallback = (ref: IBasePicker<ITag> | null): void => {
        if (ref) {
            this.ref = ref;
        }
    };

    filterSuggestions = (search: string): Promise<ITag[]> | ITag[] => {
        this.searchText = search;
        const searchTermLongEnough = search.length >= (this.context.parameters.MinimumSearchTermLength.raw as number);
        const searchEmpty = search === '';

        // Notify that the search term has changed - this in turn will filter the suggestions dataset
        if (searchTermLongEnough) {
            if (this.previousSearchText !== this.searchText) {
                this.previousSearchText = this.searchText;
                return new Promise((resolve) => {
                    this.suggestionsFilterPending = resolve;
                    this.tagEvent = OutputEvents.Search;
                    this.notifyOutputChanged();
                });
            } else {
                // The search has not changed, so return the previous search
                return this.suggestions;
            }
        } else if (!searchEmpty) {
            if (this.suggestionsFilterPending) {
                this.suggestionsFilterPending([]);
                this.suggestionsFilterPending = undefined;
            }
            this.notifyOutputChanged();
        }

        return [];
    };

    onResize = (width: number, height: number): void => {
        this.height = height;
        this.tagEvent = '';
        this.notifyOutputChanged();
    };

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const inputEvent = this.context.parameters.InputEvent.raw;
        if (
            context.updatedProperties.indexOf(InputProperties.InputEvent) > -1 &&
            inputEvent?.startsWith(InputEvents.SetFocus)
        ) {
            // Set focus on input
            this.ref?.focusInput();
        }

        const tagsDataset = context.parameters.Tags;
        const suggestionsDataset = context.parameters.Suggestions;
        const tagsNeedsInit = this.tags === undefined && this.context.parameters.Tags.sortedRecordIds.length > 0;
        const datasetChanged =
            context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 ||
            context.updatedProperties.indexOf(ManifestPropertyNames.Suggestions_dataset) > -1 ||
            context.updatedProperties.indexOf(ManifestPropertyNames.Suggestions_records) > -1;
        const searchTermChanged = context.updatedProperties.indexOf(ManifestPropertyNames.SearchTerm) > -1;
        if (tagsNeedsInit || datasetChanged) {
            this.tags = this.getTags(tagsDataset);
            this.tagEvent = '';
        }
        if ((datasetChanged || searchTermChanged) && !suggestionsDataset.loading && this.suggestionsFilterPending) {
            // If there is a suggestion filter that is pending, then resolve it now
            this.suggestions = this.getSuggestions(suggestionsDataset);
            this.suggestionsFilterPending(this.suggestions);
            this.suggestionsFilterPending = undefined;
        }
        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

        return React.createElement(TagPickerComponent, {
            width: allocatedWidth,
            height: allocatedHeight,
            tabIndex: (context as unknown as ContextEx).accessibility.assignedTabIndex as number,
            tags: this.tags,
            onAdd: this.addTag,
            onRemove: this.removeTag,
            filterSuggestions: this.filterSuggestions,
            minimumFilterLength: this.context.parameters.MinimumSearchTermLength.raw,
            keepTypingMessage: this.context.parameters.SearchTermToShortMessage.raw,
            noSuggestionsMessage: this.context.parameters.NoSuggestionFoundMessage.raw,
            maxTags: this.undefinedIfZero(this.context.parameters.MaxTags),
            tagMaxWidth: this.context.parameters.TagMaxWidth.raw,
            disabled: this.context.mode.isControlDisabled,
            componentRef: this.componentRefCallback,
            onResize: this.onResize,
            error: this.context.parameters.Error.raw === true,
            fontSize: this.undefinedIfZero(context.parameters.FontSize),
            borderRadius: this.undefinedIfZero(context.parameters.BorderRadius),
            itemHeight: this.undefinedIfZero(context.parameters.ItemHeight),
            allowFreeText: context.parameters.AllowFreeText.raw === true,
            themeJSON: context.parameters.Theme.raw ?? undefined,
            hintText: context.parameters.HintText.raw ?? undefined,
            accessibilityLabel: context.parameters.AccessibilityLabel.raw ?? 'Select',
            resources: this.resources,
        } as TagPickerComponentProps);
    }

    public getOutputs(): IOutputs {
        return {
            AutoHeight: this.height || parseInt(this.context.mode.allocatedHeight as unknown as string),
            SearchTerm: this.searchText ? this.searchText : '',
            TagEvent: this.tagEvent,
            TagKey: this.tagKey,
            TagDisplayName: this.tagDisplayName,
        };
    }

    public destroy(): void {
        //noop
    }

    private undefinedIfZero(property: ComponentFramework.PropertyTypes.Property) {
        return property.raw && property.raw > 0 ? property.raw : undefined;
    }

    private getTags(tagsDataset: ComponentFramework.PropertyTypes.DataSet) {
        const keyIndex: Record<string, number> = {};
        return tagsDataset.sortedRecordIds.map((id) => {
            const record = tagsDataset.records[id];
            const recordId = record.getRecordId();
            let key = (record.getValue(TagsColumns.TagsKey) as string) ?? recordId;
            // Prevent duplicate keys by appending the duplicate index
            if (keyIndex[key] !== undefined) {
                keyIndex[key]++;
                key += `_${keyIndex[key]}`;
            } else keyIndex[key] = 1;
            return {
                key: key,
                name: record.getValue(TagsColumns.TagsDisplayName) as string,
                isError: record.getValue(TagsColumns.TagsError) as boolean,
                iconName: record.getValue(TagsColumns.TagsIconName) as string,
                iconColor: record.getValue(TagsColumns.TagsIconColor) as string,
                textColor: record.getValue(TagsColumns.TagsTextColor) as string,
                backgroundColor: record.getValue(TagsColumns.TagsBackgroundColor) as string,
                hoverBackgroundColor: record.getValue(TagsColumns.TagsHoverBackgroundColor) as string,
                borderColor: record.getValue(TagsColumns.TagsBorderColor) as string,
                hoverBorderColor: record.getValue(TagsColumns.TagsHoverBorderColor) as string,
                data: record,
            } as ITagItem;
        });
    }

    private getSuggestions(suggestionsDataset: ComponentFramework.PropertyTypes.DataSet) {
        const keyIndex: Record<string, number> = {};
        return suggestionsDataset.sortedRecordIds.map((id) => {
            const record = suggestionsDataset.records[id];
            const recordId = record.getRecordId();
            let key = (record.getValue(SuggestionsColumns.SuggestionKey) as string) ?? recordId;
            // Prevent duplicate keys by appending the duplicate index
            if (keyIndex[key] !== undefined) {
                keyIndex[key]++;
                key += `_${keyIndex[key]}`;
            } else keyIndex[key] = 1;
            return {
                key: key,
                name: record.getValue(SuggestionsColumns.SuggestionsDisplayName) as string,
                subName: record.getValue(SuggestionsColumns.SuggestionsSubDisplayName) as string,
                iconName: record.getValue(SuggestionsColumns.SuggestionsIconName) as string,
                iconColor: record.getValue(SuggestionsColumns.SuggestionsIconColor) as string,
                textColor: record.getValue(SuggestionsColumns.SuggestionsTextColor) as string,
                backgroundColor: record.getValue(SuggestionsColumns.SuggestionsBackgroundColor) as string,
                borderColor: record.getValue(SuggestionsColumns.SuggestionsBorderColor) as string,
                hoverBorderColor: record.getValue(SuggestionsColumns.SuggestionsHoverBorderColor) as string,
                data: record,
            } as ITagItem;
        });
    }
}
