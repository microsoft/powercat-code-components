import { Persona } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { getMockParameters } from '../__mocks__/mock-parameters';
import * as renderer from 'react-test-renderer';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

jest.useFakeTimers();

describe('Persona', () => {
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
        const { component, context } = createComponent();
        component.init(context);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('theme', async () => {
        const { component, context } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#0078d4',
            },
        });

        component.init(context);
        const personaComponent = renderer.create(component.updateView(context));
        expect(personaComponent.toJSON()).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new Persona();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.PersonaSize.raw = '18';
    context.parameters.ImageUrl.raw =
        'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png';
    context.parameters.Text.raw = 'Annie Lindqvist';
    context.parameters.ImageInitials.raw = 'AL';
    context.parameters.SecondaryText.raw = 'Software Engineer';
    context.parameters.TertiaryText.raw = 'In a meeting';
    context.parameters.OptionalText.raw = 'Available at 4:00pm';
    context.parameters.ImageAlt.raw = 'Annie Lindqvist, status is blocked';
    context.parameters.Presence.raw = '3';
    context.parameters.PersonaInitialsColor.raw = 'blue';
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, container, state };
}
