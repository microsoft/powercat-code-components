import * as React from "react";
import {
  Card,
  CardHeader,
  CardPreview,
  makeStyles,
  Body1,
  CardFooter,
  tokens,
  Caption1,
  shorthands,
} from "@fluentui/react-components";
import { CustomCardProps } from "./Component.types";
import { ToolbarComponent } from "./Toolbar/ToolbarComponent";
import useResizeObserver from "@react-hook/resize-observer";
import { sizeLength } from "./helper";
import { StringConstants } from "../ManifestConstants";

const useStyles = makeStyles({
  horizontalCardImage: {
    borderRadius: "4px",
    width: "64px",
    height: "64px",
  },
  headerImage: {
    borderRadius: "4px",
    maxWidth: "44px",
    maxHeight: "44px",
  },
  header: {
    width: "100%",
    overflow: "hidden",
  },
  headerTitle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    ...shorthands.margin(0),
  },
  headerDescription: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
    color: tokens.colorNeutralForeground3,
    ...shorthands.margin(0),
  },
  text: { ...shorthands.margin(0) },
});

export const CardCanvas: React.FC<CustomCardProps> = React.memo((props: CustomCardProps) => {
  const {
    accessibleLabel,
    title,
    subTitle,
    getPopoverRoot,
    items,
    image,
    placePreview,
    onSelected,
    description,
    orientation,
    headerImage,
    disabled,
    size,
    onResize,
    width,
    ...rest
  } = props;
  const styles = useStyles();
  const target = React.useRef<HTMLDivElement>(null);

  useResizeObserver(target, (entry) => {
    if (onResize) {
      // Added size padding along with the actual card height
      onResize(entry.contentRect.height + sizeLength(size));
    }
  });

  return (
    <Card
      size={size}
      ref={target}
      orientation={orientation}
      aria-label={accessibleLabel}
      style={{ width: width, height: "fit-content" }}
      {...(items.length <= 1 && !disabled ? { onClick: () => onSelected() } : {})}
      {...rest}
    >
      {placePreview === StringConstants.AboveHeader && image.length > 0 && (
        <CardPreview>
          <img alt="Preview" src={image} />
        </CardPreview>
      )}
      <CardHeader
        className={styles.header}
        style={{ overflow: "hidden" }}
        {...(title && {
          header: (
            <Body1>
              <b className={styles.headerTitle}>{title}</b>
            </Body1>
          ),
        })}
        {...(headerImage
          ? {
              image: (
                <img
                  className={orientation === "horizontal" ? styles.horizontalCardImage : styles.headerImage}
                  alt="Header logo"
                  src={headerImage}
                  style={{ borderRadius: "4px" }}
                />
              ),
            }
          : {})}
        {...(subTitle
          ? {
              description: <Caption1 className={styles.headerDescription}>{subTitle}</Caption1>,
            }
          : {})}
      />
      {placePreview === StringConstants.BelowHeader && image.length > 0 && (
        <CardPreview>
          <img alt="Preview" src={image} />
        </CardPreview>
      )}
      {description && orientation === "vertical" && (
        <p className={styles.text}> {description.length > 700 ? `${description.slice(0, 700)}...` : description}</p>
      )}
      {items.length > 0 && (
        <CardFooter>
          <ToolbarComponent
            layout={"before"}
            disabled={disabled}
            items={items}
            width={width}
            onSelected={onSelected}
            getPopoverRoot={getPopoverRoot}
          />
        </CardFooter>
      )}
    </Card>
  );
});
CardCanvas.displayName = "CardCanvas";
