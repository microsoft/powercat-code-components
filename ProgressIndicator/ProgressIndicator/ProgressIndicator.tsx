import * as React from 'react';
import { ProgressIndicator, createTheme, ThemeProvider, IPartialTheme } from '@fluentui/react';

export interface IProgressIndicatorProps {
  label?: string;
  typeofIndidcator: string;
  description?: string;
  percentComplete: number;
  intervalIncrement?: number;
  themeJSON?: string;
  ariaLabel?: string;
  intervalDelay?: number;
  progressHidden?: boolean;
  barHeight?: number;
}

export const CanvasProgressIndicator = React.memo((props: IProgressIndicatorProps) => {
  const {
    label, description, percentComplete, themeJSON, typeofIndidcator, progressHidden, barHeight
  } = props;

  const theme = React.useMemo(() => {
    try {
      return themeJSON ? createTheme(JSON.parse(themeJSON) as IPartialTheme) : undefined;
    } catch (ex) {
      /* istanbul ignore next */
      console.error('Cannot parse theme', ex);
    }
  }, [themeJSON]);

  if (typeofIndidcator === "Default Indicator") {
    return (<ThemeProvider theme={theme} >
      <ProgressIndicator progressHidden={progressHidden} barHeight={barHeight} label={label} description={description} percentComplete={percentComplete} />
    </ThemeProvider>);
  }

  return (
    <ThemeProvider theme={theme} >
      <ProgressIndicator progressHidden={progressHidden} barHeight={barHeight}  label={label} description={description} />
    </ThemeProvider>
  );
});
CanvasProgressIndicator.displayName = 'CanvasProgressIndicator';