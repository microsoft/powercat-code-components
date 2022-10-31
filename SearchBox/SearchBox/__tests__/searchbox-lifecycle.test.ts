import { SearchBox } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { getMockParameters } from '../__mocks__/mock-parameters';
import * as renderer from 'react-test-renderer';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

jest.useFakeTimers();

describe('SearchBox', () => {
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => {
        for (let i = 0; i < document.body.children.length; i++) {
            if (document.body.children[i].tagName === 'DIV') {
                document.body.removeChild(document.body.children[i]);
                i--;
            }
        }
    });

    it('renders', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('theme', async () => {
        const { component, context, notifyOutputChanged } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#0078d4',
            },
        });

        component.init(context, notifyOutputChanged);
        const personaComponent = renderer.create(component.updateView(context));
        expect(personaComponent.toJSON()).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new SearchBox();
    const context = new MockContext<IInputs>(getMockParameters());
    const notifyOutputChanged = jest.fn();
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}

/*
// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

describe('ProgressIndicator', () => {
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

    it('test type of Indicator', async() =>{
        const { component, context } = createComponent();
        component.init(context);
        context.parameters.TypeofIndicator.raw = 'Indeterminate Indicator';
        let spinnerComponent = renderer.create(component.updateView(context));
        expect(spinnerComponent.toJSON()).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new ProgressIndicator();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.Label.raw = 'Example Label';
    context.parameters.Description.raw = 'Example Description';
    context.parameters.AccessibilityLabel.raw = 'Progress Indicator';
    context.parameters.BarHeight.raw = 2;
    context.parameters.HideProgressBar.raw = false;
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
*/
