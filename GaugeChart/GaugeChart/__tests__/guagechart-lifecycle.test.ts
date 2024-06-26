import { GaugeChart } from '..';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { MockContext } from '../__mocks__/mock-context';
import { IInputs } from '../generated/ManifestTypes';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { ItemColumns } from '../ManifestConstants';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

describe('Guage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });
    afterEach(() => {
        for (let i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].tagName === 'DIV') {
                document.body.removeChild(document.body.children[i]);
                i--;
            }
        }
        // reset any jest timers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((setTimeout as any).mock) {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        }
    });

    it('renders', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        context.parameters.CustomColors.raw = true;
        component.init(context, notifyOutputChanged);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('renders dummy items when no items configured', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        // Simulate there being no items bound - which causes an error on the parameters
        context.parameters.items.error = true;
        context.parameters.CustomColors.raw = true;
        component.init(context, notifyOutputChanged);
        const element = component.updateView(context);
        expect(element).toBeTruthy();
    });
});

function createComponent() {
    const component = new GaugeChart();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.CustomColors.raw = true;
    context.parameters.items = new MockDataSet([
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'item1',
            [ItemColumns.Legend]: 'Item 1',
            [ItemColumns.Size]: 30,
            [ItemColumns.Color]: 'Blue',
        }),
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'item1',
            [ItemColumns.Legend]: 'Item 1',
            [ItemColumns.Size]: 20,
            [ItemColumns.Color]: 'Red',
        }),
    ]);

    return { component, context, notifyOutputChanged };
}
