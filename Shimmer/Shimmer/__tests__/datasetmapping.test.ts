import { getItemsFromDataset, getShimmerElements, getShimmerElementType } from '../components/DatasetMapping';
import { ItemColumns } from '../ManifestConstants';
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
        expect(getShimmerElementType('Circle')).toEqual(ShimmerElementType.circle);
        const shimmerItems = getShimmerElements(getItemsFromDataset(new MockDataSet(items)));
        expect(shimmerItems).toMatchSnapshot();
    });
});
