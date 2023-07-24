// This wrapperstyle is required, so that,
// the breadcrumb don't shrink when its inside
// flexbox, which happens in studio
export const wrapperStyle = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflowX: 'hidden',
    overflowY: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
} as React.CSSProperties;
