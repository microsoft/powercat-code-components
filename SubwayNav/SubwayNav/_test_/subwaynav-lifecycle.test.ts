import { SubwayNav } from '..';
import { IInputs } from '../generated/ManifestTypes';
import { ItemColumns } from '../ManifestConstants';
import { MockContext, MockState } from '../__mocks__/mock-context';
import { MockDataSet, MockEntityRecord } from '../__mocks__/mock-datasets';
import { getMockParameters } from '../__mocks__/mock-parameters';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import { SubwayNav as CustomSubwayNav } from '../utilities/subway-nav/subway-nav';

// Since requestAnimationFrame does not exist in the test DOM, mock it
window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
    callback();
});

jest.useFakeTimers();

describe('SubwayNav', () => {
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

    it('Count steps', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const subwayNavElement = component.updateView(context);
        const subwayNav = shallow(subwayNavElement);
        const subwayNavSteps = subwayNav.find(CustomSubwayNav).props().steps;
        expect(subwayNavSteps.length).toEqual(7);
    });

    it('Analyse theme', () => {
        const { component, context, notifyOutputChanged } = createComponent();
        component.init(context, notifyOutputChanged);
        const subwayNavElement = component.updateView(context);
        const subwayNav = shallow(subwayNavElement);
        const themePrimaryColor = subwayNav.props().theme.palette.themePrimary;
        expect(themePrimaryColor).toEqual('#005ba1');
    });

    it('theme', async () => {
        const { component, context, container, notifyOutputChanged } = createComponent();
        context.parameters.Theme.raw = JSON.stringify({
            palette: {
                themePrimary: '#005ba1',
                themeLighterAlt: '#f1f7fb',
                themeLighter: '#cadff0',
                themeLight: '#9fc5e3',
                themeTertiary: '#4f93c6',
                themeSecondary: '#156aac',
                themeDarkAlt: '#005291',
                themeDark: '#00457a',
                themeDarker: '#00335a',
                neutralLighterAlt: '#faf9f8',
                neutralLighter: '#f3f2f1',
                neutralLight: '#edebe9',
                neutralQuaternaryAlt: '#e1dfdd',
                neutralQuaternary: '#d0d0d0',
                neutralTertiaryAlt: '#c8c6c4',
                neutralTertiary: '#a19f9d',
                neutralSecondary: '#605e5c',
                neutralPrimaryAlt: '#3b3a39',
                neutralPrimary: '#323130',
                neutralDark: '#201f1e',
                black: '#000000',
                white: '#ffffff',
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
    const component = new SubwayNav();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    context.parameters.ShowAnimation.raw = true;
    context.parameters.items = new MockDataSet([
        new MockEntityRecord('1', {
            [ItemColumns.Key]: 'Item 1',
            [ItemColumns.Label]: 'item1',
            [ItemColumns.State]: 'Current',
        }),
        new MockEntityRecord('2', {
            [ItemColumns.Key]: 'Item 2',
            [ItemColumns.Label]: 'item2',
            [ItemColumns.State]: 'Not Started',
        }),
        new MockEntityRecord('3', {
            [ItemColumns.Key]: 'Item 3',
            [ItemColumns.Label]: 'item3',
            [ItemColumns.State]: 'Completed',
        }),
        new MockEntityRecord('4', {
            [ItemColumns.Key]: 'Item 4',
            [ItemColumns.Label]: 'item4',
            [ItemColumns.State]: 'ViewedNotCompleted',
        }),
        new MockEntityRecord('5', {
            [ItemColumns.Key]: 'Item 4',
            [ItemColumns.Label]: 'item4',
            [ItemColumns.State]: 'Error',
        }),
        new MockEntityRecord('6', {
            [ItemColumns.Key]: 'Item 4',
            [ItemColumns.Label]: 'item4',
            [ItemColumns.State]: 'Skipped',
        }),
        new MockEntityRecord('7', {
            [ItemColumns.Key]: 'Item 4',
            [ItemColumns.Label]: 'item4',
            [ItemColumns.State]: 'Unsaved',
        }),
        new MockEntityRecord('8', {
            [ItemColumns.Key]: 'Item 8',
            [ItemColumns.Label]: 'item8',
            [ItemColumns.State]: 'Custom',
        }),
    ]);
    context.parameters.Theme.raw = JSON.stringify({
        palette: {
            themePrimary: '#005ba1',
            themeLighterAlt: '#f1f7fb',
            themeLighter: '#cadff0',
            themeLight: '#9fc5e3',
            themeTertiary: '#4f93c6',
            themeSecondary: '#156aac',
            themeDarkAlt: '#005291',
            themeDark: '#00457a',
            themeDarker: '#00335a',
            neutralLighterAlt: '#faf9f8',
            neutralLighter: '#f3f2f1',
            neutralLight: '#edebe9',
            neutralQuaternaryAlt: '#e1dfdd',
            neutralQuaternary: '#d0d0d0',
            neutralTertiaryAlt: '#c8c6c4',
            neutralTertiary: '#a19f9d',
            neutralSecondary: '#605e5c',
            neutralPrimaryAlt: '#3b3a39',
            neutralPrimary: '#323130',
            neutralDark: '#201f1e',
            black: '#000000',
            white: '#ffffff',
        },
    });
    const state = new MockState();
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { component, context, container, notifyOutputChanged, state };
}
