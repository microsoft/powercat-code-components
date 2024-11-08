import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { CardCanvas } from "./components/CardCanvas";
import { CustomCardProps } from "./components/Component.types";
import { ManifestPropertyNames, Orientation, Size, StringConstants } from "./ManifestConstants";
import { getItemsFromDataset } from "./components/Toolbar/datasetmapping";
import { IToolbarItem } from "./components/Toolbar/Component.types";
import { getUrlfromImage } from "./components/helper";
import { ContextEx } from "./components/ContextExtended";

export class Card implements ComponentFramework.ReactControl<IInputs, IOutputs> {
  context: ComponentFramework.Context<IInputs>;
  items: IToolbarItem[];
  componentKey = "powerapps-corecontrol-toolbar";
  height?: number;
  notifyOutputChanged: () => void;
  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.context = context;
    this.onSelect = this.onSelect.bind(this);
    context.mode.trackContainerResize(true);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
    this.context = context;
    const datasetChanged = context.updatedProperties.indexOf(ManifestPropertyNames.dataset) > -1 || !this.items;
    const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
    const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);
    if (datasetChanged) {
      this.items = getItemsFromDataset(context.parameters.Items);
      // When the items or layout change,
      // re-render the toolbar to remeasure, i.e. shrink/grow accordingly
      this.componentKey = this.componentKey.concat("_1");
    }

    const props = {
      key: this.componentKey,
      items: this.items.filter((i) => i.visible).slice(0, 2),
      width: allocatedWidth,
      height: allocatedHeight,
      onSelected: this.onSelect,
      disabled: context.mode.isControlDisabled || (context as unknown as ContextEx).mode.isRead,
      title: context.parameters.Title.raw,
      subTitle: context.parameters.Subtitle.raw,
      headerImage: getUrlfromImage(context.parameters.HeaderImage.raw),
      visible: context.mode.isVisible,
      size: Size[context.parameters.Size.raw],
      onResize: this.onResize,
      ariaLabel: context.parameters.AccessibleLabel?.raw ?? "",
      orientation: Orientation[context.parameters.Alignment.raw],
      placePreview: context.parameters.ImagePlacement?.raw ?? StringConstants.AboveHeader,
      accessibleLabel: context.parameters.AccessibleLabel.raw ?? "",
      image: getUrlfromImage(context.parameters.Image.raw),
      description: context.parameters.Description.raw,
      getPopoverRoot: this.getPopoverRoot,
    } as CustomCardProps;

    return React.createElement(CardCanvas, props);
  }

  private onResize = (height: number): void => {
    this.height = height;
    this.notifyOutputChanged();
  };

  private onSelect = (item?: IToolbarItem): void => {
    if (item && item.data) {
      this.context.parameters.Items.openDatasetItem(item.data.getNamedReference());
    } else if (this.items && this.items.length > 0) {
      this.context.parameters.Items.openDatasetItem(this.items[0].data.getNamedReference());
    } else {
      this.context.events.OnSelect();
    }
    this.notifyOutputChanged();
  };

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
   */
  public getOutputs(): IOutputs {
    return { AutoHeight: this.height || parseInt(this.context.mode.allocatedHeight as unknown as string) };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }

  private getPopoverRoot(): HTMLElement {
    // if we can't find the target layer, we fallback to the fluent provider, then finally <body>
    // note: the ID below should always match the one set in Studio's `ThemeWrapperHelper.tsx`
    const root =
      document.querySelector("#__fluentv9popover__") || document.querySelector(".fui-FluentProvider") || document.body;
    return root as HTMLElement;
  }
}
