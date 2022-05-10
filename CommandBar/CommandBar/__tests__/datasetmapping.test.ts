import { getCommandsWithChildren, getMenuItemsFromDataset } from '../components/DatasetMapping';
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
                [ItemColumns.FarItem]: true,
            }),
            // Sub Items First Level
            new MockEntityRecord('5', {
                [ItemColumns.Key]: 'commandNewFrom',
                [ItemColumns.DisplayName]: 'NewFrom',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.ParentKey]: 'commandNew',
            }),
            new MockEntityRecord('6', {
                [ItemColumns.Key]: 'commandSaveAndClose',
                [ItemColumns.DisplayName]: 'SaveAndClose',
                [ItemColumns.IconName]: 'Save',
                [ItemColumns.IconColor]: 'green',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.FarItem]: true,
                [ItemColumns.ParentKey]: 'commandSave',
            }),
            // Sub Items Second Level
            new MockEntityRecord('7', {
                [ItemColumns.Key]: 'commandNewFromSub1',
                [ItemColumns.DisplayName]: 'NewFromSub1',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.ParentKey]: 'commandNewFrom',
            }),
            new MockEntityRecord('8', {
                [ItemColumns.Key]: 'commandNewFromSub2',
                [ItemColumns.DisplayName]: 'NewFromSub2',
                [ItemColumns.IconName]: 'New',
                [ItemColumns.IconColor]: 'blue',
                [ItemColumns.Enabled]: false,
                [ItemColumns.IconOnly]: true,
                [ItemColumns.ParentKey]: 'commandNewFrom',
            }),
        ];

        const onClickEvent = jest.fn();
        const actions = getMenuItemsFromDataset(new MockDataSet(items));
        const props = getCommandsWithChildren(actions, false, onClickEvent);
        expect(props).toMatchSnapshot();
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

        const onClickEvent = jest.fn();
        const actions = getMenuItemsFromDataset(new MockDataSet(itemsWithDuplicates));
        expect(actions.length).toBe(6);
        expect(actions[0].key).toBe('key1');
        expect(actions[1].key).toBe('key1_2');
        expect(actions[2].key).toBe('key1_3');
        expect(actions[3].key).toBe('2');
        expect(actions[4].key).toBe('2_2');
        expect(actions[5].key).toBe('unique3');

        const props = getCommandsWithChildren(actions, false, onClickEvent);
        expect(props.length).toBe(6);
        expect(props[0].key).toBe('key1');
        expect(props[1].key).toBe('key1_2');
        expect(props[2].key).toBe('key1_3');
        expect(props[3].key).toBe('2');
        expect(props[4].key).toBe('2_2');
        expect(props[5].key).toBe('unique3');
    });

    it('does not cause stack overflow with circular refs', () => {
        const itemsWithDuplicates = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'top',
                [ItemColumns.DisplayName]: 'Top',
                [ItemColumns.DisplayName]: 'top',
            }),
        ];

        const onClickEvent = jest.fn();
        const actions = getMenuItemsFromDataset(new MockDataSet(itemsWithDuplicates));
        getCommandsWithChildren(actions, false, onClickEvent);
    });
});
