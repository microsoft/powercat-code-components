<<<<<<< HEAD
import { getItemsFromDataset, getShimmerElements, getShimmerElementType } from '../components/DatasetMapping';
import { ItemColumns } from '../ManifestConstants';
=======
import {
    getRowDetailsFromDataset,
    getItemsFromDataset,
    getShimmerElements,
    getShimmerElementType,
} from '../components/DatasetMapping';
import { ItemColumns, RowColumns } from '../ManifestConstants';
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { ShimmerElementType } from '@fluentui/react';

describe('DatasetMapping', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns correct props', () => {
        const items = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: '1',
                [ItemColumns.Height]: 10,
                [ItemColumns.Width]: '20',
                [ItemColumns.RowKey]: '1',
                [ItemColumns.Type]: 'gap',
            }),
        ];
<<<<<<< HEAD
        expect(getShimmerElementType('Circle')).toEqual(ShimmerElementType.circle);
        const shimmerItems = getShimmerElements(getItemsFromDataset(new MockDataSet(items)));
        expect(shimmerItems).toMatchSnapshot();
=======

        const rowItems = [
            new MockEntityRecord('1', {
                [RowColumns.Key]: '1',
                [RowColumns.Order]: 1,
                [RowColumns.Count]: 5,
                [RowColumns.Width]: 100,
            }),
        ];

        expect(getShimmerElementType('Circle')).toEqual(ShimmerElementType.circle);
        const rowDetails = getRowDetailsFromDataset(new MockDataSet(rowItems));
        expect(rowDetails).toHaveLength(1);
        const shimmerItems = getShimmerElements(getItemsFromDataset(new MockDataSet(items)), rowDetails[0].key);
        expect(shimmerItems).toMatchSnapshot();
        expect(rowDetails).toMatchSnapshot();
>>>>>>> 48d69ffc393a155d03b3e7517eb7dc7512b10fd5
    });
});
