import * as React from 'react';
import {
  SearchBox,
  createTheme,
  IPartialTheme,
  ThemeProvider
} from '@fluentui/react';
import { memo } from "react";
import { ISearchBoxComponentProps } from './SearchBox.types';

const SearchBoxBase = ((props: ISearchBoxComponentProps) => {
  const {
    onChanged, 
    themeJSON, 
    ariaLabel
  } = props;

  const theme = React.useMemo(() => {
    try {
      return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
    } catch (ex) {
      /* istanbul ignore next */
      console.error('Cannot parse theme', ex);
    }
  }, [themeJSON]);

  return (
    <ThemeProvider theme={theme}>
      <SearchBox
        placeholder="Search"
        onChange={newValue => onChanged(newValue?.target.value)}
        ariaLabel={ariaLabel}
      />
    </ThemeProvider>
  );
});

/** Component that can render `<searchbox>` */
export const SearchBoxComponent = memo(SearchBoxBase);
