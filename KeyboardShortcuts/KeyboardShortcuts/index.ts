import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as keyboardJS from "keyboardjs";

export class KeyboardShortcuts implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  notifyOutputChanged: () => void;
  context: ComponentFramework.Context<IInputs>;
  currentKeyConfigRaw: string | undefined = undefined;
  currentKeyConfigBindings: string[] | undefined = undefined;
  onKey: string | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void): void {
    this.notifyOutputChanged = notifyOutputChanged;
    this.context = context;

    // Start Keyboard shortcut watching
    keyboardJS.watch();

    // Configure to watch the keys provided in the KeyConfig
    this.bindKeysIfChanged(context);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Configure to watch the keys provided in the KeyConfig
    this.bindKeysIfChanged(context);
  }

  private bindKeysIfChanged(context: ComponentFramework.Context<IInputs>) {
    if (context.parameters.KeyConfig.raw && context.parameters.KeyConfig.raw !== this.currentKeyConfigRaw) {
      try {
        const keyConfig = JSON.parse(context.parameters.KeyConfig.raw) as string[];
        keyboardJS.bind(keyConfig, this.keyboardCallback);
        this.currentKeyConfigBindings = keyConfig;
        this.currentKeyConfigRaw = context.parameters.KeyConfig.raw;
      } catch (ex) {
        // Report error
        /* istanbul ignore next */
        console.error("KeyboardShortcuts Error", ex);
      }
    }
  }

  public getOutputs(): IOutputs {
    return {
      OnKey: this.onKey,
    } as IOutputs;
  }

  public destroy(): void {
    // Remove bindings if there are any
    if (this.currentKeyConfigBindings) {
      keyboardJS.unbind(this.currentKeyConfigBindings, this.keyboardCallback);
    }
  }

  keyboardCallback = (event?: keyboardJS.KeyEvent): void => {
    if (event) {
      this.onKey = event?.pressedKeys.join(" ").replace(" menu ", " + ");
      console.debug("KeyboardShortcuts key press", this.onKey);
      event?.preventDefault();
      event?.stopImmediatePropagation();
      this.notifyOutputChanged();
    }
  };
}
