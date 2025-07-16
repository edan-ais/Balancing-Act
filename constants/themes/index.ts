import { balanceTheme } from './balanceTheme';
import { latteTheme } from './latteTheme';
import { rainstormTheme } from './rainstormTheme';
import { autumnTheme } from './autumnTheme';

export interface TabColorSet {
  veryDark: string;
  shadow: string;
  dark: string;
  medium: string;
  pastel: string;
  bgAlt: string;
  highlight: string;
  bg: string;
  accent: string;
}

export interface TabColors {
  daily: TabColorSet;
  future: TabColorSet;
  calendar: TabColorSet;
  meals: TabColorSet;
  cleaning: TabColorSet;
  selfCare: TabColorSet;
  delegate: TabColorSet;
}

export interface Theme {
  name: string;
  id: string;
  backgroundImage?: string;
  tabColors: TabColors;
}

// Helper function to get color wheel colors from theme tabs
export const getColorWheelFromTheme = (theme: Theme) => {
  return {
    redBold: theme.tabColors.selfCare.dark,
    redLight: theme.tabColors.selfCare.pastel,
    orangeBold: theme.tabColors.meals.dark,
    orangeLight: theme.tabColors.meals.pastel,
    yellowBold: theme.tabColors.calendar.dark,
    yellowLight: theme.tabColors.calendar.pastel,
    greenBold: theme.tabColors.future.dark,
    greenLight: theme.tabColors.future.pastel,
    blueBold: theme.tabColors.daily.dark,
    blueLight: theme.tabColors.daily.pastel,
    indigoBold: theme.tabColors.cleaning.dark,
    indigoLight: theme.tabColors.cleaning.pastel,
    purpleBold: theme.tabColors.delegate.dark,
    purpleLight: theme.tabColors.delegate.pastel,
    pinkBold: theme.tabColors.meals.highlight,
    pinkLight: theme.tabColors.meals.bgAlt,
    brownBold: theme.tabColors.cleaning.highlight,
    brownLight: theme.tabColors.cleaning.bgAlt,
    grayBold: theme.tabColors.daily.medium,
    grayLight: theme.tabColors.daily.bgAlt,
  };
};

export const themes: Theme[] = [balanceTheme, latteTheme, rainstormTheme, autumnTheme];
export const defaultTheme = balanceTheme;
export { balanceTheme, latteTheme, rainstormTheme, autumnTheme };