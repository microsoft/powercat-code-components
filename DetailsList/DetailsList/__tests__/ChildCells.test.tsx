import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { IGridColumn } from '../Component.types';
import { GridCell, GridCellProps } from '../GridCell';
import { MockEntityRecord } from '../__mocks__/mock-datasets';

const item = new MockEntityRecord('1', {
    col1: 'Row 1 Col 1',
    col2: 'Row 1 Col 2',
    col3: 'Row 1 Col 3',
    col4: 'Row 1 Col 4',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

const defaultProps: GridCellProps = {
    item: item,
    index: 1,
    column: {
        key: 'col1',
        fieldName: 'col1',
        name: 'Column 1',
        minWidth: 200,
        maxWidth: 400,
        calculatedWidth: 200,
        childColumns: [
            {
                key: 'col2',
                fieldName: 'col2',
                name: 'Column 2',
                showAsSubTextOf: 'col1',
                subTextRow: 0,
            } as IGridColumn,
        ],
    } as IGridColumn,

    onCellAction: () => {
        //noop
    },
};

describe('GridCell', () => {
    it('renders child cells in root cell content', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item: item,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders child cells in root cell content followed by additional child cells', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item: item,
            column: {
                ...defaultProps.column,
                childColumns: [
                    // Sub Row 0
                    {
                        key: 'col2',
                        fieldName: 'col2',
                        name: 'Column 2',
                        showAsSubTextOf: 'col1',
                        subTextRow: 0,
                    } as IGridColumn,
                    // Sub Row 1
                    {
                        key: 'col3',
                        fieldName: 'col3',
                        name: 'Column 3',
                        showAsSubTextOf: 'col1',
                        subTextRow: 1,
                    } as IGridColumn,
                    {
                        key: 'col4',
                        fieldName: 'col4',
                        name: 'Column 4',
                        showAsSubTextOf: 'col1',
                        subTextRow: 1,
                    } as IGridColumn,
                ],
            } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
