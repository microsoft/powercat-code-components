import { Facepile } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { ItemColumns, OutputEvents } from '../ManifestConstants';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { getPersonaPresence, getPersonaSize } from '../components/Helper';
import { PersonaPresence, PersonaSize } from '@fluentui/react';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

jest.useFakeTimers();

describe('FacePile', () => {
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

    it('renders dummy items when no items configured', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        // Simulate there being no items bound - which causes an error on the parameters
        context.parameters.items.error = true;
        component.init(context, notifyOutputChanged);
        const element = component.updateView(context);
        expect(element).toMatchSnapshot();
    });

    it('check getPersonaPresence', () => {
        let presence: string | undefined = 'none';
        let mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.none);
        presence = 'away';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.away);
        presence = 'blocked';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.blocked);
        presence = 'busy';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.busy);
        presence = 'dnd';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.dnd);
        presence = 'offline';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.offline);
        presence = 'online';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.online);
        presence = 'focused';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.none);
        presence = '';
        mockRecord = getMockDataSet(presence);
        expect(getPersonaPresence(mockRecord.records['1'])).toBe(PersonaPresence.none);
    });

    it('check getPersonaSize', () => {
        expect(getPersonaSize('size8')).toBe(PersonaSize.size8);
        expect(getPersonaSize('size24')).toBe(PersonaSize.size24);
        expect(getPersonaSize('size32')).toBe(PersonaSize.size32);
        expect(getPersonaSize('size40')).toBe(PersonaSize.size40);
        expect(getPersonaSize('size48')).toBe(PersonaSize.size48);
        expect(getPersonaSize('size56')).toBe(PersonaSize.size56);
        expect(getPersonaSize('')).toBe(PersonaSize.size32);
    });

    it('check persona onclick event', () => {
        const { component, context, notifyOutputChanged } = createComponent();

        component.init(context, notifyOutputChanged);
        const facepileComponent = component.updateView(context);

        const firstCommandReference = {
            id: { guid: '1' },
            name: '1',
        } as ComponentFramework.EntityReference;

        context.parameters.items.records['1'].getNamedReference = jest.fn().mockReturnValueOnce(firstCommandReference);
        const facepile = mount(facepileComponent);
        const facepileNode = facepile.find('.ms-Facepile-itemButton').first();
        expect(facepileNode.length).toEqual(1);

        facepileNode.simulate('click');
        expect(context.parameters.items.openDatasetItem).toBeCalledTimes(1);
        expect(context.parameters.items.openDatasetItem).toBeCalledWith(firstCommandReference);
        const outputs = component.getOutputs();
        expect(outputs.EventName).toEqual(OutputEvents.PersonaEvent);
    });

    it('check output events', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        context.parameters.ShowAddButton.raw = true;
        context.parameters.MaxDisplayablePersonas.raw = 1;
        const facepileComponent = component.updateView(context);

        const firstCommandReference = {
            id: { guid: '1' },
            name: '1',
        } as ComponentFramework.EntityReference;

        context.parameters.items.records['1'].getNamedReference = jest.fn().mockReturnValueOnce(firstCommandReference);
        const facepile = mount(facepileComponent);
        const addbtnElement = facepile.find('.ms-Facepile-addButton').first();
        expect(addbtnElement.length).toEqual(1);

        addbtnElement.simulate('click');
        let outputs = component.getOutputs();
        expect(outputs.EventName).toEqual(OutputEvents.AddButtonEvent);

        const overflowElement = facepile.find('.ms-Facepile-descriptiveOverflowButton').first();
        expect(overflowElement.length).toEqual(1);
        overflowElement.simulate('click');
        outputs = component.getOutputs();
        expect(outputs.EventName).toEqual(OutputEvents.OverFlowButtonEvent);
    });

    it('check overflowbutton behaviour', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        context.parameters.ShowAddButton.raw = true;
        context.parameters.MaxDisplayablePersonas.raw = 1;
        let facepileComponent = component.updateView(context);
        let facepile = mount(facepileComponent);
        let overflowElement = facepile.find('.ms-Facepile-descriptiveOverflowButton').first();
        expect(overflowElement.length).toEqual(1);

        context.parameters.OverflowButtonType.raw = 'more';
        facepileComponent = component.updateView(context);
        facepile = mount(facepileComponent);
        overflowElement = facepile.find('.ms-Facepile-overflowButton').first();
        expect(overflowElement.length).toEqual(1);

        context.parameters.OverflowButtonType.raw = 'none';
        facepileComponent = component.updateView(context);
        facepile = mount(facepileComponent);
        overflowElement = facepile.find('.ms-Facepile-overflowButton').first();
        expect(overflowElement.length).toEqual(0);
    });

    it('theme', async () => {
        const { component, context, container, notifyOutputChanged } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#0078d4',
            },
        });
        act(() => {
            component.init(context, notifyOutputChanged);
            component.updateView(context);
        });

        expect(container).toMatchSnapshot();
    });
});

function createComponent() {
    const component = new Facepile();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.PersonaSize.raw = 'Size8';
    context.parameters.OverflowButtonType.raw = 'descriptive';
    context.parameters.ImageShouldFadeIn.raw = true;
    context.parameters.items = getMockDataSet('away');
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, container, notifyOutputChanged, state };
}

function getMockDataSet(presence: string) {
    return new MockDataSet([
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'item1',
            [ItemColumns.DisplayName]: 'Diego Siciliani',
            [ItemColumns.ImageUrl]:
                'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-male.png',
            [ItemColumns.Clickable]: true,
            [ItemColumns.Presence]: presence,
            [ItemColumns.IsImage]: false,
        }),
        new MockEntityRecord('2', {
            [ItemColumns.Key]: 'item2',
            [ItemColumns.DisplayName]: 'Megan Bowen',
            [ItemColumns.ImageUrl]:
                'https://static2.sharepointonline.com/files/fabric/office-ui-fabric-react-assets/persona-female.png',
            [ItemColumns.Clickable]: true,
            [ItemColumns.Presence]: presence,
            [ItemColumns.IsImage]: false,
        }),
    ]);
}
