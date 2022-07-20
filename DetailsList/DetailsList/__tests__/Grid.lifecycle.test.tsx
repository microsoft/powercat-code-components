import { IInputs } from '../generated/ManifestTypes';

import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockColumn, MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { FluentDetailsList } from '..';
import { ColumnsColumns, RecordsColumns } from '../ManifestConstants';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});
jest.useFakeTimers();

describe('FluentDetailsList', () => {
    beforeEach(() => jest.clearAllMocks());
    it('renders', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new FluentDetailsList();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());

    const records = [
        new MockEntityRecord('1', {
            [RecordsColumns.RecordKey]: '1',
            ['name']: 'Row 1',
        }),
    ];

    context.parameters.records = new MockDataSet(records);
    context.parameters.records.columns = [new MockColumn('name', 'Name')];
    context.parameters.records.getSelectedRecordIds = jest.fn().mockReturnValue([]);
    const columns = [
        new MockEntityRecord('1', {
            [ColumnsColumns.ColName]: 'name',
            [ColumnsColumns.ColDisplayName]: 'Name',
            [ColumnsColumns.ColWidth]: '100',
        }),
    ];

    context.parameters.columns = new MockDataSet(columns);

    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
