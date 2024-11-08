import { GriffelStyle, makeStyles, shorthands, tokens } from "@fluentui/react-components";

const baseButtonStyle: GriffelStyle = {
  alignSelf: "center",
};

export const useOverflowMenuStyles = makeStyles({
  menuPopOver: { maxHeight: "45vh", overflowY: "auto" },
  menu: {
    backgroundColor: tokens.colorNeutralBackground1,
    maxWidth: "300px",
    minWidth: "fit-content",
    ...shorthands.padding("2px"), // to avoid trimming of focus border
  },
  menuButton: baseButtonStyle,
  menuButtonColorOverride: {
    ...baseButtonStyle,
    backgroundColor: "var(--defaultBackgroundColor)",
    ":hover": {
      backgroundColor: "var(--hoverBackgroundColor)",
      color: "var(--hoverForegroundColor)",
    },
    ":hover:active": {
      backgroundColor: "var(--pressedBackgroundColor)",
      color: "var(--pressedForegroundColor)",
    },
  },
  content: {
    ...shorthands.padding(0, "0.3em"),
  },
  /**
   * Define override styles based on theme tokens in use by the button component.
   * See: https://github.com/microsoft/fluentui/blob/ecaa08385bb0e25eafe87e3fb4424cb9139eea2d/packages/react-components/react-button/src/components/Button/useButtonStyles.styles.ts#L225C1-L225C17
   */
  rootOverride: {
    backgroundColor: "var(--defaultBackgroundColor)",
    ":hover": {
      backgroundColor: "var(--hoverBackgroundColor)",
      color: "var(--hoverForegroundColor)",
    },
    ":hover:active": {
      backgroundColor: "var(--pressedBackgroundColor)",
      color: "var(--pressedForegroundColor)",
    },
  },
});
