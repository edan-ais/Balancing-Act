import { balanceTheme } from './balanceTheme';
import { latteTheme } from './latteTheme';

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
  tabColors: TabColors;
}

export const themes: Theme[] = [
  balanceTheme,
  latteTheme
];

export const defaultTheme = balanceTheme;

export { balanceTheme, latteTheme };