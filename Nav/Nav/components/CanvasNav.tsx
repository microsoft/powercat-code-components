import { useAsync, usePrevious } from '@fluentui/react-hooks';
import {
    Nav,
    INav,
    INavLink,
    INavLinkGroup,
    INavStyles,
    createTheme,
    IPartialTheme,
    ThemeProvider,
    IIconProps,
} from '@fluentui/react';
import * as React from 'react';
import { CanvasNavProps, NavItem } from './Component.types';

export const CanvasNav = React.memo((props: CanvasNavProps) => {
    const {
        items,
        onSelected,
        nestedItems,
        ariaLabel,
        selectedKey,
        setFocus,
        themeJSON,
        height,
        width,
        collapseByDefault,
    } = props;
    const [groupExpandCollapseState, setGroupExpandCollapseState] = React.useState<string[]>([]);
    const prevSelectedKey = usePrevious(selectedKey);
    const [hasRerendered, SetRendered] = React.useState(false);
    const onHeaderClick = React.useCallback(
        (isCollapsing: boolean, key: string, ev?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
            let hasChanged = false;
            if (ev) {
                //using aria label to check if isCollpasing as onHeaderclick is not available for NavLinks
                const elementAriaExpanded =
                    ev.currentTarget.ariaExpanded === null
                        ? ev.currentTarget.previousElementSibling?.ariaExpanded
                        : ev.currentTarget.ariaExpanded;
                isCollapsing = elementAriaExpanded === 'true' ? true : false;
                const selectedItem = items.find((i) => i.key === key);
                if (selectedItem) onSelected(selectedItem);
            }
            if (isCollapsing) {
                // Remove key
                const index = groupExpandCollapseState.indexOf(key);
                if (index > -1) groupExpandCollapseState.splice(index, 1);
                hasChanged = true;
            } else if (groupExpandCollapseState.indexOf(key) === -1) {
                groupExpandCollapseState.push(key);
                hasChanged = true;
            }
            if (hasChanged) {
                setGroupExpandCollapseState([...groupExpandCollapseState]);
            }
        },
        [items, onSelected, groupExpandCollapseState, setGroupExpandCollapseState],
    );

    const groups = React.useMemo(() => {
        return nestedItems.map((group: INavLink) => {
            return {
                key: group.key,
                ...(group.links != null && {
                    links: generateNavLinks(group?.links),
                }),
            } as INavLinkGroup;
        });

        function generateNavLinks(link: INavLink[]): INavLink[] {
            return link.map((currentLink) => {
                return {
                    key: currentLink.key,
                    name: currentLink.name,
                    disabled: currentLink.enabled === false,
                    ...(currentLink.links == null &&
                        currentLink.iconName != null && {
                            iconProps: getIconProps(currentLink.iconName, currentLink.iconColor),
                        }),
                    ...(currentLink.links != null && {
                        links: generateNavLinks(currentLink?.links),
                        expandAriaLabel: currentLink.name.concat(' expanded'),
                        collapseAriaLabel: currentLink.name.concat(' collapsed'),
                        isExpanded: shouldExpand(currentLink),
                    }),
                } as INavLink;
            });
        }
        function shouldExpand(currentLink: INavLink): boolean | undefined {
            const isExpanded = currentLink.isExpanded;
            let shouldExpand: boolean | undefined = isExpanded != null ? isExpanded : !collapseByDefault;
            if (groupExpandCollapseState.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                shouldExpand = groupExpandCollapseState.indexOf(currentLink.key!) > -1 ? true : false;
            }
            return shouldExpand;
        }
    }, [nestedItems, groupExpandCollapseState, collapseByDefault]);

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const componentRef = React.useRef<INav>(null);
    const async = useAsync();
    React.useEffect(() => {
        if (setFocus && setFocus !== '' && componentRef) {
            async.requestAnimationFrame(() => {
                (componentRef as React.RefObject<INav>).current?.focus();
            });
        }
    }, [setFocus, componentRef, async]);

    const navStyles: Partial<INavStyles> = React.useMemo(() => {
        return {
            root: {
                width: width,
                height: height,
                boxSizing: 'border-box',
                //border: '1px solid #eee',
                overflowY: 'auto',
            }, // these link styles override the default truncation behavior
            // so that the item text wraps
            link: {
                whiteSpace: 'normal',
                lineHeight: 'inherit',
            },
            groupContent: {
                marginBottom: 0,
            },
            // For the issue related to Nested Nav Chevron icon overlapping https://github.com/microsoft/fluentui/issues/8830#issuecomment-486402461
            chevronButton: {
                'background-color': 'transparent',
                '::after': {
                    content: 'none',
                },
            },
        };
    }, [width, height]);

    const onLinkClick = React.useCallback(
        (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
            const selectedItem = item && items.find((i) => i.key === item?.key);
            if (selectedItem) onSelected(selectedItem);
        },
        [items, onSelected],
    );

    function getIconProps(iconName: string, iconColor: string): IIconProps {
        return {
            iconName: iconName,
            styles: {
                root: { color: iconColor },
            },
        } as IIconProps;
    }

    React.useEffect(() => {
        // If the selected key has changed - check if we need to expand the group
        if (prevSelectedKey !== selectedKey) {
            // If the selectedKey group is not expanded, expand it
            const expandGroup = items.find((g) => g.key === selectedKey);
            if (expandGroup && expandGroup.parentItemKey) {
                onHeaderClick(false, expandGroup.parentItemKey);
            }
        }
    }, [selectedKey, hasRerendered, items, onHeaderClick, prevSelectedKey]);

    React.useEffect(() => {
        // If selected key is predefined - expand corresponding node irrespective of isExpanded property
        let parentNavlink: NavItem | undefined;
        const expandGroup = items.find((g) => g.key === selectedKey);
        if (!hasRerendered && nestedItems.length) {
            // collect the list of navlinks which should be expanded after load
            items
                .filter((group) => group.visible !== false)
                .map((g) => {
                    if ((g.isExpanded !== false && !collapseByDefault) || g.isExpanded === true)
                        onHeaderClick(false, g.key);
                });
            parentNavlink = items.find((g) => g.key === expandGroup?.key);
            if (parentNavlink) {
                expandHeaderGrp(parentNavlink);
            }
            SetRendered(true);
        }

        function expandHeaderGrp(parentNavItem: NavItem): void {
            onHeaderClick(false, parentNavItem.key);
            parentNavlink = items.find((g) => g.key === parentNavItem?.parentItemKey && g.key !== g.parentItemKey);
            if (parentNavlink) expandHeaderGrp(parentNavlink);
        }
    }, [selectedKey, hasRerendered, items, nestedItems, collapseByDefault, onHeaderClick, prevSelectedKey]);

    return (
        <ThemeProvider applyTo="none" theme={theme}>
            <Nav
                componentRef={componentRef}
                onLinkClick={onLinkClick}
                onLinkExpandClick={(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
                    if (item && item.key !== undefined) onHeaderClick(false, item.key, ev);
                }}
                selectedKey={selectedKey}
                styles={navStyles}
                groups={groups}
                ariaLabel={ariaLabel}
            />
        </ThemeProvider>
    );
});
CanvasNav.displayName = 'CanvasNav';
