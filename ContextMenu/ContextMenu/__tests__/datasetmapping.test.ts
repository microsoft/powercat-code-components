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
});
