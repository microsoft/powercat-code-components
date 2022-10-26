import { IInputs, IOutputs } from './generated/ManifestTypes';
import { CanvasPeoplePicker } from './components/Peoplepicker';
import * as React from 'react';
import { ManifestPropertyNames, SuggestionColumns, InputProperties, InputEvents } from './ManifestConstants';
import { CanvasPeoplePickerProps, ICustomPersonaProps, IPropBag } from './components/Component.types';
import { IPersonaProps, IBasePicker } from '@fluentui/react';
import { getPersonaFromDataset, getSuggestionFromDataset } from './components/DatasetMapping';
import { PersonaSchema, IOutputSchemaMap } from './components/PersonaSchema';
import { getDataSetfromPersona } from './components/DatasetMapping';

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

export class PeoplePicker implements CustomControl<IInputs, IOutputs> {
    context: IPropBag<IInputs>;
    private notifyOutputChanged: () => void;
    suggestedPeople: IPersonaProps[];
    prevsuggestedPeople: IPersonaProps[];
    ref?: IBasePicker<IPersonaProps>;
    defaultSelected: IPersonaProps[];
    selectedPeople: ICustomPersonaProps[];
    height?: number;
    searchText: string;
    previousSearchText: string;
    suggestionsFilterPending?: (suggestions: IPersonaProps[]) => void;
    refreshSuggestions: boolean;
    resolve?: (selectedPeople: IPersonaProps[]) => void;
    maxTags: number;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(context: IPropBag<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.context.parameters.Suggestions.paging.setPageSize(500);
        this.context.parameters.Personas.paging.setPageSize(500);
    }

    onResize = (width: number, height: number): void => {
        this.height = height;
        this.notifyOutputChanged();
    };

    // Determining the final result by comparing it with SearchText
    isFinalResult = (record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord): boolean => {
        const suggestionKey = ((record.getValue(SuggestionColumns.SuggestionKey) as string) ?? '').toLowerCase();
        const suggestionName = ((record.getValue(SuggestionColumns.SuggestionName) as string) ?? '').toLowerCase();
        const suggestionRole = ((record.getValue(SuggestionColumns.SuggestionRole) as string) ?? '').toLowerCase();
        const currentSearchText = this.searchText.toLowerCase();
        return (
            suggestionKey.indexOf(currentSearchText) > -1 ||
            suggestionName.indexOf(currentSearchText) > -1 ||
            suggestionRole.indexOf(currentSearchText) > -1
        );
    };

    // To check if the Dataset is the latest by matching searchtext & To determine whether to resolve the promise
    checkforLatestDataset = (maxRetries: number): void => {
        let peopleListDataset = this.context.parameters.Suggestions;
        const sortedIDArray = peopleListDataset.sortedRecordIds;
        maxRetries === 0
            ? //return empty result as dataset is assumed empty
              this.returnPeople(this.resolve, true)
            : setTimeout(() => {
                  maxRetries = maxRetries - 1;
                  if (sortedIDArray.length > 0) {
                      const record = peopleListDataset.records[sortedIDArray[0]];
                      if (this.isFinalResult(record)) {
                          peopleListDataset = this.context.parameters.Suggestions;
                          this.suggestedPeople = getSuggestionFromDataset(peopleListDataset);
                          this.returnPeople(this.resolve);
                      } else {
                          this.checkforLatestDataset(maxRetries);
                      }
                  } else {
                      this.checkforLatestDataset(maxRetries);
                  }
              }, 100);
    };

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: IPropBag<IInputs>): React.ReactElement {
        this.context = context;

        const getPreSelectedMember =
            (this.defaultSelected === undefined && this.context.parameters.Personas.sortedRecordIds.length > 0) ||
            context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1;

        if (getPreSelectedMember) {
            const selectedpeopleDataset = context.parameters.Personas;
            this.defaultSelected = getPersonaFromDataset(selectedpeopleDataset);
        }
        if (this.refreshSuggestions) {
            this.refreshSuggestions = false;
            // Check for latest dataset with a defined retries
            this.checkforLatestDataset(50);
        }
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
            peoplepickerType: context.parameters.PeoplePickerType.raw,
            defaultSelected: this.defaultSelected,
            componentRef: this.componentRefCallback,
            accessibilityLabel: context.parameters.AccessibilityLabel.raw ?? '',
            minimumFilterLength: context.parameters.MinimumSearchTermLength.raw ?? 2,
            noresultfoundText: context.parameters.NoResultFoundMesage.raw ?? '',
            keepTypingMessage: context.parameters.SearchTermToShortMessage.raw ?? '',
            filterSuggestions: this.filterSuggestions,
            selectedItems: this.selectedItems,
            updateSearchTerm: this.updateSearchTerm,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            maxPeople: context.parameters.MaxPeople.raw ?? 10,
            hintText: context.parameters.HintText.raw ?? '',
            suggestionsHeaderText: context.parameters.SuggestionsHeaderText.raw ?? '',
        };
        return React.createElement(CanvasPeoplePicker, props);
    }

    onBlur = (): void => {
        this.context.events.OnBlur();
    };

    onFocus = (): void => {
        this.context.events.OnFocus();
    };

    selectedItems = (items: IPersonaProps[]): void => {
        this.selectedPeople = getDataSetfromPersona(items);
        this.notifyOutputChanged();
    };

    updateSearchTerm = (searchText: string): void => {
        this.searchText = searchText;
        this.notifyOutputChanged();
    };

    filterSuggestions = (search: string): Promise<IPersonaProps[]> | IPersonaProps[] => {
        return new Promise((resolve: (suggestedUsers: IPersonaProps[] | PromiseLike<IPersonaProps[]>) => void) => {
            this.searchText = search;
            this.context.events.OnSearch();
            // Notify that the search term has changed - this in turn will filter the suggestions dataset
            if (this.previousSearchText !== this.searchText) {
                this.previousSearchText = this.searchText;
                this.refreshSuggestions = true;
                this.notifyOutputChanged();
                this.resolve = resolve;
            } else {
                // The search has not changed, so return the previous suggestions
                resolve(this.suggestedPeople);
            }
        });
    };

    // eslint-disable-next-line
    returnPeople = (resolve: any, returnEmpty = false): IPersonaProps[] => {
        return resolve(returnEmpty ? [] : this.suggestedPeople);
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
