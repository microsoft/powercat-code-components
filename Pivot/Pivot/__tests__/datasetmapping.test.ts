import { getPivotItemsFromDataset } from '../components/DatasetMapping';
import { ItemColumns } from '../ManifestConstants';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';

describe('DatasetMapping', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns correct props', () => {
        const items = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Item 1',
                [ItemColumns.IconName]: 'Open',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: true,
                [ItemColumns.IconOnly]: false,
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'item2',
                [ItemColumns.DisplayName]: 'Item 2',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
            }),
            new MockEntityRecord('3', {
                [ItemColumns.Key]: 'item3',
                [ItemColumns.DisplayName]: 'Item 3',
                [ItemColumns.IconName]: 'Save',
                [ItemColumns.IconColor]: 'green',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
            }),
            // Sub Items First Level
            new MockEntityRecord('5', {
                [ItemColumns.Key]: 'item5',
                [ItemColumns.DisplayName]: 'Item 5',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.ParentKey]: 'commandNew',
            }),
            new MockEntityRecord('6', {
                [ItemColumns.Key]: 'item6',
                [ItemColumns.DisplayName]: 'Item 6',
                [ItemColumns.IconName]: 'Save',
                [ItemColumns.IconColor]: 'green',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.ParentKey]: 'commandSave',
            }),
            // Sub Items Second Level
            new MockEntityRecord('7', {
                [ItemColumns.Key]: 'item7',
                [ItemColumns.DisplayName]: 'Item 7',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.ParentKey]: 'item1',
            }),
            new MockEntityRecord('8', {
                [ItemColumns.Key]: 'item8',
                [ItemColumns.DisplayName]: 'Item 8',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.ParentKey]: 'item2',
            }),
        ];

        const actions = getPivotItemsFromDataset(new MockDataSet(items));
        expect(actions).toMatchSnapshot();
    });

    it('removes duplicate keys', () => {
        const itemsWithDuplicates = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'key1',
                [ItemColumns.DisplayName]: 'Open',
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'key1',
                [ItemColumns.DisplayName]: 'Open',
            }),
            new MockEntityRecord('3', {
                [ItemColumns.Key]: 'key1',
                [ItemColumns.DisplayName]: 'Open',
            }),
            new MockEntityRecord('4', {
                [ItemColumns.Key]: '2',
                [ItemColumns.DisplayName]: 'Open',
            }),
            new MockEntityRecord('5', {
                [ItemColumns.Key]: '2',
                [ItemColumns.DisplayName]: 'Open',
            }),
            new MockEntityRecord('6', {
                [ItemColumns.Key]: 'unique3',
                [ItemColumns.DisplayName]: 'Open',
            }),
        ];

        const actions = getPivotItemsFromDataset(new MockDataSet(itemsWithDuplicates));
        expect(actions.length).toBe(6);
        expect(actions[0].key).toBe('key1');
        expect(actions[1].key).toBe('key1_2');
        expect(actions[2].key).toBe('key1_3');
        expect(actions[3].key).toBe('2');
        expect(actions[4].key).toBe('2_2');
        expect(actions[5].key).toBe('unique3');
    });
});
