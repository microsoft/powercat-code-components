import { ResizableTextarea } from "..";
import { IInputs } from "../generated/ManifestTypes";
import { MockContext, MockState } from "../__mocks__/mock-context";
import { getMockParameters } from "../__mocks__/mock-parameters";
import { ResizeObserverMock } from "../__mocks__/resize-observer-polyfill";

beforeEach(() => jest.clearAllMocks());

describe("ResizeableTextArea lifecycle events", () => {
  it("should update output size parameters when textarea is resized", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.mode.allocatedWidth = 40;
    context.mode.allocatedHeight = 50;
    component.init(context, notifyOutputChanged, state, container);
    component.updateView(context);

    const textArea = container.getElementsByTagName("textarea")[0];
    expect(textArea.style.width).toBe("40px");
    expect(textArea.style.height).toBe("50px");

    textArea.style.width = "300px";
    textArea.style.height = "200px";

    // Raise Resize Event
    ResizeObserverMock.onResize();

    // Ensure that the new dimentions are provided back to the host
    expect(notifyOutputChanged).toHaveBeenCalledTimes(1);

    const outputs = component.getOutputs();
    expect(outputs.ResizedWidth).toEqual(300);
    expect(outputs.ResizedHeight).toEqual(200);
    // The Text should not be updated - only the size
    expect(outputs).not.toHaveProperty("Text");

    // Update the component since getOutputs has been called
    component.updateView(context);

    // The size should be the same
    expect(textArea.style.width).toEqual("300px");
    expect(textArea.style.height).toEqual("200px");
  });

  it("resets width & height when ResetSize is set", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    context.mode.allocatedWidth = 40;
    context.mode.allocatedHeight = 50;
    component.init(context, notifyOutputChanged, state, container);
    component.updateView(context);

    const textArea = container.getElementsByTagName("textarea")[0];
    textArea.style.width = "300px";
    textArea.style.height = "200px";

    // Raise Resize Event
    ResizeObserverMock.onResize();

    const outputs = component.getOutputs();
    expect(outputs.ResizedWidth).toEqual(300);
    expect(outputs.ResizedHeight).toEqual(200);

    // Set ResetSize
    context.parameters.InputEvent.raw = "ResetSize_123";

    // Update the component since getOutputs has been called
    component.updateView(context);

    // The size should be reset
    expect(textArea.style.width).toEqual("40px");
    expect(textArea.style.height).toEqual("50px");

    // Resize again
    textArea.style.width = "350px";
    textArea.style.height = "250px";

    // Raise Resize Event
    ResizeObserverMock.onResize();
    const outputs2 = component.getOutputs();
    expect(outputs2.ResizedWidth).toEqual(350);
    expect(outputs2.ResizedHeight).toEqual(250);
    // Update the component since getOutputs has been called
    component.updateView(context);

    // Check the size is still the resized size and it's not been reset again even though the InputEvent is still ResizeSize
    expect(textArea.style.width).toEqual("350px");
    expect(textArea.style.height).toEqual("250px");
  });

  function createComponent() {
    const component = new ResizableTextarea();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    const state = new MockState();
    const container = document.createElement("div");
    document.body.appendChild(container);

    return { component, context, notifyOutputChanged, state, container };
  }
});
