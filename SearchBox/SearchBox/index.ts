import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { SearchBoxComponent } from "./components/SearchBox";
import { ISearchBoxComponentProps } from "./components/SearchBox.types";
import { prependOnceListener } from "process";

export class SearchBox implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private searchTextValue: string | null;

    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        const allocatedWidth = parseInt(context.mode.allocatedWidth as unknown as string);
        const allocatedHeight = parseInt(context.mode.allocatedHeight as unknown as string);

        const props: ISearchBoxComponentProps = {
            onChanged: this.onChange,
            themeJSON: context.parameters.Theme.raw ?? '',
            ariaLabel: context.parameters?.AccessibilityLabel.raw ?? '',
            width: allocatedWidth,
            height: allocatedHeight,
        };

        return React.createElement(SearchBoxComponent, props);
    }

    private onChange = (newValue: string | undefined): void => {
        this.searchTextValue = newValue ?? null;
        this.notifyOutputChanged();
    }

    public getOutputs(): IOutputs {
        return { SearchText: this.searchTextValue } as IOutputs;
    }

    public destroy(): void {}
}
