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

const balanceTheme: Theme = {
  name: 'Balance Theme',
  id: 'balance',
  backgroundImage: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  tabColors: {
    daily: {
      veryDark: '#1A2870',
      shadow: '#2A3A96',
      dark: '#4055C5',
      medium: '#7385E0',
      pastel: '#B9C5FA',
      bgAlt: '#E5EBFF',
      highlight: '#5E7CFF',
      bg: '#F2F5FF',
      accent: '#D9E0FC'
    },
    future: {
      veryDark: '#0E5A28',
      shadow: '#1B7340',
      dark: '#2A9958',
      medium: '#5ABC82',
      pastel: '#A9E6C0',
      bgAlt: '#E1F7E9',
      highlight: '#3AD174',
      bg: '#F2FFF7',
      accent: '#C9F2D9'
    },
    calendar: {
      veryDark: '#3E2980',
      shadow: '#5A3CA0',
      dark: '#7E55D4',
      medium: '#A989E5',
      pastel: '#D6C5F5',
      bgAlt: '#EEEAFF',
      highlight: '#9D6BFF',
      bg: '#F8F5FF',
      accent: '#E8DDFA'
    },
    meals: {
      veryDark: '#8C1B5A',
      shadow: '#AA2370',
      dark: '#D42E8F',
      medium: '#E968B9',
      pastel: '#F5B5DE',
      bgAlt: '#FFE6F4',
      highlight: '#FF57B3',
      bg: '#FFF5FB',
      accent: '#FAD8EE'
    },
    cleaning: {
      veryDark: '#0F4578',
      shadow: '#195999',
      dark: '#2578C8',
      medium: '#65A5E8',
      pastel: '#B2DAFD',
      bgAlt: '#E1EEFF',
      highlight: '#4AA5FF',
      bg: '#F2F8FF',
      accent: '#D4E8FE'
    },
    selfCare: {
      veryDark: '#8C1E1E',
      shadow: '#A82828',
      dark: '#D83A3A',
      medium: '#EA7575',
      pastel: '#FCBFBF',
      bgAlt: '#FFE8E8',
      highlight: '#FF5757',
      bg: '#FFF5F5',
      accent: '#FBD8D8'
    },
    delegate: {
      veryDark: '#105551',
      shadow: '#1A6D69',
      dark: '#258F8A',
      medium: '#57BFB9',
      pastel: '#A9E3E0',
      bgAlt: '#DEFAF8',
      highlight: '#2DCCBB',
      bg: '#F2FFFE',
      accent: '#C9F0EE'
    }
  }
};

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

export const themes: Theme[] = [balanceTheme];
export const defaultTheme = balanceTheme;