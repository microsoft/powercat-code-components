import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { ITag } from "@fluentui/react/lib/Pickers";

import {
  IKeywordTaggerComponentProps,
  KeywordTaggerComponent,
} from "./KeywordTaggerComponent";

export class KeywordTagger
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;
  private tags: ITag[] = [];
  private notifyOutputChanged: () => void;
  private root: Root;
  private _value: string | undefined;

  constructor() {}

  init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    this.container = container;
    this.notifyOutputChanged = notifyOutputChanged;
    this.root = createRoot(this.container);
    this.renderControl(context);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.renderControl(context);
  }

  private renderControl(context: ComponentFramework.Context<IInputs>) {
    const props: IKeywordTaggerComponentProps = {
      name: context.parameters.inputField.raw || "",
      inputField: context.parameters.inputField.raw || "",
      updateValue: this.updateValue.bind(this),
    };
    this.root.render(React.createElement(KeywordTaggerComponent, props));
  }

  private updateValue(value: ITag[]) {
    this._value = value.map((tag) => tag.name).join(", ");
    this.notifyOutputChanged();
  }

  public getOutputs(): IOutputs {
    return {
      inputField: this._value,
    };
  }

  public destroy(): void {
    this.root.unmount();
  }
}
