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
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'Item 2',
                [ItemColumns.Label]: 'item2',
                [ItemColumns.State]: 'Not Started',
            }),
            new MockEntityRecord('3', {
                [ItemColumns.Key]: 'Item 3',
                [ItemColumns.Label]: 'item3',
                [ItemColumns.State]: 'Completed',
            }),
            new MockEntityRecord('4', {
                [ItemColumns.Key]: 'Item 4',
                [ItemColumns.Label]: 'item4',
                [ItemColumns.State]: 'ViewedNotCompleted',
            }),
            new MockEntityRecord('5', {
                [ItemColumns.Key]: 'Item 5',
                [ItemColumns.Label]: 'item5',
                [ItemColumns.State]: 'Error',
            }),
            new MockEntityRecord('6', {
                [ItemColumns.Key]: 'Item 6',
                [ItemColumns.Label]: 'item6',
                [ItemColumns.State]: 'Skipped',
            }),
            new MockEntityRecord('7', {
                [ItemColumns.Key]: 'Item 7',
                [ItemColumns.Label]: 'item7',
                [ItemColumns.State]: 'Unsaved',
            }),
        ];

        const actions = getItemsFromDataset(new MockDataSet(items));
        console.log(actions);
        console.log(actions[0].data.values);
        expect(actions).toMatchSnapshot();
    });
});
