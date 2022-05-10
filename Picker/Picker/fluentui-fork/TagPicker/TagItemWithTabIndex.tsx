/* istanbul ignore file */
/* eslint-disable */
/* eslint-disable prettier/prettier */

/* 
CanvasApp TabIndex issue
------------------------
This custom version of TagItem is required to add the tabindex to the buttons of the tags
because at this time canvas apps adds a positive tabindex to all elements rather than relying on
dom ordering. 
*/
import * as React from 'react';
import { useId } from '@fluentui/react-hooks';
import { classNamesFunction, IconButton, ITagItemProps, ITagItemStyleProps, ITagItemStyles, styled } from '@fluentui/react';
import { getStyles } from './TagItem.styles';

const getClassNames = classNamesFunction<ITagItemStyleProps, ITagItemStyles>();

/**
 * {@docCategory TagPicker}
 */
export const TagItemWithTabIndexBase = (props: ITagItemProps) => {
  const {
    theme,
    styles,
    selected,
    disabled,
    enableTagFocusInDisabledPicker,
    children,
    className,
    index,
    onRemoveItem,
    removeButtonAriaLabel,
    title = typeof props.children === 'string' ? props.children : props.item.name,
    tabIndex
  } = props;

  const classNames = getClassNames(styles, {
    theme: theme!,
    className,
    selected,
    disabled,
  });

  const itemId = useId();

  const disabledAttrs = enableTagFocusInDisabledPicker
    ? {
        'aria-disabled': disabled,
        tabindex: tabIndex,
      }
    : {
        disabled: disabled,
        // ISSUE 1 - need specific tabindex for canvas apps
        tabIndex: !disabled ? tabIndex : undefined, // Added tabindex for canvas app accessibility
      };

  return (
    <div className={classNames.root} role={'listitem'} key={index}>
      <span className={classNames.text} title={title} id={`${itemId}-text`}>
        {children}
      </span>
      <IconButton
        id={itemId}
        onClick={onRemoveItem}
        {...disabledAttrs}
        iconProps={{ iconName: 'Cancel', styles: { root: { fontSize: '12px' } } }}
        className={classNames.close}
        ariaLabel={removeButtonAriaLabel}
        aria-labelledby={`${itemId} ${itemId}-text`}
        data-selection-index={index}
      />
    </div>
  );
};

export const TagItemWithTabIndex = styled<ITagItemProps, ITagItemStyleProps, ITagItemStyles>(TagItemWithTabIndexBase, getStyles, undefined, {
  scope: 'TagItem',
});
