/* eslint-disable sonarjs/no-identical-functions */
import { Spinner } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { getMockParameters } from '../__mocks__/mock-parameters';
import * as renderer from 'react-test-renderer';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

describe('Spinner', () => {
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

    it('theme', async () => {
        const { component, context } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#test-primary',
            },
        });

        component.init(context);
        const spinnerComponent = renderer.create(component.updateView(context));
        expect(spinnerComponent.toJSON()).toMatchSnapshot();
    });

    it('test SpinnerSize', async () => {
        const { component, context } = createComponent();
        component.init(context);
        context.parameters.SpinnerSize.raw = '0';
        let spinnerComponent = renderer.create(component.updateView(context));
        expect(spinnerComponent.toJSON()).toMatchSnapshot();
        context.parameters.SpinnerSize.raw = '1';
        spinnerComponent = renderer.create(component.updateView(context));
        expect(spinnerComponent.toJSON()).toMatchSnapshot();
        context.parameters.SpinnerSize.raw = '2';
        spinnerComponent = renderer.create(component.updateView(context));
        expect(spinnerComponent.toJSON()).toMatchSnapshot();
        context.parameters.SpinnerSize.raw = '3';
        spinnerComponent = renderer.create(component.updateView(context));
        expect(spinnerComponent.toJSON()).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new Spinner();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.Label.raw = 'Loading...';
    context.parameters.AccessibilityLabel.raw = 'Spinner';
    context.parameters.SpinnerSize.raw = '2';
    context.parameters.LabelPosition.raw = 'Top';
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
