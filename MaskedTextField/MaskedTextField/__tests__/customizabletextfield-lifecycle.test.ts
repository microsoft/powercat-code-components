import { MaskedTextField } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { getMockParameters } from '../__mocks__/mock-parameters';
import * as renderer from 'react-test-renderer';
import { mount } from 'enzyme';

describe('MaskedTextField', () => {
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

    it('on text enter', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        const valueText = 'Hello';
        component.init(context, notifyOutputChanged);
        const textboxComponent = component.updateView(context);
        const textboxField = mount(textboxComponent);
        const textboxFieldElement = textboxField.find('.ms-TextField-field').first();
        expect(textboxFieldElement.length).toEqual(1);
        textboxFieldElement.simulate('change', { target: { value: valueText } });
        const outputs = component.getOutputs();
        expect(outputs.Value).toEqual(valueText);
    });

    it('theme', async () => {
        const { component, context, notifyOutputChanged } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#0078d4',
            },
        });
        context.parameters.Value.raw = 'Secret';
        component.init(context, notifyOutputChanged);
        const customizableInput = renderer.create(component.updateView(context));
        expect(customizableInput.toJSON()).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new MaskedTextField();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.Prefix.raw = 'pre_';
    context.parameters.Suffix.raw = '.com';
    context.parameters.ErrorMessage.raw = 'an error occured';
    context.parameters.Mask.raw = '************************';
    context.parameters.MaskFormat.raw = '[a-zA-Z0-9]';
    const notifyOutputChanged = jest.fn();
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, notifyOutputChanged, container, state };
}
