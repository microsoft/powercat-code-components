/**
 * A flexible header type that let's the consumer chose what level of heading to assign.
 * Most consumers
 */
export type FlexibleHeader = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface IFlexibleHeader {
    /**
     * Header type that can be rendered as an HTML element.
     */
    renderHeaderAs?: FlexibleHeader;
}
