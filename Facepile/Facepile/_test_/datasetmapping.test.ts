import { getFacepilePersonas, getitemFromDataset } from '../components/DatasetMapping';
import { ItemColumns } from '../ManifestConstants';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';

describe('DatasetMapping', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns correct props', () => {
        const items = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.DisplayName]: 'Diego Siciliani',
                [ItemColumns.ImageUrl]:
                    'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-male.png',
                [ItemColumns.Clickable]: true,
                [ItemColumns.Presence]: 'away',
            }),
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item2',
                [ItemColumns.DisplayName]: 'Megan Bowen',
                [ItemColumns.ImageUrl]:
                    'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png',
                [ItemColumns.Clickable]: true,
                [ItemColumns.Presence]: 'none',
            }),
        ];

        const onClickEvent = jest.fn();
        const actions = getitemFromDataset(new MockDataSet(items));
        const props = getFacepilePersonas(actions, onClickEvent);
        expect(props).toMatchSnapshot();
    });
});
