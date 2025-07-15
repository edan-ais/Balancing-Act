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

export interface ColorWheelSet {
  redBold: string;
  redLight: string;
  orangeBold: string;
  orangeLight: string;
  yellowBold: string;
  yellowLight: string;
  greenBold: string;
  greenLight: string;
  blueBold: string;
  blueLight: string;
  indigoBold: string;
  indigoLight: string;
  purpleBold: string;
  purpleLight: string;
  pinkBold: string;
  pinkLight: string;
  brownBold: string;
  brownLight: string;
  grayBold: string;
  grayLight: string;
}

export interface TabColors {
  daily: TabColorSet;
  future: TabColorSet;
  calendar: TabColorSet;
  meals: TabColorSet;
  cleaning: TabColorSet;
  selfCare: TabColorSet;
  delegate: TabColorSet;
  themeColorWheel: ColorWheelSet;
}

export interface Theme {
  name: string;
  id: string;
  backgroundImage?: string;
  addTaskIcon?: string;
  tabBackgrounds?: {
    [key: string]: string;
  };
  tabColors: TabColors;
}

export const themes: Theme[] = [
  balanceTheme,
  latteTheme,
  rainstormTheme,
  autumnTheme
];

export const defaultTheme = balanceTheme;

export { balanceTheme, latteTheme, rainstormTheme, autumnTheme };