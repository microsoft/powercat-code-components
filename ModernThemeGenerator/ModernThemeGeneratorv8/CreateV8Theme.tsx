import * as React from 'react';
import { createV8Theme } from "@fluentui/react-migration-v8-v9";

export interface IThemeGeneratorv8 extends ComponentFramework.FluentDesignState {
  getTheme: (getTheme: string) => void;
  width: number;
  height: number;
}

export const ThemeGeneratorv8 = React.memo((props: IThemeGeneratorv8) => {
  const { width, height, brand, tokenTheme, isDarkTheme, getTheme } = props;

  React.useEffect(() => {
    const newV8Theme = tokenTheme ? createV8Theme(brand, tokenTheme, isDarkTheme) : undefined;
    if (newV8Theme) {
      getTheme(JSON.stringify(newV8Theme, null, 4));
    }
  }, [brand, tokenTheme, isDarkTheme, getTheme]);

  return (
    <span style={{
      width: width,
      height: height,
      fontSize: tokenTheme?.fontSize || "14px",
      font: tokenTheme?.font || "Arial, sans-serif",
      color: tokenTheme?.color || "#000",
      wordWrap: "break-word",     
      wordBreak: "break-word",    
      whiteSpace: "normal",       
      overflowWrap: "break-word", 
      overflow: "hidden",         
      textOverflow: "ellipsis",   
    }}>
      This is a Modern Theme Generator Code Component which generates theme (ThemeJSON) for Creator kit components
    </span>
  );
});

ThemeGeneratorv8.displayName = "ThemeGeneratorv8";
