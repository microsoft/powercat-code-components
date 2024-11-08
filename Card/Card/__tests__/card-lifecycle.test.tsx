import { Card } from "..";
import { IInputs } from "../generated/ManifestTypes";
import { MockContext, MockState } from "../__mocks__/mock-context";
import { MockDataSet, MockEntityRecord } from "../__mocks__/mock-datasets";
import { getMockParameters } from "../__mocks__/mock-parameters";
import { mount } from "enzyme";
import { ItemColumns } from "../ManifestConstants";
import { FileObject } from "../components/helper";
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
}));

/*Dummy file values to test with */
const headerImage: FileObject = {
  fileName: "sample-document.pdf",
  fileSize: 1048576,
  mimeType: "application/pdf",
  fileContent: "JVBERi0xLjQKJaqrrK0KNCAwIG9iago8P...",
  fileUrl: "https://example.com/files/sample-document.pdf",
};

const previewImage: FileObject = {
  fileName: "image-file.jpg",
  fileSize: 512000,
  mimeType: "image/jpeg",
  fileContent: "/9j/4AAQSkZJRgABAQEAAAAAAAD/4QAYRXhpZgA...",
  fileUrl: "https://example.com/files/image-file.jpg",
};

describe("Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    for (let i = 0; i < document.body.children.length; i++) {
      if (document.body.children[i].tagName === "DIV") {
        document.body.removeChild(document.body.children[i]);
        i--;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((setTimeout as any).mock) {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    }
  });

  it("renders", () => {
    const { component, context, notifyOutputChanged } = createComponent();
    component.init(context, notifyOutputChanged);
    const cardElement = component.updateView(context);
    expect(cardElement).toMatchSnapshot();
  });

  it("check accessible label", async () => {
    const { component, context, notifyOutputChanged } = createComponent();
    component.init(context, notifyOutputChanged);
    const accessibleLabel = "cardComponent";
    context.parameters.AccessibleLabel.raw = accessibleLabel;
    const cardElement = component.updateView(context);
    const cardComponent = mount(cardElement);

    const card = cardComponent.find('div[role="group"]');
    expect(card.prop("aria-label")).toBe(accessibleLabel);
  });
});

it("checks the whole cardComponent is disabled", () => {
  const { component, context, notifyOutputChanged } = createComponent();
  context.mode.isControlDisabled = true;
  component.init(context, notifyOutputChanged);

  const cardElement = component.updateView(context);
  const cardComponent = mount(cardElement);

  const buttons = cardComponent.find("button");
  buttons.forEach((button) => {
    expect(button.prop("disabled")).toBe(true);
  });
});

function createComponent() {
  const component = new Card();
  const notifyOutputChanged = jest.fn();
  const context = new MockContext<IInputs>(getMockParameters());
  context.parameters.Title.raw = "Title";
  context.parameters.Subtitle.raw = "Subtitle";
  context.parameters.HeaderImage.raw = headerImage;
  context.mode.isVisible = true;
  context.parameters.Alignment.raw = "Vertical";
  context.parameters.ImagePlacement.raw = "Above header";
  context.parameters.Image.raw = previewImage;
  context.parameters.Items = new MockDataSet([
    new MockEntityRecord("1", {
      [ItemColumns.Key]: "toolAdd",
      [ItemColumns.DisplayName]: "Add",
      [ItemColumns.IconName]: "Add",
      [ItemColumns.IconStyle]: "Filled",
      [ItemColumns.Appearance]: "Primary",
      [ItemColumns.Visible]: true,
    }),
    new MockEntityRecord("2", {
      [ItemColumns.Key]: "toolEdit",
      [ItemColumns.DisplayName]: "Edit",
      [ItemColumns.IconName]: "Edit",
      [ItemColumns.IconStyle]: "Regular",
      [ItemColumns.Appearance]: "Subtle",
      [ItemColumns.Visible]: true,
    }),
    new MockEntityRecord("3", {
      [ItemColumns.Key]: "toolDelete",
      [ItemColumns.DisplayName]: "Delete",
      [ItemColumns.IconName]: "Delete",
      [ItemColumns.Disabled]: true,
      [ItemColumns.IconStyle]: "Filled",
      [ItemColumns.Appearance]: "Subtle",
      [ItemColumns.Visible]: true,
    }),
    new MockEntityRecord("4", {
      [ItemColumns.Key]: "toolInfo",
      [ItemColumns.DisplayName]: "Info",
      [ItemColumns.IconName]: "Info",
      [ItemColumns.Disabled]: false,
      [ItemColumns.IconStyle]: "Filled",
      [ItemColumns.Appearance]: "Subtle",
      [ItemColumns.Visible]: false,
    }),
  ]);

  const state = new MockState();
  const container = document.createElement("div");
  document.body.appendChild(container);
  return { component, context, container, notifyOutputChanged, state };
}
