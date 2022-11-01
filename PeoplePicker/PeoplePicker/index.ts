import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasPeoplePicker } from './components/Peoplepicker';
import * as React from 'react';
import { ManifestPropertyNames, InputProperties, InputEvents } from './ManifestConstants';
import { CanvasPeoplePickerProps, ICustomPersonaProps, IPropBag } from './components/Component.types';
import { IPersonaProps, IBasePicker } from '@fluentui/react';
import { getPersonaFromDataset, getSuggestionFromDataset } from './components/DatasetMapping';
import { PersonaSchema, IOutputSchemaMap } from './components/PersonaSchema';
import { getDataSetFromPersona as getDataSetFromPersona } from './components/DatasetMapping';
import { debounce } from 'debounce';

interface CustomControl<TInputs, TOutputs> extends ComponentFramework.ReactControl<TInputs, TOutputs> {
    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width,
     * offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names
     * defined in the manifest, as well as utility functions
     * @returns a React element
     */
    getOutputSchema?(): Promise<IOutputSchemaMap>;
}

// Time to wait for either a loading signal or unchanged suggestions (milliseconds)
const SUGGESTIONS_CHANGE_TIMEOUT = 5000;
// Debounce Search event time (milliseconds) to allow for updated suggestions to be received within debounce window
const SUGGESTIONS_DEBOUNCE = 500;
// Debounce Notify search event changed (milliseconds) to prevent constant re-triggering of search
const NOTIFY_OUTPUT_CHANGED_DEBOUNCE = 500;

