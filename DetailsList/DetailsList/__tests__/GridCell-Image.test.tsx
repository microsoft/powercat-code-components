import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { IGridColumn } from '../Component.types';
import { GridCell, GridCellProps } from '../GridCell';
import { CellTypes } from '../ManifestConstants';
import { MockEntityRecord } from '../__mocks__/mock-datasets';

const item = new MockEntityRecord('1', {
    a: 'https://via.placeholder.com/300x200',
    b: 'icon:Save',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

const defaultProps: GridCellProps = {
    item: item,
    index: 1,
    column: {
        key: 'a',
        name: 'a',
        fieldName: 'a',
        minWidth: 200,
        maxWidth: 400,
        calculatedWidth: 200,
        isResizable: true,
        isSorted: false,
        cellType: CellTypes.Image,
    } as IGridColumn,
    onCellAction: () => {
        //noop
    },
};

describe('GridCell', () => {
    it('image cell', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, fieldName: 'a' } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('icon cell', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, fieldName: 'b' } as IGridColumn,
        };

        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('icon cell align center', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, fieldName: 'b', verticalAligned: 'center' } as IGridColumn,
        };

        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
