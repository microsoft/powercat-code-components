# Fluent UI Fork

This folder contains forked components of the fluentui library.

## Why custom versions?

The following issues are addressed with this custom set of components:

### ISSUE 1: Positive tabindex

Canvas Apps set positive tabindexes for it's components, making it important to use positive tabindexes for fluent ui components otherwise the tab order will be inconsistent - DOM order vs explicit positive tabindex.

The Facepile component do not provide a facility to provide  custom implementation of tabIndex, so it is forked to add additional prop(tabIndex) that allows setting correct tabindexes.

Below are the list of files altered to achieve/assign custom tabindex.
- Facepile.base.tsx 
- Facepile.types.ts