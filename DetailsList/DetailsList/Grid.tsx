import {
    IDetailsListProps,
    CheckboxVisibility,
    ColumnActionsMode,
    ConstrainMode,
    DetailsListLayoutMode,
    IColumn,
    IDetailsHeaderProps,
    IDetailsList,
    DetailsRow,
    ICellStyleProps,
    IDetailsRowStyles,
    ShimmeredDetailsList,
    IShimmeredDetailsListProps,
    Overlay,
    ScrollablePane,
    ScrollbarVisibility,
    Sticky,
    StickyPositionType,
    IObjectWithKey,
    ISelectionZoneProps,
    Selection,
    createTheme,
    IPartialTheme,
    IRefObject,
    IRenderFunction,
    SelectionMode,
    ThemeProvider,
    IDetailsRowProps,
} from '@fluentui/react';
import * as React from 'react';
import { IGridColumn } from './Component.types';
import { ClassNames, concatClassNames } from './Grid.styles';
import { GridCell } from './GridCell';
import { CellTypes, ColumnsColumns, RecordsColumns, SortDirection } from './ManifestConstants';
import { NoFields } from './NoFields';

type DataSet = ComponentFramework.PropertyHelper.DataSetApi.EntityRecord & IObjectWithKey;

const CELL_LEFT_PADDING = 8;
const CELL_RIGHT_PADDING = 8;
const MIN_COL_WIDTH = 32;

export interface GridProps {
    width?: number;
    height?: number;
    visible?: boolean;
    datasetColumns: ComponentFramework.PropertyHelper.DataSetApi.Column[];
    columns: Record<string, ComponentFramework.PropertyHelper.DataSetApi.EntityRecord>;
    sortedColumnIds: string[];
    records: Record<string, ComponentFramework.PropertyHelper.DataSetApi.EntityRecord>;
    sortedRecordIds: string[];
    shimmer: boolean;
    itemsLoading: boolean;
    selectionType: SelectionMode;
    selection: Selection;
    onNavigate: (item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord) => void;
    onCellAction: (item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord, column?: IColumn) => void;
    overlayOnSort?: boolean;
    onSort: (name: string, desc: boolean) => void;
    sorting: ComponentFramework.PropertyHelper.DataSetApi.SortStatus[];
    componentRef: IRefObject<IDetailsList>;
    selectOnFocus: boolean;
    ariaLabel: string | null;
    compact?: boolean;
    themeJSON?: string;
    alternateRowColor?: string;
    isHeaderVisible?: boolean;
    selectionAlwaysVisible?: boolean;
    resources: ComponentFramework.Resources;
    columnDatasetNotDefined?: boolean;
}

export function getRecordKey(record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord): string {
    const customkey = record.getValue(RecordsColumns.RecordKey);
    return customkey ? customkey.toString() : record.getRecordId();
}

const cellStyleProps = {
    cellLeftPadding: CELL_LEFT_PADDING,
    cellRightPadding: CELL_RIGHT_PADDING,
    cellExtraRightPadding: 0,
} as ICellStyleProps;

const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
    if (props && defaultRender) {
        return (
            <Sticky stickyPosition={StickyPositionType.Header} stickyClassName="sticky-header">
                {defaultRender({
                    ...props,
                })}
            </Sticky>
        );
    }
    return null;
};

