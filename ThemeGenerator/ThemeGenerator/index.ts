import { IInputs, IOutputs } from './generated/ManifestTypes';
import { ThemingDesigner, IThemingDesignerProps } from './components/ThemingDesigner';
import { IColor, getColorFromString } from '@fluentui/react';
import * as React from 'react';

export class ThemeDesigner implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    context: ComponentFramework.Context<IInputs>;
    themeJSON?: string;
    primaryColor: string;
    textColor: string;
    backgroundColor: string;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IThemingDesignerProps = {
            getTheme: this.getTheme,
            setColor: this.setColor,
            ...(getColorFromString(context.parameters.PrimaryColor.raw ?? '') && {
                primaryColor: getColorFromString(context.parameters.PrimaryColor.raw ?? ''),
            }),
            ...(getColorFromString(context.parameters.TextColor.raw ?? '') && {
                textColor: getColorFromString(context.parameters.TextColor.raw ?? ''),
            }),
            ...(getColorFromString(context.parameters.BackgroundColor.raw ?? '') && {
                backgroundColor: getColorFromString(context.parameters.BackgroundColor.raw ?? ''),
            }),
            width: parseInt(context.mode.allocatedWidth as unknown as string),
            height: parseInt(context.mode.allocatedHeight as unknown as string),
        };
        return React.createElement(ThemingDesigner, props);
    }

    public getOutputs(): IOutputs {
        return {
            ThemeJSON: this.themeJSON ?? '',
            PrimaryColor: this.primaryColor ?? null,
            TextColor: this.textColor ?? null,
            BackgroundColor: this.backgroundColor ?? null,
        } as IOutputs;
    }

    getTheme = (ThemeJSON?: string): void => {
        this.themeJSON = ThemeJSON;
        this.notifyOutputChanged();
    };

    setColor = (PrimaryColor?: IColor, TextColor?: IColor, BackgroundColor?: IColor): void => {
        this.primaryColor = PrimaryColor?.str ?? '';
        this.textColor = TextColor?.str ?? '';
        this.backgroundColor = BackgroundColor?.str ?? '';
        this.notifyOutputChanged();
    };

    public destroy(): void {
        // noop
    }
}
