import { ResizableTextarea } from "..";
import { IInputs } from "../generated/ManifestTypes";
import { MockContext, MockState } from "../__mocks__/mock-context";
import { getMockParameters } from "../__mocks__/mock-parameters";

describe("ResizeableTextArea element state events", () => {
  beforeEach(() => jest.clearAllMocks());

  it("updates states on hover and focus", () => {
    const { component, context, notifyOutputChanged, state, container } = createComponent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (context as any).accessibility.assignedTabIndex = 10;
    getClassicStyles(context);

    component.init(context, notifyOutputChanged, state, container);
    expect(container).toMatchSnapshot();

    // Set mouse over
    const textarea = container.getElementsByTagName("textarea")[0];
    textarea.dispatchEvent(new MouseEvent("mouseenter"));
    expect(container).toMatchSnapshot("hover");

    // Set mouse out
    textarea.dispatchEvent(new MouseEvent("mouseleave"));
    expect(container).toMatchSnapshot("hover:leave");

    // Set focus
    textarea.dispatchEvent(new MouseEvent("focus"));
    expect(container).toMatchSnapshot("focus");

    // Set lose focus
    textarea.dispatchEvent(new MouseEvent("blur"));
    expect(container).toMatchSnapshot("blur");
  });

  it("sets disabled styles", () => {
    const { context, container, component, notifyOutputChanged, state } = createComponent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context.mode.isControlDisabled = true;
    getClassicStyles(context);
    // The DisabledHoverFillColor is used for MDA apps when the form is read-only and mouse over the control
    // should show a grey box to indicat it is disabled
    context.parameters.DisabledHoverFillColor.raw = "silver";
    component.init(context, notifyOutputChanged, state, container);
    expect(container).toMatchSnapshot("disabled");

    // Set mouse over
    const textarea = container.getElementsByTagName("textarea")[0];
    textarea.dispatchEvent(new MouseEvent("mouseenter"));
    expect(container).toMatchSnapshot("hover");

    // Set mouse out
    textarea.dispatchEvent(new MouseEvent("mouseleave"));
    expect(container).toMatchSnapshot("hover:leave");
  });

  it("sets read-only styles due to security", () => {
    const { context, container, component, notifyOutputChanged, state } = createComponent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context.parameters.Text.security = {
      editable: false,
      readable: true,
      secured: true,
    };
    getClassicStyles(context);
    component.init(context, notifyOutputChanged, state, container);
    expect(container).toMatchSnapshot("disabled");
  });

  it("sets read-only and masked styles due to security", () => {
    const { context, container, component, notifyOutputChanged, state } = createComponent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context.parameters.Text.security = {
      editable: false,
      readable: false,
      secured: true,
    };
    getClassicStyles(context);
    component.init(context, notifyOutputChanged, state, container);
    expect(container).toMatchSnapshot("disabled");
  });
});

function getClassicStyles(context: MockContext<IInputs>) {
  const { parameters } = context;
  parameters.MaxLength.raw = 100;
  parameters.HintText.raw = "Enter text here...";
  parameters.PaddingLeft.raw = 12;
  parameters.PaddingRight.raw = 5;
  parameters.PaddingTop.raw = 5;
  parameters.PaddingBottom.raw = 5;
  parameters.EnableSpellCheck.raw = "1";
  parameters.FontSize.raw = 17.5;
  parameters.FontColor.raw = "rgb(0,0,0)";
  parameters.FontWeight.raw = "400";
  parameters.DisabledFontColor.raw = "rgb(166,166,166)";
  parameters.FillColor.raw = "#ffffff";
  parameters.DisabledFillColor.raw = "rgb(244,244,244)";
  parameters.HoverFillColor.raw = "#BACAE2";
  parameters.BorderColor.raw = "#00126B";
  parameters.BorderThickness.raw = 2;
  parameters.BorderRadius.raw = 5;
  parameters.DisabledBorderColor.raw = "rgb(166,166,166)";
  parameters.FocusBorderThickness.raw = 4;
  parameters.RenderBorderStyle.raw = "1"; // Centered
  parameters.AccessibilityLabel.raw = "A textarea";
}

function createComponent() {
  const component = new ResizableTextarea();
  const notifyOutputChanged = jest.fn();
  const context = new MockContext<IInputs>(getMockParameters());
  const state = new MockState();
  const container = document.createElement("div");
  document.body.appendChild(container);
  return { component, context, notifyOutputChanged, state, container };
}
