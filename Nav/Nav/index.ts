import * as React from 'react';
import { NavItem, CanvasNavProps } from './components/Component.types';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { InputEvents, InputProperties, ManifestPropertyNames } from './ManifestConstants';
import { ContextEx } from './ContextExtended';
import { getMenuItemsFromDataset, getTreeBasedGrpLinks } from './components/DatasetMapping';
import { CanvasNav } from './components/CanvasNav';

export class Nav implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    lastSelected?: NavItem;
    inputEvent?: string | null;
    context: ComponentFramework.Context<IInputs>;
    items: NavItem[];
    nestedItems: NavItem[];
    focusKey = '';
    onSelectCalled = false;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
        this.context.parameters.items.paging.setPageSize(500);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const inputEvent = this.context.parameters.InputEvent.raw;
        const eventChanged = inputEvent && this.inputEvent !== inputEvent;

        if (eventChanged && inputEvent.startsWith(InputEvents.SetFocus)) {
            // Simulate SetFocus until this is unlocked by the platform
            this.focusKey = inputEvent;
        }
        const ariaLabel = context.parameters?.AccessibilityLabel.raw ?? '';
        const dataset = context.parameters.items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;

        if (datasetChanged) {
            this.items = getMenuItemsFromDataset(dataset);
            this.nestedItems = this.items.length > 0 ? getTreeBasedGrpLinks(this.items) : [];
            // The onSelected needs to be updated because the items have changed
            this.onSelectCalled = false;
        }

        // If the selected key has changed, update the Selected property
        this.checkSelectedKeyChanged(context);

        // The test harness provides width/height as strings
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;

        const props = {
            tabIndex: tabIndex,
            width: allocatedWidth,
            height: allocatedHeight,
            items: this.items,
            ariaLabel: ariaLabel,
            nestedItems: this.nestedItems,
            onSelected: this.onSelect,
            disabled: context.mode.isControlDisabled,
            selectedKey: context.parameters.SelectedKey.raw ?? '',
            setFocus: this.focusKey,
            themeJSON: context.parameters.Theme.raw,
            collapseByDefault: context.parameters?.CollapseByDefault.raw ?? false,
        } as CanvasNavProps;

        return React.createElement(CanvasNav, props);
    }

    public getOutputs(): IOutputs {
        return {
            SelectedKey: this.lastSelected?.key ?? null,
        } as IOutputs;
    }

    public destroy(): void {
        //noop
    }

    private checkSelectedKeyChanged(context: ComponentFramework.Context<IInputs>) {
        // When the bound selected key has changed, and is different from the last selected
        // we raise the OnSelect event to ensure that the Selected property is kept in sync
        const selectedKey = context.parameters.SelectedKey.raw;
        const selectedKeyUpdated = context.updatedProperties.indexOf(InputProperties.SelectedKey) > -1;
        const selectedKeyDifferent = this.lastSelected?.key !== selectedKey;
        const initialOnSelectNeeded = !this.onSelectCalled && selectedKey !== undefined;
        if (initialOnSelectNeeded || (selectedKeyUpdated && selectedKeyDifferent)) {
            const lastSelectedItem = this.items.find((i) => i.key === selectedKey);
            this.onSelect(lastSelectedItem, false);
        }
    }

    onSelect = (item?: NavItem, raiseOnChange?: boolean): void => {
        if (raiseOnChange === undefined || raiseOnChange === true) {
            this.lastSelected = item;
            this.notifyOutputChanged();
        }
        if (item && item.data) {
            this.onSelectCalled = true;
            this.context.parameters.items.openDatasetItem(item.data.getNamedReference());
        }
    };
}