export class PeoplePicker implements CustomControl<IInputs, IOutputs> {
    context: IPropBag<IInputs>;
    private notifyOutputChanged: () => void;
    suggestedPeople: IPersonaProps[];
    ref?: IBasePicker<IPersonaProps>;
    defaultSelected: IPersonaProps[];
    selectedPeople: ICustomPersonaProps[];
    height?: number;
    searchText: string;
    previousSearchText: string;
    suggestionsFilterPending?: (suggestions: IPersonaProps[]) => void;
    resolve?: (selectedPeople: IPersonaProps[]) => void;
    suggestionsLoading?: boolean;
    waitingForSuggestions?: boolean;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: IPropBag<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.resolveSuggestions = debounce(this.resolveSuggestions, SUGGESTIONS_DEBOUNCE);
        this.notifySearchChanged = debounce(this.notifySearchChanged, NOTIFY_OUTPUT_CHANGED_DEBOUNCE);
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.context.parameters.Suggestions.paging.setPageSize(500);
        this.context.parameters.Personas.paging.setPageSize(500);
    }

    onResize = (width: number, height: number): void => {
        this.height = height;
        this.notifyOutputChanged();
    };

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: IPropBag<IInputs>): React.ReactElement {
        this.context = context;
        const suggestions = this.context.parameters.Suggestions;
        const personas = this.context.parameters.Personas;

        const getPreSelectedMember =
            (this.defaultSelected === undefined && personas.sortedRecordIds.length > 0) ||
            context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1;

        if (getPreSelectedMember) {
            const selectedPeopleDataset = context.parameters.Personas;
            this.defaultSelected = getPersonaFromDataset(selectedPeopleDataset);
        }

        this.handleSuggestionChangeEvents(context, suggestions);

        const inputEvent = context.parameters.InputEvent.raw;
        if (
            context.updatedProperties.indexOf(InputProperties.InputEvent) > -1 &&
            inputEvent?.startsWith(InputEvents.SetFocus)
        ) {
            // Set focus on input
            this.ref?.focusInput();
        }

        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const props: CanvasPeoplePickerProps = {
            width: allocatedWidth,
            height: allocatedHeight,
            suggestedPeople: this.suggestedPeople,
            themeJSON: context.parameters?.Theme.raw ?? '',
            onResize: this.onResize,
            error: context.parameters.Error.raw,
            isPickerDisabled: context.mode.isControlDisabled,
            showSecondaryText: context.parameters.ShowSecondaryText.raw,
            peoplePickerType: context.parameters.PeoplePickerType.raw,
            defaultSelected: this.defaultSelected,
            componentRef: this.componentRefCallback,
            accessibilityLabel: context.parameters.AccessibilityLabel.raw ?? '',
            minimumFilterLength: context.parameters.MinimumSearchTermLength.raw ?? 2,
            noResultFoundText: context.parameters.NoResultFoundMessage.raw ?? '',
            keepTypingMessage: context.parameters.SearchTermToShortMessage.raw ?? '',
            filterSuggestions: this.filterSuggestions,
            onPersonSelect: this.onPersonSelect,
            updateSearchTerm: this.updateSearchTerm,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            maxPeople: context.parameters.MaxPeople.raw ?? 10,
            hintText: context.parameters.HintText.raw ?? '',
            suggestionsHeaderText: context.parameters.SuggestionsHeaderText.raw ?? '',
        };
        return React.createElement(CanvasPeoplePicker, props);
    }

    private handleSuggestionChangeEvents(
        context: IPropBag<IInputs>,
        suggestions: ComponentFramework.PropertyTypes.DataSet,
    ) {
        if (this.resolve) {
            // Stage 1 - Search Text has been updated so trigger the Search event
            if (context.updatedProperties.indexOf(ManifestPropertyNames.SearchText) > -1) {
                // Wait for suggestions to load
                this.waitingForSuggestions = true;
                this.suggestionsLoading = false;
                // Raise search event to invoke any search logic.
                // Suggestions may also be directly filtered in the Suggestions dataset
                this.raiseSearchEvent();
                // Start debounce to resolve if no change to suggestions after the timeout
                this.suggestionsTimeout();
                this.resolveSuggestions.clear();
            }

            // Stage 2 - If the search requires a network operation, it will go into the loading state
            if (this.waitingForSuggestions && suggestions.loading) {
                // Loading happens when a network operation takes place
                this.suggestionsLoading = true;
                // Stop any pending resolve because a new dataset is now pending
                this.resolveSuggestions.clear();
                // Start suggestions timeout again
                this.suggestionsTimeout();
            }

            // Stage 3 - When the suggestions are updated, and they are not loading, resolve the suggestions
            if (
                (this.waitingForSuggestions || this.suggestionsLoading) &&
                context.updatedProperties.indexOf(ManifestPropertyNames.Suggestions_dataset) > -1 &&
                !suggestions.loading
            ) {
                // Resolve suggestions unless we get another set of suggestions within the debounce window
                this.suggestionsTimeout.clear();
                this.resolveSuggestions();
            }
        }
    }

    suggestionsTimeout = debounce((): void => {
        // If a search term change has triggered the 'waiting for suggestions' state
        // but the suggestions have not either been set to loading
        // or have changed, then it means that the results are not changed
        // In this situation Power Apps does not trigger a dataset change updateView
        // and so we timeout and show the previous results
        if (this.waitingForSuggestions && this.resolve) {
            this.previousSearchText = '';
            this.resolveSuggestions();
        }
    }, SUGGESTIONS_CHANGE_TIMEOUT);

    resolveSuggestions = debounce((): void => {
        // Resolve suggestions
        const suggestions = this.context.parameters.Suggestions;
        this.suggestionsLoading = false;
        this.waitingForSuggestions = false;
        this.suggestedPeople = getSuggestionFromDataset(suggestions);
        if (this.resolve) this.resolve(this.suggestedPeople);
        this.resolve = undefined;
    }, SUGGESTIONS_DEBOUNCE);

    raiseSearchEvent = debounce(
        (): void => {
            this.context.events.OnSearch();
        },
        NOTIFY_OUTPUT_CHANGED_DEBOUNCE,
        true,
    );

    onBlur = (): void => {
        this.context.events.OnBlur();
    };

    onFocus = (): void => {
        this.context.events.OnFocus();
    };

    onPersonSelect = (people: IPersonaProps[]): void => {
        this.selectedPeople = getDataSetFromPersona(people);
        this.notifyOutputChanged();
    };

    updateSearchTerm = (searchText: string): void => {
        this.searchText = searchText;
        this.notifyOutputChanged();
    };

    filterSuggestions = (search: string): Promise<IPersonaProps[]> | IPersonaProps[] => {
        return new Promise((resolve: (suggestedUsers: IPersonaProps[] | PromiseLike<IPersonaProps[]>) => void) => {
            this.searchText = search;
            // Notify that the search term has changed - this in turn will filter the suggestions dataset
            if (this.previousSearchText !== this.searchText) {
                this.previousSearchText = this.searchText;
                this.notifySearchChanged(resolve);
            } else {
                // The search has not changed, so return the previous suggestions
                resolve(this.suggestedPeople);
            }
        });
    };

    notifySearchChanged = (resolve: (selectedPeople: IPersonaProps[]) => void): void => {
        this.resolve = resolve;
        this.notifyOutputChanged();
        // Start debounce to resolve if no change to suggestions after the timeout
        this.suggestionsTimeout();
    };

    componentRefCallback = (ref: IBasePicker<IPersonaProps> | null): void => {
        if (ref) {
            this.ref = ref;
        }
    };

    /**
     * It is called by the framework to determine the schema of the data returned by getOutputs.  This is used to expose sub objects in formulas in the studio.
     * @returns a schema for the output data properties.
     */
    public getOutputSchema(): Promise<IOutputSchemaMap> {
        return Promise.resolve(PersonaSchema.getPersonaSchema());
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            SelectedPeople: this.selectedPeople,
            SearchText: this.searchText,
            AutoHeight: this.height,
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
