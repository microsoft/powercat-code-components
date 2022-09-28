import * as React from 'react';
import { Facepile as CustomFacepile } from '../fluenui-fork/Facepile/Facepile';
//import { Facepile } from '@fluentui/react';
import { IFacepilePersona, ThemeProvider, createTheme, IPartialTheme } from '@fluentui/react';
import { IFacepileprops } from './Component.types';
import { getFacepilePersonas } from './DatasetMapping';
import { getPersonaPresence } from './Helper';
import { useAsync } from '@fluentui/react-hooks';
import { OutputEvents } from '../ManifestConstants';

export const CanvasFacepile = React.memo((props: IFacepileprops) => {
    const {
        width,
        height,
        imagesFadeIn,
        displayedPersonas,
        onSelected,
        personaSize,
        setFocus,
        themeJSON,
        ariaLabel,
        items,
        overflowButtonType,
        showAddButton,
        overflowButtonAriaLabel,
        addbuttonAriaLabel,
        tabIndex,
    } = props;

    const theme = React.useMemo(() => {
        try {
            return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
        } catch (ex) {
            /* istanbul ignore next */
            console.error('Cannot parse theme', ex);
        }
    }, [themeJSON]);

    const getPersonaProps = React.useCallback(
        (persona: IFacepilePersona) => ({
            imageShouldFadeIn: imagesFadeIn,
            ...(typeof persona.data !== 'undefined' && { presence: getPersonaPresence(persona.data) }),
        }),
        [imagesFadeIn],
    );

    const overflowButtonProps = {
        ariaLabel: overflowButtonAriaLabel,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (ev: React.MouseEvent<HTMLButtonElement>) => onSelected(OutputEvents.OverFlowButtonEvent),
    };

    const addButtonProps = {
        ariaLabel: addbuttonAriaLabel,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onClick: (ev: React.MouseEvent<HTMLButtonElement>) => onSelected(OutputEvents.AddButtonEvent),
    };

    // Provide an explicit size so that the ResizeGroup measurements are correct
    const rootStyle = React.useMemo(() => {
        return {
            display: 'block',
            position: 'absolute',
            width: width,
            height: height,
        } as React.CSSProperties;
    }, [width, height]);

    const onClick = React.useCallback(
        (ev?: unknown, item?: IFacepilePersona) => {
            const selectedItem = item && items.find((i: IFacepilePersona) => i.id === item?.id);
            if (selectedItem) onSelected(OutputEvents.PersonaEvent, selectedItem);
        },
        [items, onSelected],
    );

    const rootRef = React.useRef<HTMLDivElement>(null);
    const async = useAsync();
    React.useEffect(() => {
        if (setFocus && setFocus !== '' && rootRef) {
            async.requestAnimationFrame(() => {
                // We can't call focus() on the imperative componentRef because of a bug in ResizeGroup
                // that causes the componentRef.current to be nulled
                // See https://github.com/microsoft/fluentui/issues/22844
                const buttons = (rootRef.current as HTMLElement).getElementsByTagName('button');
                if (buttons && buttons.length > 0) {
                    buttons[0].focus();
                }
            });
        }
    }, [setFocus, rootRef, async]);

    const facepilePersonas: IFacepilePersona[] = getFacepilePersonas(items, onClick);

    return (
        <ThemeProvider theme={theme} style={rootStyle}>
            <CustomFacepile
                personaSize={personaSize}
                personas={facepilePersonas}
                maxDisplayablePersonas={displayedPersonas}
                overflowButtonType={overflowButtonType}
                overflowButtonProps={overflowButtonProps}
                getPersonaProps={getPersonaProps}
                ariaLabel={ariaLabel}
                showAddButton={showAddButton}
                addButtonProps={addButtonProps}
                tabIndex={tabIndex}
            />
        </ThemeProvider>
    );
});
CanvasFacepile.displayName = 'CanvasFacepile';