export const Grid = React.memo((props: GridProps) => {
    const {
        records,
        sortedRecordIds,
        datasetColumns,
        columns,
        sortedColumnIds,
        selectionType,
        height,
        itemsLoading,
        selection,
        onSort,
        onCellAction,
        componentRef,
        selectOnFocus,
        sorting,
        overlayOnSort,
        themeJSON,
        alternateRowColor,
        resources,
        columnDatasetNotDefined,
    } = props;

    const [isComponentLoading, setIsLoading] = React.useState<boolean>(false);

    const onColumnClick = React.useCallback(
        (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
            if (column && ev && column.fieldName) {
                // If we are using dataverse loading, then set the internal sort flag to block the UI until the dataset is loaded
                if (overlayOnSort === true) {
                    setIsLoading(true);
                }
                // Start ascending - then toggle
                const sortDirection = column.isSorted ? !column.isSortedDescending : false;
                // Get the column to sort by
                const columnData = column.data as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
                const sortByColumn =
                    (columnData.getValue(ColumnsColumns.ColSortBy) as string | undefined) || column.fieldName;

                onSort(sortByColumn, sortDirection);
            }
        },
        [onSort, setIsLoading, overlayOnSort],
    );

    const items: (DataSet | undefined)[] = React.useMemo(() => {
        setIsLoading(false);
        const sortedRecords: (DataSet | undefined)[] = sortedRecordIds
            .filter((id) => id !== undefined) // Workaround for undefined sortedRecordIds introduced in version 3.21115.25 of studio
            .map((id) => {
                const record = records[id];
                if (record) {
                    // Set the ObjectWithKey property so that the selection can keep it selected when sorting/filtering etc
                    (record as IObjectWithKey).key = getRecordKey(record);
                }
                return record;
            });

        return sortedRecords;
    }, [records, sortedRecordIds, setIsLoading]);

    // Column Layout
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const { gridColumns, expandColumn } = React.useMemo(() => {
        const gridColumns: IGridColumn[] = [];
        const subColumns: IGridColumn[] = [];
        let expandColumn: IGridColumn | undefined = undefined;

        sortedColumnIds.forEach((id) => {
            const column = columns[id];
            const columnName = column.getValue(ColumnsColumns.ColName) as string;
            const datasetColumn = datasetColumns.find((c) => c.name === columnName);
            if (datasetColumn) {
                const sortOn = getSortStatus(sorting, datasetColumn, column);
                const col = mapToGridColumn(column, datasetColumn, columnName, sortOn, onColumnClick);

                if (!col.showAsSubTextOf) {
                    gridColumns.push(col);
                } else {
                    subColumns.push(col);
                }

                if (col.cellType?.toLowerCase() === CellTypes.Expand) {
                    expandColumn = col;
                }
            }
        });

        // Add subtext cols to their parents
        for (const col of subColumns) {
            // find parent
            const parentCol = gridColumns.find((c) => c.fieldName === col.showAsSubTextOf);
            if (parentCol) {
                if (!parentCol.childColumns) parentCol.childColumns = [];
                parentCol.childColumns.push(col);
            }
        }

        return { gridColumns: gridColumns, expandColumn: expandColumn as IGridColumn | undefined };
    }, [sortedColumnIds, columns, datasetColumns, sorting, onColumnClick]);

    const onRenderItemColumn = React.useCallback(
        (item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord, index?: number, column?: IColumn) => {
            if (item) {
                const dataSetItem = item as DataSet;
                const expanded =
                    expandColumn === undefined ||
                    (expandColumn?.fieldName != null &&
                        dataSetItem?.getValue &&
                        dataSetItem?.getValue(expandColumn.fieldName) !== false);
                return (
                    <GridCell
                        column={column}
                        index={index}
                        item={item}
                        onCellAction={onCellAction}
                        expanded={expanded}
                    />
                );
            }
            return <></>;
        },
        [onCellAction, expandColumn],
    );

    const onRenderRow: IDetailsListProps['onRenderRow'] = React.useCallback(
        (props?: IDetailsRowProps) => {
            if (props) {
                const customStyles: Partial<IDetailsRowStyles> = {};

                if (alternateRowColor && props.itemIndex % 2 === 0) {
                    customStyles.root = { backgroundColor: alternateRowColor };
                }

                return <DetailsRow {...props} styles={customStyles} />;
            }
            return null;
        },
        [alternateRowColor],
    );

    const containerSize = React.useMemo(() => {
        return {
            height: height,
        } as React.CSSProperties;
    }, [height]);

    // Changing the set tells the Details List we have a different set of records
    // So the selection needs to be reset etc.
    const setName = React.useMemo(() => {
        return 'set' + gridColumns.map((c) => c.fieldName).join(',');
    }, [gridColumns]);

    const selectionZoneProps = React.useMemo(() => {
        return {
            selection: selection,
            disableAutoSelectOnInputElements: true,
            selectionMode: selectionType,
            isSelectedOnFocus: selectOnFocus,
        } as ISelectionZoneProps;
    }, [selection, selectionType, selectOnFocus]);

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const gridProps = getGridProps(props, selectionType);

    return (
        <ThemeProvider
            theme={theme}
            applyTo="none"
            style={containerSize}
            className={ClassNames.PowerCATFluentDetailsList}
        >
            <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto} scrollContainerFocus={false}>
                <ShimmeredDetailsList
                    {...gridProps}
                    columns={gridColumns}
                    onRenderRow={onRenderRow}
                    onRenderItemColumn={onRenderItemColumn}
                    items={items}
                    setKey={setName}
                    selection={selection}
                    selectionZoneProps={selectionZoneProps}
                    componentRef={componentRef}
                ></ShimmeredDetailsList>
            </ScrollablePane>
            {(itemsLoading || isComponentLoading) && <Overlay />}
            {columnDatasetNotDefined && !itemsLoading && <NoFields resources={resources} />}
        </ThemeProvider>
    );
});

