import * as React from 'react';
import { AccessibilityChecker } from './AccessibilityChecker';
import {
  BaseSlots,
  IThemeRules,
  FabricSlots,
  ThemeGenerator,
  themeRulesStandardCreator,
} from '@fluentui/react/lib/ThemeGenerator';
import { Async, createTheme, ITheme, getColorFromString, IColor, IconButton, isDark, mergeStyles, Stack, IStackProps, Text, ThemeProvider } from '@fluentui/react';
import { ThemeSlots } from './ThemeSlots';
import { Header } from './Header';
import { Samples } from './Samples/index';
import { ThemeDesignerColorPicker } from './ThemeDesignerColorPicker';
import { MainPanelWidth } from '../shared/MainPanelStyles';

export interface IThemingDesignerState {
  primaryColor?: IColor;
  textColor?: IColor;
  backgroundColor?: IColor;
  theme?: ITheme;
  themeRules?: IThemeRules;
  themeJSON?: string
}

export interface IThemingDesignerProps {
  getTheme: ((getTheme?: string) => void);
  setColor: ((primaryColor?: IColor, textColor?: IColor, backgroundColor?: IColor) => void);
  primaryColor?: IColor;
  textColor?: IColor;
  backgroundColor?: IColor;
  height: number;
  width: number;
}

const Page = (props: IStackProps, mainProps: IThemingDesignerProps) => (
  <Stack
    gap={10}
    className={mergeStyles({
      height: mainProps.height,
      width: mainProps.height,
      overflow: 'hidden',
      selectors: {
        ':global(body)': {
          padding: 0,
          margin: 0,
        },
      },
    })}
    {...props}
  />
);

const Content = (props: IStackProps) => (
  <Stack horizontal gap={10} className={mergeStyles({ overflow: 'hidden' })} {...props} />
);

const Sidebar = (props: IStackProps) => (
  <Stack
    disableShrink
    gap={10}
    grow={0}
    className={mergeStyles({
      borderRight: '1px solid #ddd',
      paddingRight: '0.5rem'
    })}
    {...props}
  />
);

const Main = (props: IStackProps) => (
  <Stack
    grow={1}
    disableShrink
    className={mergeStyles({
      minWidth: MainPanelWidth,
      overflow: 'scroll',
    })}
    {...props}
  />
);

export class ThemingDesigner extends React.Component<IThemingDesignerProps, IThemingDesignerState> {
  private _colorChangeTimeout: number;
  private _fabricPaletteColorChangeTimeout: number;
  private _async: Async;

  constructor(props: IThemingDesignerProps) {
    super(props);
    this._async = new Async(this);
    this.state = this._buildInitialState();
  }

  public componentWillUnmount(): void {
    this._async.dispose();
  }

  public componentDidUpdate(previousProps: IThemingDesignerProps, previousState: IThemingDesignerState) {
    if (previousProps.primaryColor !== this.props.primaryColor) {
      if (this.props.primaryColor)
        this.setState({ primaryColor: this.props.primaryColor });
      else
        this.setState({ primaryColor: previousState.primaryColor });
    }
    if (previousProps.textColor !== this.props.textColor) {
      if (this.props.textColor)
        this.setState({ textColor: this.props.textColor });
      else
        this.setState({ textColor: previousState.textColor });
    }
    if (previousProps.backgroundColor !== this.props.backgroundColor) {
      if (this.props.backgroundColor)
        this.setState({ backgroundColor: this.props.backgroundColor });
      else
        this.setState({ backgroundColor: previousState.backgroundColor });

    }
  }

  getTheme = (themeJSON?: string) => {
    this.props.getTheme(themeJSON);
  }

  private _exportToJson = () => {
    const themeRules = this.state.themeRules;
    // strip out the unnecessary shade slots from the final output theme
    const abridgedTheme: IThemeRules = {};
    for (const ruleName in themeRules) {
      if (themeRules.hasOwnProperty(ruleName)) {
        if (
          ruleName.indexOf('ColorShade') === -1 &&
          ruleName !== 'primaryColor' &&
          ruleName !== 'backgroundColor' &&
          ruleName !== 'foregroundColor' &&
          ruleName.indexOf('body') === -1
        ) {
          abridgedTheme[ruleName] = themeRules[ruleName];
        }
      }
    }
    this.getTheme(JSON.stringify(ThemeGenerator.getThemeAsJson(abridgedTheme), undefined, 2));
  };

  public render() {
    return (
      <Page>
        <Header themeRules={this.state.themeRules} themeJSON={this.getTheme} />
        <Content>
          <Sidebar>
            <Text variant={'xLarge'} styles={{ root: { fontWeight: 600, marginLeft: 20 } }}>
              <IconButton
                disabled={false}
                checked={false}
                iconProps={{ iconName: 'Color', styles: { root: { fontSize: '20px', marginRight: 12 } } }}
                title="Colors"
                ariaLabel="Colors"
              />
              Color
            </Text>
            {/* the three base slots, prominently displayed at the top of the page */}
            <ThemeDesignerColorPicker
              color={this.state.primaryColor!}
              onColorChange={this._onPrimaryColorPickerChange}
              label={'Primary color'}
            />
            <ThemeDesignerColorPicker
              color={this.state.textColor!}
              onColorChange={this._onTextColorPickerChange}
              label={'Text color'}
            />
            <ThemeDesignerColorPicker
              color={this.state.backgroundColor!}
              onColorChange={this._onBkgColorPickerChange}
              label={'Background color'}
            />
          </Sidebar>
          <Main>
            <ThemeProvider theme={this.state.theme}>
              <Samples backgroundColor={this.state.backgroundColor!.str} textColor={this.state.textColor!.str} />
            </ThemeProvider>
            <AccessibilityChecker theme={this.state.theme} themeRules={this.state.themeRules} />
            <ThemeSlots
              theme={this.state.theme}
              themeRules={this.state.themeRules}
              onFabricPaletteColorChange={this._onFabricPaletteColorChange}
            />
          </Main>
        </Content>
      </Page>
    );
  }

