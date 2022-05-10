import { KeyboardShortcuts } from "..";
import { IInputs } from "../generated/ManifestTypes";
import { MockContext } from "../__mocks__/mock-context";
import { getMockParameters } from "../__mocks__/mock-parameters";
import { KeyCodes } from "../__mocks__/keycodes";

describe("KeyboardShortcuts lifecycle events", () => {
  beforeEach(() => jest.clearAllMocks());
  it("initialises keyboard shortcuts", () => {
    const { component, context, notifyOutputChanged } = createComponent();

    // Listen for the key alt + a
    context.parameters.KeyConfig.raw = '["alt + a"]';
    component.init(context, notifyOutputChanged);

    simulateKeyPress(KeyCodes.KEY_Z, true);
    expect(notifyOutputChanged).toBeCalledTimes(0);
    expect(component.getOutputs().OnKey).toBe(null);

    simulateKeyPress(KeyCodes.KEY_A, true);
    expect(notifyOutputChanged).toBeCalledTimes(1);
    expect(component.getOutputs().OnKey).toBe("alt + a");

    component.destroy();
  });

  it("changes keyboard shortcuts", () => {
    const { component, context, notifyOutputChanged } = createComponent();

    // Listen for the key alt + a
    context.parameters.KeyConfig.raw = '["alt + a"]';
    component.init(context, notifyOutputChanged);

    simulateKeyPress(KeyCodes.KEY_B, true);
    expect(notifyOutputChanged).toBeCalledTimes(0);
    expect(component.getOutputs().OnKey).toBe(null);

    // Change keybindings
    context.parameters.KeyConfig.raw = '["alt + b"]';
    component.updateView(context);

    simulateKeyPress(KeyCodes.KEY_B, true);
    expect(notifyOutputChanged).toBeCalledTimes(1);
    expect(component.getOutputs().OnKey).toBe("alt + b");

    component.destroy();
  });

  it("handles multiple concurrent components on different screens", () => {
    const {
      component: componentScreen1,
      context: context1,
      notifyOutputChanged: notifyOutputChanged1,
    } = createComponent();
    const {
      component: componentScreen2,
      context: context2,
      notifyOutputChanged: notifyOutputChanged2,
    } = createComponent();

    // Listen for the key a
    context1.parameters.KeyConfig.raw = '["a"]';
    componentScreen1.init(context1, notifyOutputChanged1);

    // Move to Screen 2
    context2.parameters.KeyConfig.raw = '["a"]';
    componentScreen2.init(context1, notifyOutputChanged2);

    // Destroy Screen 1 later on - check that Screen 2 still receives events
    componentScreen1.destroy();

    // Check that keypresses are still detected
    simulateKeyPress(KeyCodes.KEY_A);
    expect(notifyOutputChanged2).toBeCalledTimes(1);
  });
});

function simulateKeyPress(keyCode: number, altKey?: boolean) {
  if (altKey) {
    const altDown = new KeyboardEvent("keydown", { keyCode: KeyCodes.ALT });
    document.dispatchEvent(altDown);
  }

  const eventDown = new KeyboardEvent("keydown", { keyCode: keyCode });
  document.dispatchEvent(eventDown);
  const eventUp = new KeyboardEvent("keyup", { keyCode: keyCode });
  document.dispatchEvent(eventUp);

  if (altKey) {
    const altDown = new KeyboardEvent("keyup", { keyCode: KeyCodes.ALT });
    document.dispatchEvent(altDown);
  }
}

function createComponent() {
  const component = new KeyboardShortcuts();
  const notifyOutputChanged = jest.fn();
  const context = new MockContext<IInputs>(getMockParameters());

  return { component, context, notifyOutputChanged };
}