Grid.displayName = 'Grid';

function getGridProps(props: GridProps, selectionType: SelectionMode) {
    return {
        ariaLabelForGrid: props.ariaLabel === null ? undefined : props.ariaLabel,
        getKey: getKey,
        initialFocusedIndex: -1,
        checkButtonAriaLabel: 'select row',
        onItemInvoked: props.onNavigate as (item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord) => void,
        // If Justified layout is used, the measurements do not work due to the scaling that
        // happens in the maker portal - a work around is to skip viewport measurements but this is complex
        layoutMode: DetailsListLayoutMode.fixedColumns,
        constrainMode: ConstrainMode.unconstrained,
        selectionMode: selectionType,
        checkboxVisibility:
            selectionType === SelectionMode.none
                ? CheckboxVisibility.hidden
                : props.selectionAlwaysVisible
                ? CheckboxVisibility.always
                : CheckboxVisibility.onHover,
        compact: props.compact === true,
        cellStyleProps: cellStyleProps,
        selectionPreservedOnEmptyClick: true,
        useReducedRowRenderer: true,
        enableShimmer: props.shimmer,
        onRenderDetailsHeader: onRenderDetailsHeader,
        isHeaderVisible: props.isHeaderVisible,
    } as IShimmeredDetailsListProps;
}

function getSortStatus(
    sorting: ComponentFramework.PropertyHelper.DataSetApi.SortStatus[],
    datasetColumn: ComponentFramework.PropertyHelper.DataSetApi.Column,
    column: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
) {
    return (
        sorting &&
        sorting.find(
            (s) => s.name === datasetColumn.name || s.name === column.getFormattedValue(ColumnsColumns.ColSortBy),
        )
    );
}

function getKey(item: unknown, index?: number): string {
    // Each row must have a unique key - especially when updating the items dataset - the new rows must have a new key
    const itemAsDataset = item as DataSet;
    if (item && itemAsDataset.getRecordId) {
        return 'row-' + itemAsDataset.getRecordId();
    }
    if (item && itemAsDataset.key) {
        return 'row-' + itemAsDataset.key;
    }
    if (index) {
        // Fall back - for rows such as the load more records footer rows
        return 'row-' + index.toString();
    }
    return '';
}

