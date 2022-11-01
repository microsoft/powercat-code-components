import { PeoplePicker } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { PersonaColumns, SuggestionColumns } from '../ManifestConstants';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import * as renderer from 'react-test-renderer';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

describe('PeoplePicker', () => {
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
        component.init(context, notifyOutputChanged);
        const peoplePicker = renderer.create(component.updateView(context));
        expect(peoplePicker.toJSON()).toMatchSnapshot();
    });

    it('renders with simple personas', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const personas = [
            new MockEntityRecord('1', {
                [PersonaColumns.PersonaKey]: '1',
                [PersonaColumns.PersonaName]: 'John Doe',
                [PersonaColumns.PersonaRole]: 'John.Doe@Contoso.com',
            }),
            new MockEntityRecord('2', {
                [PersonaColumns.PersonaKey]: '2',
                [PersonaColumns.PersonaName]: 'Megan Bowen',
                [PersonaColumns.PersonaRole]: 'Megan.Bowen@Contoso.com',
            }),
            new MockEntityRecord('3', {
                [PersonaColumns.PersonaKey]: '3',
                [PersonaColumns.PersonaName]: 'Diego S',
                [PersonaColumns.PersonaRole]: 'Diego.S@Contoso.com',
            }),
        ];
        context.parameters.Personas = new MockDataSet(personas);
        const peoplePicker = renderer.create(component.updateView(context));
        expect(peoplePicker.toJSON()).toMatchSnapshot();
    });

    it('renders without duplicate tag key', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const suggestedPersonas = [
            new MockEntityRecord('1', {
                [SuggestionColumns.SuggestionKey]: '2',
                [SuggestionColumns.SuggestionName]: 'John Doe',
                [SuggestionColumns.SuggestionRole]: 'John.Doe@Contoso.com',
            }),
            new MockEntityRecord('2', {
                [SuggestionColumns.SuggestionKey]: '2',
                [SuggestionColumns.SuggestionName]: 'John Doe',
                [SuggestionColumns.SuggestionRole]: 'John.Doe@Contoso.com',
            }),
            new MockEntityRecord('3', {
                [SuggestionColumns.SuggestionKey]: '3',
                [SuggestionColumns.SuggestionName]: 'Diego S',
                [SuggestionColumns.SuggestionRole]: 'Diego.S@Contoso.com',
            }),
        ];
        context.parameters.Suggestions = new MockDataSet(suggestedPersonas);
        renderer.create(component.updateView(context));
        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
    });

    it('renders without duplicate tag key', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const personas = [
            new MockEntityRecord('1', {
                [PersonaColumns.PersonaKey]: '2',
                [PersonaColumns.PersonaName]: 'John Doe',
                [PersonaColumns.PersonaRole]: 'John.Doe@Contoso.com',
            }),
            new MockEntityRecord('2', {
                [PersonaColumns.PersonaKey]: '2',
                [PersonaColumns.PersonaName]: 'John Doe',
                [PersonaColumns.PersonaRole]: 'John.Doe@Contoso.com',
            }),
            new MockEntityRecord('3', {
                [PersonaColumns.PersonaKey]: '3',
                [PersonaColumns.PersonaName]: 'Diego S',
                [PersonaColumns.PersonaRole]: 'Diego.S@Contoso.com',
            }),
        ];
        context.parameters.Personas = new MockDataSet(personas);
        renderer.create(component.updateView(context));
        // We check that there are no 'Warning: Encountered two children with the same key' messages
        expect(console.error).toHaveBeenCalledTimes(0);
    });
});

function createComponent() {
    const component = new PeoplePicker();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.PeoplePickerType.raw = 'Normal People Picker';
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
