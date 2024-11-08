/* eslint-disable sonarjs/no-duplicate-string */
import { makeStyles, shorthands } from "@fluentui/react-components";

export const useOverflowStyles = makeStyles({
  default: {
    ...shorthands.overflow("hidden"),
    zIndex: 0,
  },
  horizontal: {
    height: "fit-content",
    resize: "none",
  },
  vertical: {
    resize: "none",
    display: "flex",
    width: "100%,",
    alignContent: "stretch",
    alignItems: "stretch",
    justifyContent: "stretch",
    justifyItems: "stretch",
  },
  sizingContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflowX: "hidden",
    overflowY: "hidden",
    position: "absolute",
    ...shorthands.padding("2px"),
  },
  content: {
    ...shorthands.padding(0, "0.3em"),
  },
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
  toolbarBtnStyle: {
    minHeight: "32px",
    minWidth: "fit-content",
  },
  toolbarStyle: {
    display: "flex",
    width: "100%,",
    ...shorthands.gap("12px"),
  },
});
