// @ts-nocheck
import type {
  IContextualMenuItem,
  IContextualMenuItemProps,
  IContextualMenuProps,
} from '@fluentui/react';
import {
  classNamesFunction,
  ContextualMenuItem,
  DirectionalHint,
  IconButton,
  Link,
} from '@fluentui/react';
import { useSimpleId } from '../hooks/use-id/src/index';
import type { FC } from 'react';
import * as React from 'react';

import { generateWizardClickHandler, shouldWizardBeNarrow } from '../utilities/common';
import type {
  ISetupWizardActionBarV2Props,
  ISetupWizardActionBarV2StyleProps,
  ISetupWizardActionBarV2Styles,
} from './setup-wizard-action-bar-v2.types';
import { generateContextualMenuItemFromLink } from './setup-wizard-action-bar-v2.utils';

const getClassNames = classNamesFunction<
  ISetupWizardActionBarV2StyleProps,
  ISetupWizardActionBarV2Styles
>();

export const SetupWizardActionBarBaseV2: FC<ISetupWizardActionBarV2Props> = (
  props: ISetupWizardActionBarV2Props,
) => {
  const {
    currentStep,
    backLinkProps,
    mainLinkProps,
    exitLinkProps,
    iconButtonProps,
    isLoading,
    styles,
    theme,
    resizeObserverRef,
  } = props;

  const [isNarrow, setIsNarrow] = React.useState(false);
  const classNames = getClassNames(styles, { theme: theme!, isNarrow: isNarrow });
  const rootRef = React.useRef<HTMLDivElement>(null);
  const customMenuId = useSimpleId();

  React.useEffect(() => {
    const rootDiv = rootRef.current;

    if (rootDiv) {
      // if we are passed a constructor for a ponyfill, use that instead
      const ROConstructor = resizeObserverRef ? resizeObserverRef : ResizeObserver;
      // @ts-ignore
      const resizeObserver = new ROConstructor((entries: ReadonlyArray<ResizeObserverEntry>) => {
        const rootDivWidth = entries[0].contentRect.width;

        if (!isNarrow && shouldWizardBeNarrow(rootDivWidth)) {
          setIsNarrow(true);
        } else if (isNarrow && !shouldWizardBeNarrow(rootDivWidth)) {
          setIsNarrow(false);
        }
      });
      resizeObserver.observe(rootDiv);

      return () => {
        resizeObserver.disconnect();
      };
    }

    return;
  });

  // Custom renderer for menu items (these must have a separate custom renderer because it's unlikely
  // that the same component could be rendered properly as both a command bar item and menu item).
  // It's also okay to custom render only the command bar items without changing the menu items.
  const CustomMenuItem: FC<IContextualMenuItemProps> = (contextualMenuItemProps) => {
    // Due to ContextualMenu implementation quirks, passing styles here doesn't work
    return (
      <ContextualMenuItem
        key={customMenuId}
        // @ts-ignore This looks like it could be a valid error because IContextualMenuItemProps has item as required, hence whatever is passed in `contextualMenuItemProps` will always overwrite the `item` prop.
        item={{ text: contextualMenuItemProps.item.children }}
        {...contextualMenuItemProps}
      />
    );
  };

  const menuItems: IContextualMenuItem[] = [];

  if (exitLinkProps) {
    menuItems.push(generateContextualMenuItemFromLink(exitLinkProps, currentStep));
  }

  if (backLinkProps) {
    menuItems.push(generateContextualMenuItemFromLink(backLinkProps, currentStep));
  }

  let additionalMenuProps: IContextualMenuProps | undefined = undefined;

  if (iconButtonProps?.menuProps) {
    additionalMenuProps = iconButtonProps.menuProps;
  }

  const mergedMenuProps: IContextualMenuProps = {
    gapSpace: 0,
    beakWidth: 0,
    shouldFocusOnMount: true,
    directionalHintFixed: true,
    directionalHint: DirectionalHint.topRightEdge,
    contextualMenuItemAs: CustomMenuItem,
    items: menuItems,
    ...additionalMenuProps,
  };

  return (
    <div className={classNames.root} ref={rootRef}>
      {!isNarrow && (
        <div className={classNames.spacer}>
          {backLinkProps && (
            <Link
              disabled={isLoading}
              {...backLinkProps}
              styles={classNames.subComponentStyles.back}
              onClick={generateWizardClickHandler(backLinkProps, currentStep)}
            />
          )}
        </div>
      )}
      <div className={classNames.buttonArea}>
        {mainLinkProps && (
          <Link
            disabled={isLoading}
            {...mainLinkProps}
            styles={classNames.subComponentStyles.main}
            onClick={generateWizardClickHandler(mainLinkProps, currentStep)}
          />
        )}
        {!isNarrow && exitLinkProps && (
          <Link
            disabled={isLoading}
            {...exitLinkProps}
            styles={classNames.subComponentStyles.exit}
            onClick={generateWizardClickHandler(exitLinkProps, currentStep)}
          />
        )}
        {isNarrow && (exitLinkProps || backLinkProps) && (
          <IconButton
            disabled={isLoading}
            menuIconProps={{ iconName: 'More' }}
            styles={classNames.subComponentStyles.iconButton?.()}
            {...iconButtonProps}
            menuProps={mergedMenuProps}
          />
        )}
      </div>
    </div>
  );
};