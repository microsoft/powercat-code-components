import ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import * as renderer from 'react-test-renderer';
import { Calendar } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { getWeeksFirstDay } from '../components/Utilities';
import { ContextEx } from '../ContextExtended';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

describe('Calendar', () => {
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

    it('check first day of week', () => {
        expect(getWeeksFirstDay('Monday')).toBe(1);
        expect(getWeeksFirstDay('Tuesday')).toBe(2);
        expect(getWeeksFirstDay('Wednesday')).toBe(3);
        expect(getWeeksFirstDay('Thursday')).toBe(4);
        expect(getWeeksFirstDay('Friday')).toBe(5);
        expect(getWeeksFirstDay('Saturday')).toBe(6);
        expect(getWeeksFirstDay('Sunday')).toBe(0);
        expect(getWeeksFirstDay('')).toBe(0);
    });

    it('select yesterdays date check output', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const date = new Date();
        //pick yesterday's date to select
        date.setDate(date.getDate() - 1);
        const ariaLblDate = '[aria-label="'.concat(
            date.toLocaleString('en-GB', { day: 'numeric' }),
            ', ',
            date.toLocaleString('en-GB', { month: 'long' }),
            ', ',
            date.toLocaleString('en-GB', { year: 'numeric' }),
            '"]',
        );
        //pre-select todays date
        const container = document.createElement('div');
        document.body.appendChild(container);
        ReactTestUtils.act(() => {
            ReactDOM.render(component.updateView(context), container);
            // find yesterdays date btn
            const calendarBtn = document.querySelector(ariaLblDate) as HTMLButtonElement;
            expect(calendarBtn).toBeTruthy();
            ReactTestUtils.Simulate.click(calendarBtn);
        });
        const outputs = component.getOutputs();
        expect(notifyOutputChanged).toBeCalledTimes(2);
        expect(outputs.SelectedDateValue?.toDateString()).toEqual(date.toDateString());
        ReactDOM.unmountComponentAtNode(container);
    });
});

function createComponent() {
    const component = new Calendar();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    (context as unknown as ContextEx).accessibility.assignedTabIndex = 5;
    context.parameters.SelectedDateValue.raw = new Date();
    context.parameters.FirstDayOfWeek.raw = 'Monday';
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