// Maps a custom column to a Fluent UI column
function mapToGridColumn(
    column: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
    datasetColumn: ComponentFramework.PropertyHelper.DataSetApi.Column,
    columnName: string,
    sortOn: ComponentFramework.PropertyHelper.DataSetApi.SortStatus | undefined,
    onColumnClick: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void,
) {
    const colWidth = undefinedIfNullish(column.getValue(ColumnsColumns.ColWidth) as number);
    const colIsBold = column.getValue(ColumnsColumns.ColIsBold) === true;
    const horizontalAlign = (column.getFormattedValue(ColumnsColumns.ColHorizontalAlign) as string)?.toLowerCase();
    const showAsSubTextOf = column.getFormattedValue(ColumnsColumns.ColShowAsSubTextOf);
    const cellType = column.getFormattedValue(ColumnsColumns.ColCellType);
    const isSortable = column.getValue(ColumnsColumns.ColSortable) === true && !datasetColumn.disableSorting;

    let alignmentClass = '';
    if (horizontalAlign === 'right' || horizontalAlign === 'center') {
        alignmentClass = horizontalAlign + '-align';
    }

    const cellClassName = cellType ? ClassNames.celltypePrefix + cellType.toString().toLowerCase() : '';

    const headerClassName = concatClassNames([
        alignmentClass,
        cellType ? ClassNames.celltypePrefix + cellType.toString().toLowerCase() : '',
    ]);

    return {
        // Give the column a unique key based on the input collection so changing the colkumns will recalculate widths etc.
        key: 'col' + column.getRecordId(),
        name: column.getFormattedValue(ColumnsColumns.ColDisplayName),
        fieldName: columnName,
        maxWidth: colWidth,
        minWidth: MIN_COL_WIDTH,
        isMultiline: column.getValue(ColumnsColumns.ColMultiLine) === true,
        headerPaddingLeft: column.getValue(ColumnsColumns.ColHeaderPaddingLeft),
        isSorted: sortOn !== undefined,
        isSortedDescending: sortOn?.sortDirection.toString() === SortDirection.Descending,
        isResizable: column.getValue(ColumnsColumns.ColResizable) === true,
        isFiltered: false,
        isBold: colIsBold,
        columnActionsMode: isSortable ? ColumnActionsMode.clickable : ColumnActionsMode.disabled,
        data: column,
        className: cellClassName,
        headerClassName: headerClassName,
        tagColor: column.getFormattedValue(ColumnsColumns.ColTagColorColumn),
        tagBorderColor: column.getFormattedValue(ColumnsColumns.ColTagBorderColorColumn),
        onColumnClick: onColumnClick,
        cellType: cellType,
        showAsSubTextOf: showAsSubTextOf,
        isLabelAbove: column.getValue(ColumnsColumns.ColLabelAbove) === true,
        firstMultiValueBold: column.getValue(ColumnsColumns.ColFirstMultiValueBold) === true,
        paddingLeft: undefinedIfNullish(column.getValue(ColumnsColumns.ColPaddingLeft)),
        paddingTop: undefinedIfNullish(column.getValue(ColumnsColumns.ColPaddingTop)),
        multiValuesDelimter: column.getValue(ColumnsColumns.ColMultiValueDelimeter),
        inlineLabel: undefinedIfNullish(column.getFormattedValue(ColumnsColumns.ColInlineLabel)),
        hideWhenBlank: column.getValue(ColumnsColumns.ColHideWhenBlank) === true,
        subTextRow: column.getValue(ColumnsColumns.ColSubTextRow),
        ariaTextColumn: column.getFormattedValue(ColumnsColumns.ColAriaTextColumn),
        cellActionDisabledColumn: undefinedIfNullish(column.getValue(ColumnsColumns.ColCellActionDisabledColumn)),
        imageWidth: undefinedIfNullish(column.getValue(ColumnsColumns.ColImageWidth)),
        imagePadding: undefinedIfNullish(column.getValue(ColumnsColumns.ColImagePadding)),
        verticalAligned: undefinedIfNullish(column.getValue(ColumnsColumns.ColVerticalAlign)),
        horizontalAligned: undefinedIfNullish(column.getValue(ColumnsColumns.ColHorizontalAlign)),
        isRowHeader: column.getValue(ColumnsColumns.ColRowHeader) === true,
    } as IGridColumn;

    function undefinedIfNullish<T>(value: T) {
        return defaultIfNullish(value, undefined);
    }
    function defaultIfNullish<T>(value: T, defaultValue: T) {
        return (value as T) ? value : defaultValue;
    }
}
