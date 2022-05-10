import { IDetailsList, IObjectWithKey, SelectionMode, Selection, getWindow, IColumn } from '@fluentui/react';
import * as React from 'react';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { getRecordKey, Grid, GridProps } from './Grid';
import { InputEvents, OutputEvents, RecordsColumns, SortDirection } from './ManifestConstants';
type DataSet = ComponentFramework.PropertyHelper.DataSetApi.EntityRecord & IObjectWithKey;

const SelectionTypes: Record<'0' | '1' | '2', SelectionMode> = {
    '0': SelectionMode.none,
    '1': SelectionMode.single,
    '2': SelectionMode.multiple,
};

export class FluentDetailsList implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    container: HTMLDivElement;
    context: ComponentFramework.Context<IInputs>;
    resources: ComponentFramework.Resources;
    sortedRecordsIds: string[] = [];
    records: {
        [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
    };
    sortedColumnsIds: string[] = [];
    columns: {
        [id: string]: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
    };
    datasetColumns: ComponentFramework.PropertyHelper.DataSetApi.Column[];
    eventName: string | undefined = undefined;
    eventColumn: string | undefined = undefined;
    eventRowKey: string | undefined | null = undefined;
    sortColumn: string | undefined = undefined;
    sortDirection: 'asc' | 'desc' | undefined = undefined;
    previousSortDir: string;
    selection: Selection;
    hasSetPageSize = false;
    ref: IDetailsList;
    scheduledEventOnNextUpdate = false;
    inputEvent = '';
    currentPage = 1;
    previousHasPreviousPage = false;
    previousHasNextPage = false;
    previousTotalRecords = 0;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        context.mode.trackContainerResize(true);
        this.resources = context.resources;
        this.selection = new Selection({
            onSelectionChanged: this.onSelectionChanged,
            canSelectItem: this.canSelectItem,
        });
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const dataset = context.parameters.records;
        const columns = context.parameters.columns;

        this.setPageSize(context);

        const datasetNotInitialised = this.records === undefined;
        const datasetChanged =
            !dataset.loading &&
            !columns.loading &&
            (context.updatedProperties.indexOf('dataset') > -1 ||
                context.updatedProperties.indexOf('records_dataset') > -1 ||
                context.updatedProperties.indexOf('columns_dataset') > -1);

        const resetPaging =
            datasetChanged && !dataset.loading && !dataset.paging.hasPreviousPage && this.currentPage !== 1;

        if (resetPaging) {
            this.currentPage = 1;
        }

        if (datasetChanged || datasetNotInitialised) {
            // If this is the first time we are setting the records, clear the selection in case there is state from a previous
            // time the screen was shown
            if (!this.records) {
                this.setSelectedRecords([]);
            }

            this.records = dataset.records;
            this.sortedRecordsIds = dataset.sortedRecordIds;
            this.columns = columns.records;
            this.sortedColumnsIds = columns.sortedRecordIds;
            this.datasetColumns = dataset.columns;
        }

        const grid = React.createElement(Grid, this.getGridProps(context));

        this.handleInputEvents(context);

        const pagingChanged =
            this.previousHasPreviousPage !== dataset.paging.hasPreviousPage ||
            this.previousHasNextPage !== dataset.paging.hasNextPage ||
            this.previousTotalRecords !== dataset.paging.totalResultCount;

        if (pagingChanged) {
            this.notifyOutputChanged();
            this.previousHasPreviousPage = dataset.paging.hasPreviousPage;
            this.previousHasNextPage = dataset.paging.hasNextPage;
            this.previousTotalRecords = dataset.paging.totalResultCount;
        }

        return grid;
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        const dataset = this.context.parameters.records;
        const defaultOutputs = {
            PageNumber: this.currentPage,
            TotalRecords: dataset.paging.totalResultCount,
            TotalPages: this.getTotalPages(),
            HasNextPage: dataset.paging.hasNextPage,
            HasPreviousPage: dataset.paging.hasPreviousPage,
        } as IOutputs;

        let eventOutputs = { EventName: '' } as IOutputs;
        switch (this.eventName) {
            case OutputEvents.Sort:
                eventOutputs = {
                    EventName: this.eventName,
                    SortEventColumn: this.sortColumn,
                    SortEventDirection:
                        this.sortDirection === 'desc' ? SortDirection.Descending : SortDirection.Ascending,
                } as IOutputs;
                break;
            case OutputEvents.CellAction:
                eventOutputs = {
                    EventName: this.eventName,
                    EventColumn: this.eventColumn,
                    EventRowKey: this.eventRowKey,
                } as IOutputs;
                break;
            case OutputEvents.OnRowSelectionChange:
                eventOutputs = {
                    EventName: this.eventName,
                    EventRowKey: this.eventRowKey,
                } as IOutputs;
                break;
        }
        // Reset the event so that it does not re-trigger
        this.eventName = '';
        return { ...defaultOutputs, ...eventOutputs };
    }

    public destroy(): void {
        // noop
    }

    private getGridProps(context: ComponentFramework.Context<IInputs>) {
        const dataset = context.parameters.records;
        const columns = context.parameters.columns;

        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

        const sorting = this.datasetSupportsSorting()
            ? dataset.sorting
            : [
                  {
                      name: context.parameters.CurrentSortColumn.raw ?? '',
                      sortDirection: context.parameters.CurrentSortDirection
                          .raw as unknown as ComponentFramework.PropertyHelper.DataSetApi.Types.SortDirection,
                  } as ComponentFramework.PropertyHelper.DataSetApi.SortStatus,
              ];

        return {
            width: allocatedWidth,
            height: allocatedHeight,
            visible: context.mode.isVisible,
            records: this.records,
            sortedRecordIds: this.sortedRecordsIds,
            columns: this.columns,
            datasetColumns: this.datasetColumns,
            sortedColumnIds: this.sortedColumnsIds,
            shimmer: !dataset.loading && dataset.paging.totalResultCount === -1,
            itemsLoading: dataset.loading || columns.loading,
            selection: this.selection,
            onNavigate: this.onNavigate,
            onCellAction: this.onCellAction,
            sorting: sorting,
            onSort: this.onSort,
            overlayOnSort: this.datasetSupportsSorting(),
            selectionType:
                context.mode.isControlDisabled !== true
                    ? SelectionTypes[context.parameters.SelectionType.raw]
                    : SelectionMode.none,

            componentRef: this.componentRef,
            selectOnFocus: context.parameters.SelectRowsOnFocus.raw === true,
            ariaLabel: this.undefinedIfEmpty(context.parameters.AccessibilityLabel),
            compact: context.parameters.Compact.raw === true,
            pageSize: context.parameters.PageSize.raw,
            themeJSON: this.undefinedIfEmpty(context.parameters.Theme),
            alternateRowColor: this.undefinedIfEmpty(context.parameters.AlternateRowColor),
            isHeaderVisible: context.parameters.HeaderVisible?.raw !== false,
            selectionAlwaysVisible: context.parameters.SelectionAlwaysVisible?.raw === true,
            resources: this.resources,
            columnDatasetNotDefined: columns.error && !columns.loading,
        } as GridProps;
    }

    private setPageSize(context: ComponentFramework.Context<IInputs>) {
        const dataset = context.parameters.records;
        if (
            !this.hasSetPageSize ||
            (context.parameters.PageSize.raw && context.updatedProperties.indexOf('PageSize') > -1)
        ) {
            dataset.paging.setPageSize(context.parameters.PageSize.raw || 150);
            this.hasSetPageSize = true;
        }
    }

    private handleInputEvents(context: ComponentFramework.Context<IInputs>) {
        const inputEvent = context.parameters.InputEvent.raw;
        const inputEventChanged = inputEvent !== undefined && inputEvent !== this.inputEvent;
        if (inputEventChanged) {
            this.inputEvent = inputEvent as string;
        }
        // If the records are ready and we have a scheduled event pending then run it now
        const scheduledEventOnNextUpdate =
            this.scheduledEventOnNextUpdate &&
            context.updatedProperties &&
            context.updatedProperties.indexOf('records') > -1;

        if (inputEvent && (inputEventChanged || scheduledEventOnNextUpdate)) {
            // if there are not items or items are loading - then schedule the event
            if (!this.records || context.parameters.records.loading === true) {
                this.scheduledEventOnNextUpdate = true;
                return;
            }
            this.scheduledEventOnNextUpdate = false;
            this.handleSelectionEvents(inputEvent);
            this.handleFocusEvents(inputEvent);
            this.handlePagingEvents(inputEvent);
        }
    }

    private handleSelectionEvents(inputEvent: string) {
        // Clear the selection if requred, before setting the focus
        if (inputEvent.indexOf(InputEvents.ClearSelection) > -1) {
            this.asyncOperations(() => {
                this.selection.setAllSelected(false);
                this.ref.forceUpdate();
            });
        } else if (inputEvent.indexOf(InputEvents.SetSelection) > -1) {
            this.asyncOperations(() => {
                // set the default selection
                this.setSelected();
                this.ref.forceUpdate();
            });
        }
    }

    private handleFocusEvents(inputEvent: string) {
        if (inputEvent.indexOf(InputEvents.SetFocusOnRow) > -1) {
            // Get the row to set focus on - the event is expected to be in the format SetFocusOnRow<RowNumber>_<RandElement>
            let rowIndex = parseInt(inputEvent.substring(InputEvents.SetFocusOnRow.length));
            if (rowIndex === undefined || isNaN(rowIndex)) rowIndex = 0; // Default to row zero
            this.asyncOperations(() => {
                this.ref.focusIndex(rowIndex);
            });
        } else if (inputEvent.indexOf(InputEvents.SetFocusOnHeader) > -1) {
            this.asyncOperations(() => {
                this.ref.focusIndex(-1);
            });
        } else if (inputEvent.indexOf(InputEvents.SetFocus) > -1) {
            // Set focus on the first row (if no rows, then the focus is placed on the header)
            const index = this.sortedRecordsIds && this.sortedRecordsIds.length > 0 ? 0 : -1;
            this.asyncOperations(() => {
                this.ref.focusIndex(index);
            });
        }
    }

    private handlePagingEvents(inputEvent: string) {
        if (inputEvent.indexOf(InputEvents.LoadNextPage) > -1) {
            this.loadNextPage();
        } else if (inputEvent.indexOf(InputEvents.LoadPreviousPage) > -1) {
            this.loadPreviousPage();
        } else if (inputEvent.indexOf(InputEvents.LoadFirstPage) > -1) {
            this.loadFirstPage();
        }
    }

    private asyncOperations(callback: () => void) {
        // Used to ensure setfocus gets executed after the dom is updated
        const win = getWindow(this.container);
        if (win) {
            win.requestAnimationFrame(() => {
                setTimeout(callback, 0);
            });
        }
    }

    private setSelected() {
        // Set the selected items using the record property
        this.selection.setChangeEvents(false);
        this.selection.setAllSelected(false);
        this.sortedRecordsIds.forEach((s) => {
            const item = this.records[s];
            if (item && item.getValue(RecordsColumns.RecordSelected) === true) {
                this.selection.setKeySelected(getRecordKey(item), true, false);
            }
        });

        this.selection.setChangeEvents(true);
        this.onSelectionChanged();
    }

    setSelectedRecords = (ids: string[]): void => {
        try {
            this.context.parameters.records.setSelectedRecordIds(ids);
        } catch (ex) {
            console.error('DetailsList: Error when calling setSelectedRecordIds', ex);
        }

        const raiseOnRowsSelectionChangeEvent = this.context.parameters.RaiseOnRowSelectionChangeEvent;
        if (raiseOnRowsSelectionChangeEvent && raiseOnRowsSelectionChangeEvent.raw === true) {
            // When the row selection changes, raise an event
            this.eventName = OutputEvents.OnRowSelectionChange;
            this.eventRowKey = ids && ids.length > 0 ? ids[0] : null;
            this.notifyOutputChanged();
        }
    };

    onCellAction = (
        item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
        column?: IColumn | undefined,
    ): void => {
        // A cell action is invoked - e.g. expand/collapse row
        if (item && column) {
            // Set the event column
            this.eventName = OutputEvents.CellAction;
            this.eventColumn = column.fieldName;
            let rowKey = item.getValue(RecordsColumns.RecordKey);
            if (rowKey === null) {
                // Custom Row Id column is not set, so just use row index
                rowKey = this.sortedRecordsIds.indexOf(item.getRecordId()).toString();
            }
            this.eventRowKey = rowKey.toString();

            // Don't use openDatasetItem here because the event is not guarenteed to fire after the EventColumn output property is set
            this.notifyOutputChanged();
        }
    };

    onNavigate = (item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord): void => {
        if (item) {
            const itemKey = (item as IObjectWithKey).key;
            const currentItems = this.selection.getItems();
            const itemIndex = currentItems.indexOf(item as IObjectWithKey);
            const selectionMode = SelectionTypes[this.context.parameters.SelectionType.raw];

            // Select the item being invoked if multi/single select mode
            // By default, the DetailsList will not select the item which has it's action invoked
            if (selectionMode !== SelectionMode.none && itemKey) {
                this.selection.setChangeEvents(false);
                if (selectionMode === SelectionMode.single) {
                    // Clear all other selected items if single select mode
                    this.selection.setAllSelected(false);
                }
                this.selection.setKeySelected(itemKey as string, true, false);
                this.selection.setChangeEvents(true, true);
                this.ref.forceUpdate();
            }

            // No event event/column, so reset it
            if (this.eventColumn !== undefined) {
                this.eventName = undefined;
                this.eventColumn = undefined;
                this.notifyOutputChanged();
            }

            this.context.parameters.records.openDatasetItem(item.getNamedReference());
            if (selectionMode === SelectionMode.multiple) {
                // Ensure that the item being navigated is selected as well as the previous selected items
                // Sometime the above setKeySelected doesn't take immediate effect on selection.getSelectedIndices
                const itemsSelected = this.selection.getSelectedIndices();
                if (itemsSelected.indexOf(itemIndex) === -1) {
                    itemsSelected.push(itemIndex);
                }
                // Preserve the other items if in multi select mode
                this.onSelectionChanged(itemsSelected);
            }
        }
    };

    datasetSupportsSorting(): boolean {
        const targetEntity = this.context.parameters.records.getTargetEntityType();
        return targetEntity?.length > 0;
    }

    onSort = (name: string, desc: boolean): void => {
        // Use server side sorting api if the connection is dataverse
        if (this.datasetSupportsSorting()) {
            const sorting = this.context.parameters.records.sorting;
            while (sorting.length > 0) {
                sorting.pop();
            }
            this.context.parameters.records.sorting.push({
                name: name,
                sortDirection: desc ? 1 : 0,
            });
            this.context.parameters.records.refresh();
        } else {
            this.eventName = 'Sort';
            this.sortColumn = name;
            this.sortDirection = desc === true ? 'desc' : 'asc';
            this.notifyOutputChanged();
        }
    };

    componentRef = (ref: IDetailsList | null): void => {
        if (ref) {
            this.ref = ref;
        }
    };

    onSelectionChanged = (forceSelectedIndices?: number[]): void => {
        if (this.selection) {
            const items = this.selection.getItems() as DataSet[];
            // If we pass forceSelected, then use this - otherwise use the items current selected on the grid
            const selectedIndices = forceSelectedIndices || this.selection.getSelectedIndices();
            const selectedIds: string[] = [];
            selectedIndices.forEach((index: number) => {
                const item: DataSet | undefined = items[index];
                const recordId = item && items[index].getRecordId();
                if (recordId) selectedIds.push(recordId);
            });
            this.setSelectedRecords(selectedIds);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canSelectItem = (item: IObjectWithKey, index?: number | undefined): boolean => {
        let selectable = true;
        if (item) {
            selectable = (item as DataSet).getValue(RecordsColumns.RecordCanSelect) !== false;
        }

        return selectable;
    };

    getTotalPages(): number {
        const dataset = this.context.parameters.records;
        const pages = Math.floor((dataset.paging.totalResultCount - 1) / dataset.paging.pageSize + 1);
        return Math.max(1, pages);
    }

    loadFirstPage(): void {
        const dataset = this.context.parameters.records;
        this.currentPage = 1;
        dataset.paging.loadExactPage(1);
        this.notifyOutputChanged();
    }

    loadNextPage(): void {
        const dataset = this.context.parameters.records;
        const totalPages = this.getTotalPages();
        if (this.currentPage < totalPages) {
            this.currentPage++;
            dataset.paging.loadExactPage(this.currentPage);
            this.notifyOutputChanged();
        }
    }

    loadPreviousPage(): void {
        const dataset = this.context.parameters.records;
        if (this.currentPage > 1) {
            this.currentPage--;
            dataset.paging.loadExactPage(this.currentPage);
            this.notifyOutputChanged();
        }
    }

    undefinedIfEmpty(property: ComponentFramework.PropertyTypes.StringProperty): string | undefined {
        return property.raw && property.raw !== '' ? property.raw : undefined;
    }
}
