/* eslint-disable react/prop-types */
import { DefaultButton, FontIcon, IColumn, IconButton, Image, IRawStyle, Link, mergeStyles } from '@fluentui/react';
import * as React from 'react';
import { IGridColumn } from './Component.types';
import { DatasetArray } from './DatasetArrayItem';
import { ClassNames, FontStyles } from './Grid.styles';
import { CellTypes } from './ManifestConstants';

const CSS_IMPORTANT = ' !important';

const MAP_CSS_ALIGN: Record<string, string> = {
    top: 'start',
    left: 'start',
    bottom: 'end',
    right: 'end',
    center: 'center',
};
export interface GridCellProps {
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>;
    index?: number;
    column?: IColumn;
    expanded?: boolean;
    onCellAction: (item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord, column?: IColumn) => void;
}

export const GridCell = React.memo((props: GridCellProps) => {
    const { column: col, item, onCellAction, expanded } = props;
    const column = col as IGridColumn;

    const cellNavigation = React.useCallback(() => {
        onCellAction(item as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord, column);
    }, [onCellAction, item, column]);

    let cellContent = <></>;
    const childCellRows: Record<string, IGridColumn[]> = {};

    // Add root cell content
    const childColumns = column.childColumns || [];
    const columns = [column, ...(expanded !== false ? childColumns : [])];
    if (columns && columns.length > 0) {
        // Group by the row by the Sub Text Row Number
        columns.forEach((c, i) => {
            const row = c.subTextRow?.toString() || i;
            childCellRows[row] = childCellRows[row] || [];
            childCellRows[row].push(c);
        });

        const verticalAlign: string | undefined = column.verticalAligned
            ? MAP_CSS_ALIGN[column.verticalAligned?.toLowerCase()]
            : undefined;

        const horizontalAlign: string | undefined = column.horizontalAligned
            ? MAP_CSS_ALIGN[column.horizontalAligned?.toLowerCase()]
            : undefined;

        const containerStyle = {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            height: verticalAlign === 'end' || verticalAlign === 'center' ? '100%' : undefined,
            justifyContent: horizontalAlign,
            alignItems: verticalAlign,
        } as IRawStyle;

        const groupedRowKeys = Object.keys(childCellRows);
        // Adding in the child cells/rows to the flex grid. A break div is used for each new row
        cellContent = (
            <div className={mergeStyles(containerStyle)}>
                {groupedRowKeys.map((key, i) => {
                    const moreRows = i < groupedRowKeys.length - 1;
                    const cellCols = childCellRows[key];
                    return (
                        <React.Fragment key={'childCellRow-' + key.toString()}>
                            {cellCols.map((c, colIndex) => {
                                const { cellContents, isBlank } = getCellTemplate(c, item, cellNavigation);
                                const moreCols = colIndex < cellCols.length - 1;
                                return wrapContent(cellContents, c, isBlank, moreCols);
                            })}
                            {moreRows && <span className={ClassNames.subTextRowBreak}></span>}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
    return cellContent;
});

GridCell.displayName = 'GridCell';

function getCellTemplate(
    columnEx: IGridColumn,
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
    cellNavigation: () => void,
) {
    let cellContents = <></>;
    let isBlank = false;
    switch (columnEx.cellType?.toLowerCase()) {
        case CellTypes.Expand:
            cellContents = getExpandIconCell(item, columnEx, cellNavigation);
            break;
        case CellTypes.Image:
        case CellTypes.ClickableImage:
            ({ isBlank, cellContents } = getIconCell(item, columnEx, cellNavigation));
            break;
        case CellTypes.Tag:
            ({ isBlank, cellContents } = getTextTagCell(columnEx, item));
            break;
        case CellTypes.IndicatorTag:
            ({ isBlank, cellContents } = getColorTagCell(columnEx, item));
            break;
        case CellTypes.Link:
            ({ isBlank, cellContents } = getLinkCell(columnEx, item, cellNavigation));
            break;
        default:
            ({ cellContents, isBlank } = getCellContent(item, columnEx));
            isBlank = columnEx.hideWhenBlank === true && isBlank;
            break;
    }
    return { cellContents, isBlank };
}

function wrapContent(cellContents: JSX.Element, column: IGridColumn, isBlank: boolean, moreCols: boolean) {
    // Set the width - if this is the root, then we always set the width to prevent overflow to the column to the right
    // If this is a sub column, then we can alow the content to overflow if the width is not set
    const constrainWidth = column.maxWidth !== undefined || column.isMultiline === true;
    let whiteSpace: string | undefined = undefined;
    if (constrainWidth) {
        whiteSpace = column.isMultiline === true ? 'normal' : 'nowrap';
    }
    const targetWidth = column.currentWidth || column.maxWidth;
    // If constained width and multi-line=true - normal wrap
    // If constained width and multi-line=false - nowrap
    // If constrainted = false - nowrap
    const cellStyle = {
        maxWidth: undefinedIf(constrainWidth, targetWidth),
        textOverflow: undefinedIf(constrainWidth, 'ellipsis'),
        overflow: undefinedIf(constrainWidth, 'hidden'),
        whiteSpace: whiteSpace,
        paddingLeft: undefinedIf(!isBlank, column.paddingLeft),
        paddingTop: undefinedIf(!isBlank, column.paddingTop),
        paddingRight: undefinedIf(!isBlank && moreCols, '4px'),
        fontWeight: column.isBold ? FontStyles.Bold.fontWeight : FontStyles.Normal.fontWeight,
    } as IRawStyle;

    const hasInlineLabel = column.inlineLabel !== undefined;
    const labelAbove = hasInlineLabel && column.isLabelAbove === true;
    cellContents = !isBlank ? (
        <span className={mergeStyles(cellStyle)}>
            {hasInlineLabel && <span className={ClassNames.inlineLabel}>{column.inlineLabel || column.name}</span>}
            {labelAbove && <br />}
            {cellContents}
        </span>
    ) : (
        <></>
    );

    return cellContents;
}
function undefinedIf<T>(flag: boolean, value: T): T | undefined {
    return flag ? value : undefined;
}

function getColorTagCell(
    column: IGridColumn,
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
) {
    // Render a status column
    // Get the actual color from the status column

    const tagcolor = getCellValue<string>(column.tagColor, item)[0];

    const indicatorColorClass = `${ClassNames.statusTag} ${mergeStyles({
        ':after': { background: tagcolor + CSS_IMPORTANT },
    })}`;
    const tagText = getCellValue<string>(column.fieldName, item)[0];
    const isBlank = !tagText || tagText === '';
    const cellContents = !isBlank ? (
        <span className={indicatorColorClass} title={tagText}>
            {tagText}
        </span>
    ) : (
        <></>
    );
    return { isBlank, cellContents };
}

function getTextTagCell(
    column: IGridColumn,
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
) {
    const tagText = getCellValue<string>(column.fieldName, item)[0];
    const tagcolor = getCellValue<string>(column.tagColor, item)[0];
    const tagBorderColor = getCellValue<string>(column.tagBorderColor, item)[0];
    const tagColorClass = `${ClassNames.textTag} ${mergeStyles({
        background: tagcolor || '#F4F6F7' + CSS_IMPORTANT,
        borderColor: (tagBorderColor || '#CAD0D5') + CSS_IMPORTANT,
    })}`;
    const isBlank = !tagText || tagText === '';
    const cellContents = !isBlank ? (
        <span className={tagColorClass} title={tagText}>
            {tagText}
        </span>
    ) : (
        <></>
    );
    return { isBlank, cellContents };
}

function getIconCell(
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
    column: IGridColumn,
    cellNavigation: () => void,
) {
    let cellContents: JSX.Element;
    let isBlank = true;
    if (item && item.getValue) {
        const imageData = getCellValue<string>(column.fieldName, item)[0];
        isBlank = !imageData || imageData === '';
        if (imageData) {
            const iconColor = getCellValue<string>(column.tagColor, item)[0] as string;
            const ariaText = getCellValue<string>(column.ariaTextColumn, item)[0] as string;
            const actionDisabled = getCellValue<boolean>(column.cellActionDisabledColumn, item)[0] as boolean;

            const buttonContent: JSX.Element | null = getImageTag(imageData, column, iconColor);

            const padding = column.imagePadding || undefined;
            if (column.cellType?.toLowerCase() === CellTypes.ClickableImage) {
                const containerClass = `${ClassNames.imageButton} ${mergeStyles({ padding: padding })}`;
                cellContents = (
                    <DefaultButton
                        onClick={cellNavigation}
                        className={containerClass}
                        data-is-focusable={true}
                        disabled={actionDisabled === true}
                        ariaDescription={ariaText}
                    >
                        {buttonContent}
                    </DefaultButton>
                );
            } else {
                const containerClass = mergeStyles({
                    height: '100%',
                    padding: padding,
                    display: 'flex',
                });
                cellContents = (
                    <div className={containerClass} title={ariaText}>
                        {buttonContent}
                    </div>
                );
            }
        } else {
            cellContents = <DefaultButton onClick={cellNavigation}></DefaultButton>;
        }
    } else {
        cellContents = <></>;
    }
    return { isBlank, cellContents };
}

function getImageTag(imageData: string, column: IGridColumn, iconColor: string) {
    let buttonContent: JSX.Element | null = null;
    const iconName = imageData.substring('icon:'.length);

    if (imageData.startsWith('icon:')) {
        const fontSize = column.imageWidth || 18;
        const iconColorClass = mergeStyles({
            color: iconColor + CSS_IMPORTANT,
            fontSize: fontSize,
        });
        buttonContent = <FontIcon iconName={iconName} className={iconColorClass} aria-hidden="true" />;
    } else if (imageData.startsWith('data:') || imageData.startsWith('https:')) {
        const imageSize = column.imageWidth || 32;
        buttonContent = <Image src={imageData} width={imageSize} />;
    }
    return buttonContent;
}

function getExpandIconCell(
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
    column: IColumn,
    cellNavigation: () => void,
) {
    if (item && item.getValue && column.fieldName) {
        const expanded =
            (item as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord).getValue(column.fieldName) === true;
        const icon = expanded ? 'ChevronUp' : 'ChevronDown';
        return (
            <IconButton
                className={ClassNames.expandIcon}
                ariaLabel={expanded ? 'Collapse' : 'Expand'}
                data-is-focusable={true}
                iconProps={{ iconName: icon }}
                onClick={cellNavigation}
            />
        );
    }
    return <></>;
}

function getLinkCell(
    column: IGridColumn,
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
    cellNavigation: () => void,
) {
    const cellText = getCellValue<string>(column.fieldName, item)[0];

    const isBlank = !cellText || cellText === '';
    const cellContents = !isBlank ? (
        <Link onClick={cellNavigation} underline>
            {cellText}
        </Link>
    ) : (
        <></>
    );
    return { isBlank, cellContents };
}

function getCellValue<T>(
    fieldName?: string,
    item?: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = '';
    if (fieldName && item) {
        if (item.getValue) {
            const itemEntityRecord = item as ComponentFramework.PropertyHelper.DataSetApi.EntityRecord;
            const rawValue = itemEntityRecord.getValue(fieldName);
            if (rawValue !== null) {
                if (Array.isArray(rawValue)) value = rawValue;
                else value = itemEntityRecord.getFormattedValue(fieldName);
            }
        } else {
            value = (item as Record<string, unknown>)[fieldName];
        }
    }
    const isArrayValue = Array.isArray(value);
    let values: T[];
    if (!isArrayValue) {
        values = [value];
    } else {
        values = (value as DatasetArray<T>).map((i) => i.Value);
    }
    return values;
}

function getCellContent(
    item: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord | Record<string, unknown>,
    column: IGridColumn,
    overrideValues?: string[],
) {
    let cellContents: JSX.Element;
    let isBlank = true;
    // Is the contents an array of values - or just a text field?
    // Passing in an array of items is provided to the component as an array of objects
    if (item && column.fieldName) {
        const values: string[] = overrideValues || getCellValue(column.fieldName, item);
        isBlank = values.length === 0 || values.join('') === '';

        // Two types of cell rendering - single value and mutli-value
        if (values.length > 1) {
            const valueDelimeter = column.multiValuesDelimter;
            const delimterElement = valueDelimeter || <br />;
            cellContents = (
                <>
                    {values.map((value, index) => {
                        const valueElement = column.firstMultiValueBold && index === 0 ? <b>{value}</b> : value;
                        return (
                            <span key={index}>
                                {valueElement}
                                {index < values.length - 1 && delimterElement}
                            </span>
                        );
                    })}
                </>
            );
        } else {
            cellContents = <>{values[0]}</>;
        }
    } else {
        cellContents = <></>;
    }
    return { cellContents, isBlank };
}
