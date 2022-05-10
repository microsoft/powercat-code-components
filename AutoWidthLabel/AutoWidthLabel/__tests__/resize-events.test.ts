import { AutoWidthLabel } from "..";
import { IInputs } from "../generated/ManifestTypes";
import { MockContext, MockState } from "../__mocks__/mock-context";
import { getMockParameters } from "../__mocks__/mock-parameters";
import { ResizeObserverMock } from "../__mocks__/resize-observer-polyfill";

beforeEach(() => jest.clearAllMocks());

describe("ResizeableTextArea lifecycle events", () => {
  it("should update output size parameters when textarea is resized", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    component.init(context, notifyOutputChanged, state, container);

    // Raise Resize Event
    const elements: Partial<ResizeObserverEntry>[] = [
      {
        contentBoxSize: [
          {
            blockSize: 100,
            inlineSize: 200,
          } as ResizeObserverSize,
        ],
      } as Partial<ResizeObserverEntry>,
    ];
    ResizeObserverMock.onResize(elements);

    // Ensure that the new dimentions are provided back to the host
    expect(notifyOutputChanged).toHaveBeenCalledTimes(1);

    const outputs = component.getOutputs();
    expect(outputs.AutoWidth).toEqual(200);
  });

  it("ResizeObserver when contentBoxSize not supported", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    component.init(context, notifyOutputChanged, state, container);

    // Raise Resize Event
    const elements: Partial<ResizeObserverEntry>[] = [
      {
        contentRect: { width: 200 },
      } as Partial<ResizeObserverEntry>,
    ];
    ResizeObserverMock.onResize(elements);

    // Ensure that the new dimentions are provided back to the host
    expect(notifyOutputChanged).toHaveBeenCalledTimes(1);

    const outputs = component.getOutputs();
    expect(outputs.AutoWidth).toEqual(200);
  });

  function createComponent() {
    const component = new AutoWidthLabel();
    const notifyOutputChanged = jest.fn();
    const context = new MockContext<IInputs>(getMockParameters());
    const state = new MockState();
    const container = document.createElement("div");
    document.body.appendChild(container);

    return { component, context, notifyOutputChanged, state, container };
  }
});