  private _onFabricPaletteColorChange = (newColor: IColor | undefined, fabricSlot: FabricSlots) => {
    if (this._fabricPaletteColorChangeTimeout) {
      this._async.clearTimeout(this._fabricPaletteColorChangeTimeout);
    }
    if (!this.state.themeRules) {
      return;
    }
    this._fabricPaletteColorChangeTimeout = this._async.setTimeout(() => {
      const { themeRules } = this.state;
      if (themeRules) {
        const currentIsDark = isDark(themeRules[FabricSlots[fabricSlot]].color!);
        ThemeGenerator.setSlot(themeRules[FabricSlots[fabricSlot]], newColor!, currentIsDark, true, true);
        if (currentIsDark !== isDark(themeRules[FabricSlots[fabricSlot]].color!)) {
          // isInverted got swapped, so need to refresh slots with new shading rules
          ThemeGenerator.insureSlots(themeRules, currentIsDark);
        }
      }
      this.setState({ themeRules: themeRules }, this._makeNewTheme);
    }, 20);
  };

  private _onPrimaryColorPickerChange = (newColor: IColor | undefined) => {
    this._onColorChange(this.state.primaryColor!, BaseSlots.primaryColor, newColor);
  };

  private _onTextColorPickerChange = (newColor: IColor | undefined) => {
    this._onColorChange(this.state.textColor!, BaseSlots.foregroundColor, newColor);
  };

  private _onBkgColorPickerChange = (newColor: IColor | undefined) => {
    this._onColorChange(this.state.backgroundColor!, BaseSlots.backgroundColor, newColor);
  };

  private _makeNewTheme = (): void => {
    if (this.state.themeRules) {
      const themeAsJson: {
        [key: string]: string;
      } = ThemeGenerator.getThemeAsJson(this.state.themeRules);

      const finalTheme = createTheme({
        ...{ palette: themeAsJson },
        isInverted: isDark(this.state.themeRules[BaseSlots[BaseSlots.backgroundColor]].color!),
      });
      this.setState({ theme: finalTheme });
    }
  };

  private _onColorChange = (colorToChange: IColor, baseSlot: BaseSlots, newColor: IColor | undefined) => {

    if (this._colorChangeTimeout) {
      this._async.clearTimeout(this._colorChangeTimeout);
    }

    if (newColor) {
      if (colorToChange === this.state.primaryColor) {
        this.setState({ primaryColor: newColor });
        this.props.setColor(newColor, this.state.textColor, this.state.backgroundColor);
      } else if (colorToChange === this.state.textColor) {
        this.setState({ textColor: newColor });
        this.props.setColor(this.state.primaryColor, newColor, this.state.backgroundColor);
      } else if (colorToChange === this.state.backgroundColor) {
        this.setState({ backgroundColor: newColor });
        this.props.setColor(this.state.primaryColor, this.state.textColor, newColor);
      } else {
        return;
      }
      this._colorChangeTimeout = this._async.setTimeout(() => {
        const themeRules = this.state.themeRules;
        if (themeRules) {
          const currentIsDark = isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!);
          ThemeGenerator.setSlot(themeRules[BaseSlots[baseSlot]], newColor, currentIsDark, true, true);
          if (currentIsDark !== isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!)) {
            // isInverted got swapped, so need to refresh slots with new shading rules
            ThemeGenerator.insureSlots(themeRules, currentIsDark);
          }
        }
        this.setState({ themeRules: themeRules }, this._makeNewTheme);
      }, 20);
      // 20ms is low enough that you can slowly drag to change color and see that theme,
      // but high enough that quick changes don't get bogged down by a million changes inbetween
    }

    // To get JSON output on Color Change instead of Apply Theme Button Click, Uncomment this if required 
    //this._exportToJson();
  };

  private _buildInitialState = (): IThemingDesignerState => {
    const themeRules = themeRulesStandardCreator();
    // Setting up default color incase predefined colors are not valid / Undefined to avoid breaking of component
    const colors = {
      primaryColor: this.props.primaryColor ? this.props.primaryColor : getColorFromString('#0078d4')!,
      textColor: this.props.textColor ? this.props.textColor : getColorFromString('#323130')!,
      backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : getColorFromString('#ffffff')!,
    };
    ThemeGenerator.insureSlots(themeRules, isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!));
    ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.primaryColor]], colors.primaryColor!, undefined, false, false);
    ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.foregroundColor]], colors.textColor!, undefined, false, false);
    ThemeGenerator.setSlot(
      themeRules[BaseSlots[BaseSlots.backgroundColor]],
      colors.backgroundColor!,
      undefined,
      false,
      false,
    );

    const themeAsJson: {
      [key: string]: string;
    } = ThemeGenerator.getThemeAsJson(themeRules);

    const finalTheme = createTheme({
      ...{ palette: themeAsJson },
      isInverted: isDark(themeRules[BaseSlots[BaseSlots.backgroundColor]].color!),
    });

    const state = {
      ...colors,
      theme: finalTheme,
      themeRules: themeRules,
    };

    return state;


  };
}
