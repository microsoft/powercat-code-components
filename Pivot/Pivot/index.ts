import * as React from 'react';
import { CanvasPivot } from './components/CanvasPivot';
import { PivotLink, PivotProps } from './components/Component.types';
import { getPivotItemsFromDataset } from './components/DatasetMapping';
import { ContextEx } from './ContextExtended';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { InputEvents, InputProperties, ManifestPropertyNames, RenderSize, RenderTypes } from './ManifestConstants';

export class Pivot implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    notifyOutputChanged: () => void;
    lastSelected?: PivotLink;
    inputEvent?: string | null;
    context: ComponentFramework.Context<IInputs>;
    items: PivotLink[];
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

        const dataset = context.parameters.items;
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;

        if (datasetChanged) {
            this.items = getPivotItemsFromDataset(dataset);
            // The onSelected needs to be updated because the items have changed
            this.onSelectCalled = false;
        }

        // If the selected key has changed, update the Selected property
        this.checkSelectedKeyChanged(context);

        // The test harness provides width/height as strings so use parseInt
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

        // The tabIndex is required since canvas apps sets a non-zero tabindex
        const tabIndex = (context as unknown as ContextEx).accessibility?.assignedTabIndex ?? undefined;
        const renderType = context.parameters.RenderType.raw === RenderTypes.PivotLinks ? 'links' : 'tabs';
        const renderSize = context.parameters.RenderSize.raw === RenderSize.Large ? 'large' : 'normal';

        const props = {
            tabIndex: tabIndex,
            width: allocatedWidth,
            height: allocatedHeight,
            items: this.items,
            onSelected: this.onSelect,
            disabled: context.mode.isControlDisabled,
            selectedKey: context.parameters.SelectedKey.raw ?? '',
            setFocus: this.focusKey,
            themeJSON: context.parameters.Theme.raw,
            linkFormat: renderType,
            linkSize: renderSize,
        } as PivotProps;

        return React.createElement(CanvasPivot, props);
    }

    public getOutputs(): IOutputs {
        return {
            SelectedKey: this.lastSelected?.key ?? null,
        } as IOutputs;
    }

    public destroy(): void {
        // noop
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

    onSelect = (item?: PivotLink, raiseOnChange?: boolean): void => {
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
