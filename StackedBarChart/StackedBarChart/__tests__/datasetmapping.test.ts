import { ItemColumns } from '../ManifestConstants';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getChartDataFromDataset } from '../components/DatasetMapping';

describe('DatasetMapping', () => {
    beforeEach(() => jest.clearAllMocks());
    const stackBarLabel = 'Stack Bar Chart';
    it('returns correct props when custom color is false', () => {
        const items = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.Title]: 'Item 1',
                [ItemColumns.Value]: 30,
                [ItemColumns.Color]: 'blue',
            }),
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.Title]: 'Item 1',
                [ItemColumns.Value]: 20,
                [ItemColumns.Color]: 'blue',
            }),
        ];
        const actions = getChartDataFromDataset(new MockDataSet(items), stackBarLabel,  stackBarLabel, false);
        expect(actions).toMatchSnapshot();
    });

    it('returns correct props when custom color is true ', () => {
        const items = [
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.Title]: 'Item 1',
                [ItemColumns.Value]: 30,
                [ItemColumns.Color]: 'blue',
            }),
            new MockEntityRecord('1', {
                [ItemColumns.Key]: 'item1',
                [ItemColumns.Title]: 'Item 1',
                [ItemColumns.Value]: 20,
                [ItemColumns.Color]: 'blue',
            }),
        ];
        const actions = getChartDataFromDataset(new MockDataSet(items), stackBarLabel,  stackBarLabel, false);
        expect(actions).toMatchSnapshot();
    });
});
