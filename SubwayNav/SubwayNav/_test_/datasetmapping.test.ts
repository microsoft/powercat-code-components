import { getItemsFromDataset } from '../components/DatasetMapping';
import { ItemColumns } from '../ManifestConstants';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';

describe('DatasetMapping', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns correct props', () => {
        const items = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'Item 1',
                [ItemColumns.Label]: 'item1',
                [ItemColumns.State]: 'Current',
                [ItemColumns.ItemIcon]: '',
                [ItemColumns.ItemColor]: '',
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'Item 2',
                [ItemColumns.Label]: 'item2',
                [ItemColumns.State]: 'Not Started',
                [ItemColumns.ItemIcon]: '',
                [ItemColumns.ItemColor]: '',
            }),
            new MockEntityRecord('3', {
                [ItemColumns.Key]: 'Item 3',
                [ItemColumns.Label]: 'item3',
                [ItemColumns.State]: 'Completed',
                [ItemColumns.ItemIcon]: '',
                [ItemColumns.ItemColor]: '',
            }),
            new MockEntityRecord('4', {
                [ItemColumns.Key]: 'Item 4',
                [ItemColumns.Label]: 'item4',
                [ItemColumns.State]: 'ViewedNotCompleted',
                [ItemColumns.ItemIcon]: '',
                [ItemColumns.ItemColor]: '',
            }),
            new MockEntityRecord('5', {
                [ItemColumns.Key]: 'Item 4',
                [ItemColumns.Label]: 'item4',
                [ItemColumns.State]: 'Error',
                [ItemColumns.ItemIcon]: '',
                [ItemColumns.ItemColor]: '',
            }),
            new MockEntityRecord('6', {
                [ItemColumns.Key]: 'Item 4',
                [ItemColumns.Label]: 'item4',
                [ItemColumns.State]: 'Skipped',
                [ItemColumns.ItemIcon]: '',
                [ItemColumns.ItemColor]: '',
            }),
            new MockEntityRecord('7', {
                [ItemColumns.Key]: 'Item 4',
                [ItemColumns.Label]: 'item4',
                [ItemColumns.State]: 'Unsaved',
                [ItemColumns.ItemIcon]: '',
                [ItemColumns.ItemColor]: '',
            }),
        ];

        const actions = getItemsFromDataset(new MockDataSet(items));
        expect(actions).toMatchSnapshot();
    });
});
