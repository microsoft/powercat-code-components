import { getTagItemsFromDataset } from '../components/DatasetMapping';
import { ItemColumns } from '../ManifestConstants';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';

describe('DatasetMapping', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns correct props', () => {
        const items = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'commandOpen',
                [ItemColumns.DisplayName]: 'Open',
                [ItemColumns.IconName]: 'Open',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: true,
                [ItemColumns.IconOnly]: false,
            }),
            new MockEntityRecord('2', {
                [ItemColumns.Key]: 'commandNew',
                [ItemColumns.DisplayName]: 'New',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
            }),
            new MockEntityRecord('3', {
                [ItemColumns.Key]: 'commandSave',
                [ItemColumns.DisplayName]: 'Save',
                [ItemColumns.IconName]: 'Save',
                [ItemColumns.IconColor]: 'green',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
            }),
        ];

        const tags = getTagItemsFromDataset(new MockDataSet(items));
        expect(tags).toMatchSnapshot();
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

        const actions = getTagItemsFromDataset(new MockDataSet(itemsWithDuplicates));
        expect(actions.length).toBe(6);
        expect(actions[0].key).toBe('key1');
        expect(actions[1].key).toBe('key1_2');
        expect(actions[2].key).toBe('key1_3');
        expect(actions[3].key).toBe('2');
        expect(actions[4].key).toBe('2_2');
        expect(actions[5].key).toBe('unique3');
    });
});
