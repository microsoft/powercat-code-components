import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { IGridColumn } from '../Component.types';
import { GridCell, GridCellProps } from '../GridCell';
import { MockEntityRecord } from '../__mocks__/mock-datasets';

const item = new MockEntityRecord('1', {
    a: 'Row1 a',
    b: 'red',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

const itemBlank = new MockEntityRecord('1', {
    a: '',
    b: 'red',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

const multiValueItem = new MockEntityRecord('1', {
    a: [{ Value: 'Row1 a' }, { Value: 'Row1 b' }],
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
    } as IGridColumn,
    onCellAction: () => {
        //noop
    },
};

describe('GridCell', () => {
    it('renders correctly', () => {
        const component = renderer.create(<GridCell {...defaultProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('bold text', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, isBold: true } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('padded', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, paddingTop: 8, paddingLeft: 8 } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('inline label', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, inlineLabel: 'Label' } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('Inline Label Above', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, inlineLabel: 'Label', isLabelAbove: true } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('MultiLines', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            item: multiValueItem,
            column: { ...defaultProps.column, inlineLabel: 'Label' } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('MultiLines Delimetered', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            item: multiValueItem,
            column: { ...defaultProps.column, inlineLabel: 'Label', multiValuesDelimter: ', ' } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('status col', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            column: { ...defaultProps.column, inlineLabel: 'Label', tagColor: 'b' } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('status col child row', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            item: { a: 'Row1 a', b: 'red' } as Record<string, unknown>,
            column: { ...defaultProps.column, inlineLabel: 'Label', tagColor: 'b' } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('status col blank', () => {
        const mockProps: GridCellProps = {
            ...defaultProps,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            item: itemBlank,
            column: { ...defaultProps.column, inlineLabel: 'Label', tagColor: 'b' } as IGridColumn,
        };
        const component = renderer.create(<GridCell {...mockProps} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
