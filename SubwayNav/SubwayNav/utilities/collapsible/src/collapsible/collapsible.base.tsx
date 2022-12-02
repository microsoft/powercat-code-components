import type { IRenderFunction } from '@fluentui/react';
import {
  buttonProperties,
  classNamesFunction,
  getNativeProps,
  Icon,
} from '@fluentui/react';
import { useSimpleId } from '../../../hooks/use-id/src/index';
import { useControlledUncontrolled } from '../../../MainUtilities/src/index';
import type { FunctionComponent, MouseEvent } from 'react';
import * as React from 'react';

import type {
  ICollapsibleProps,
  ICollapsibleStyle,
  ICollapsibleStyleProps,
} from './collapsible.types';

const getClassNames = classNamesFunction<ICollapsibleStyleProps, ICollapsibleStyle>();

const onRenderTitleDefault: IRenderFunction<ICollapsibleProps> = (props) => (
  <div aria-required={Boolean(props?.isRequired)}>{props?.title}</div>
);

export const CollapsibleBase: FunctionComponent<ICollapsibleProps> = (props) => {
    const {
    ariaLabel,
    children,
    disabled = false,
    iconProps,
    isRequired = false,
        onClick,
    onRenderTitle = onRenderTitleDefault,
        onToggle,
    renderHeaderAs: HeaderAs = 'h2',
        styles,
    theme = {},
  } = props;

    // Expanding and collapsing logic.
  const [isExpanded = false, setIsExpanded] = useControlledUncontrolled<
    ICollapsibleProps,
    boolean
        props,
        'isExpanded',
        'defaultIsExpanded',
        false,
    );
  const handleOnToggle = (e: MouseEvent<HTMLButtonElement>) => {
        const newIsExpanded = !isExpanded;

        setIsExpanded(newIsExpanded);
    onToggle?.(newIsExpanded);
        onClick?.(e);
    };

    // Setting unique id’s to bind the content to the header.
  const collapsibleId = useSimpleId();
    const contentId = `collapsible-content_${collapsibleId}`;
  const headerId = `collapsible-header_${collapsibleId}`;

    /**
   * Getting the native button props to spread into the internal button. Removing `title` from native props, because otherwise it would be applied to the button as native button attribute. If no text is available to the screen-reader inside the button, consumers should take advantage of the `ariaLabel` prop.
     */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, ...nativeProps } = getNativeProps<React.ButtonHTMLAttributes<HTMLButtonElement>>(
        props,
        buttonProperties,
    );

    // Determining if a custom icon was passed in, and respect it.
  const iconName = iconProps?.iconName ?? 'ChevronDownMed';

    // Styles
  const classNames = getClassNames(styles, { isExpanded, isRequired, disabled, theme });

    return (
    <div className={classNames.root}>
      <HeaderAs className={classNames.headerContainer}>
        <button
          {...nativeProps}
          id={headerId}
          className={classNames.headerButton}
          aria-controls={contentId}
                    aria-expanded={isExpanded}
          onClick={handleOnToggle}
          aria-label={ariaLabel}
                >
          <div className={classNames.titleContainer}>
            {onRenderTitle(props, onRenderTitleDefault)}
                    <div className={classNames.requiredMarker} />
          {/* This is to ensure that in RTL we have a space that respects the direction
              When there is better browser support, we should use flow relative values for spacing */}
          <div className={classNames.headerSpacer} />
                    <Icon {...iconProps} iconName={iconName} aria-hidden="true" className={classNames.icon} />
                </button>
      </HeaderAs>
      {isExpanded && (
        <section id={contentId} aria-labelledby={headerId} className={classNames.content}>
          {children}
        </section>
      )}
    </div>
  );
};
