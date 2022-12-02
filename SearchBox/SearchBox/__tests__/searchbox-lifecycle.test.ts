import { SearchBox } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { getMockParameters } from '../__mocks__/mock-parameters';
import * as renderer from 'react-test-renderer';
import { mount } from 'enzyme';

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

    it('on search text enter', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        const searchText = 'Hello';
        component.init(context, notifyOutputChanged);
        const searchBoxElement = component.updateView(context);
        const searchBox = mount(searchBoxElement);
        const searchBoxComponent = searchBox.find('.ms-SearchBox-field').first();
        expect(searchBoxComponent.length).toEqual(1);

        searchBoxComponent.simulate('change', { target: { value: searchText } });
        const outputs = component.getOutputs();
        expect(outputs.SearchText).toEqual(searchText);
    });

    it('theme', async () => {
        const { component, context, notifyOutputChanged } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#0078d4',
            },
        });
        context.parameters.IconName.raw = 'search';
        context.parameters.PlaceHolderText.raw = 'search';
        context.parameters.Underlined.raw = false;
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
