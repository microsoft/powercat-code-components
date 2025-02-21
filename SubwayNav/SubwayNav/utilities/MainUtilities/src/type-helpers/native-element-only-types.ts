// @ts-nocheck
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from 'react';

/**
 * Type that excludes crossover keys between button and anchor and only includes anchor values
 */
export type OnlyAnchorProps = Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ButtonHTMLAttributes<HTMLButtonElement> & HTMLAttributes<HTMLDivElement>
>;

/**
 * Type that excludes crossover keys between button and anchor and only includes anchor values
 */
export type OnlyButtonProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof AnchorHTMLAttributes<HTMLAnchorElement> & HTMLAttributes<HTMLDivElement>
>;

/**
 * Intersection type that only includes <button> props without overlap keys from <a>
 */
export type ButtonPropsWithoutAnchorProps = {
    [P in keyof OnlyAnchorProps]?: never;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Intersection type that only includes <a> props without overlap keys from <button>
 */
export type AnchorPropsWithoutButtonProps = {
    [P in keyof OnlyButtonProps]?: never;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Intersection type that only includes <div> props without overlap keys from <button> or <a>
 */
export type DivPropsWithoutAnchorOrButtonProps = {
    [P in keyof OnlyButtonProps]?: never;
} & {
    [P in keyof OnlyAnchorProps]?: never;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Union type that will only allow keys from types within the union thus giving bettern intellisense support
 */
export type InteractiveOrNonInteractiveElementProps =
    | ButtonPropsWithoutAnchorProps
    | AnchorPropsWithoutButtonProps
    | DivPropsWithoutAnchorOrButtonProps;
