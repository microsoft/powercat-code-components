import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import { MessageBarComponent } from './components/Messagebar';
import { IMessagebar, Shape } from './components/IMessagebar';
import { IToolbarItem } from './components/Toolbar/Component.types';
import { ManifestPropertyNames } from './ManifestConstant';
import { getItemsFromDataset } from './components/Toolbar/datasetmapping';
import { ContextEx } from './components/ContextEx';

export class FluentMessageBar implements ComponentFramework.ReactControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>;
    private notifyOutputChanged: () => void;
    private parentContainer: HTMLDivElement;
    items: IToolbarItem[];
    componentKey = 'powerapps-corecontrol-toolbar';
    private _height?: number;


    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.parentContainer = container;
        this.onSelect = this.onSelect.bind(this);
        this._context.mode.trackContainerResize(true);
        //this.isVisible = true;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;
        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
        if (datasetChanged) {
            this.items = getItemsFromDataset(context.parameters.Items);
            // When the items or layout change,
            // re-render the toolbar to remeasure, i.e. shrink/grow accordingly
            this.componentKey = this.componentKey.concat('_1');
        }

        const shape: Shape = Shape[this._context.parameters.Shape.raw];
        // Add code to update control view
        const props: IMessagebar = {
            Url: `${context.parameters.URL.raw}`,
            linkText: `${context.parameters.LinkText.raw}`,
            messageBarIntent: `${context.parameters.Intent.raw}`,
            title: this.defaultIfEmpty(this._context.parameters.Title, ''),
            body: this.defaultIfEmpty(this._context.parameters.Body, ''),
            messageBarShape: shape,
            OnDismiss: this.OnDismiss,
            hideDismiss:context.parameters.HideDismiss.raw,
            // toolbar
            items: this.items.filter((i) => i.visible).slice(0, 2),
            onSelected: this.onSelect,
            disabled: context.mode.isControlDisabled || (context as unknown as ContextEx).mode.isRead,
            getPopoverRoot: this.getPopoverRoot,
            width: allocatedWidth,
            height: allocatedHeight,
            onResize: this.onResize

        };
        return React.createElement(MessageBarComponent, props);

    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return { AutoHeight: this._height};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    OnDismiss = (): void => {
        this._context.events.OnDismiss();
    };


    defaultIfEmpty<T>(property: ComponentFramework.PropertyTypes.Property, defaultValue: T) {
        return (property.raw as T) ? property.raw : defaultValue;
    }

    // Toolbar changes
    private getPopoverRoot(): HTMLElement {
        // if we can't find the target layer, we fallback to the fluent provider, then finally <body>
        // note: the ID below should always match the one set in Studio's `ThemeWrapperHelper.tsx`
        const root =
            document.querySelector('#__fluentv9popover__') || document.querySelector('.fui-FluentProvider') || document.body;
        return root as HTMLElement;
    }

    private onSelect = (item?: IToolbarItem): void => {
        if (item && item.data) {
            this._context.parameters.Items.openDatasetItem(item.data.getNamedReference());
        } else if (this.items && this.items.length > 0) {
            this._context.parameters.Items.openDatasetItem(this.items[0].data.getNamedReference());
        } else {
            this._context.events.OnSelect();
        }
        this.notifyOutputChanged();
    };

    private onResize = (width:number,height: number): void => {
        this._height = height;
        this.notifyOutputChanged();
    };
}
