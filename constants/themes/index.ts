import { balanceTheme } from './balanceTheme';
import { latteTheme } from './latteTheme';
import { rainstormTheme } from './rainstormTheme';
import { autumnTheme } from './autumnTheme';

export interface ThemeColors {
  pastel: string;
  dark: string;
  bg: string;
  accent: string;
}

export interface TabColors {
  daily: ThemeColors;
  future: ThemeColors;
  calendar: ThemeColors;
  meals: ThemeColors;
  cleaning: ThemeColors;
  selfCare: ThemeColors;
  delegate: ThemeColors;
}

export interface Theme {
  name: string;
  id: string;
  backgroundImage?: string;
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