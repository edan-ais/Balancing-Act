// Balance Theme - Enhanced color scheme with expanded options
export const balanceTheme = {
  name: 'Balance Theme',
  id: 'balance',
  backgroundImage: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  tabColors: {
    // Blue
    daily: {
      veryDark: '#1A2870',     // Very dark blue
      shadow: '#2A3A96',       // Deep shadow blue
      dark: '#4055C5',         // Dark blue
      medium: '#7385E0',       // Medium blue
      pastel: '#B9C5FA',       // Light blue
      bgAlt: '#E5EBFF',        // Very light blue
      highlight: '#5E7CFF',    // Bright blue
      bg: '#F2F5FF',           // Ultra light blue
      accent: '#D9E0FC'        // Soft blue
    },
    // Green
    future: {
      veryDark: '#0E5A28',     // Very dark green
      shadow: '#1B7340',       // Deep shadow green
      dark: '#2A9958',         // Dark green
      medium: '#5ABC82',       // Medium green
      pastel: '#A9E6C0',       // Light green
      bgAlt: '#E1F7E9',        // Very light green
      highlight: '#3AD174',    // Bright green
      bg: '#F2FFF7',           // Ultra light green
      accent: '#C9F2D9'        // Soft green
    },
    // Purple
    calendar: {
      veryDark: '#3E2980',     // Very dark purple
      shadow: '#5A3CA0',       // Deep shadow purple
      dark: '#7E55D4',         // Dark purple
      medium: '#A989E5',       // Medium purple
      pastel: '#D6C5F5',       // Light purple
      bgAlt: '#EEEAFF',        // Very light purple
      highlight: '#9D6BFF',    // Bright purple
      bg: '#F8F5FF',           // Ultra light purple
      accent: '#E8DDFA'        // Soft purple
    },
    // Orange
    meals: {
      veryDark: '#823E08',     // Very dark orange
      shadow: '#A5500F',       // Deep shadow orange
      dark: '#DC6B15',         // Dark orange
      medium: '#EE9A59',       // Medium orange
      pastel: '#F8D0B0',       // Light orange
      bgAlt: '#FFEEDA',        // Very light orange
      highlight: '#FF9C45',    // Bright orange
      bg: '#FFF8F2',           // Ultra light orange
      accent: '#FBE2CE'        // Soft orange
    },
    // Light Blue
    cleaning: {
      veryDark: '#0F4578',     // Very dark light blue
      shadow: '#195999',       // Deep shadow light blue
      dark: '#2578C8',         // Dark light blue
      medium: '#65A5E8',       // Medium light blue
      pastel: '#B2DAFD',       // Light light blue
      bgAlt: '#E1EEFF',        // Very light light blue
      highlight: '#4AA5FF',    // Bright light blue
      bg: '#F2F8FF',           // Ultra light light blue
      accent: '#D4E8FE'        // Soft light blue
    },
    // Red
    selfCare: {
      veryDark: '#8C1E1E',     // Very dark red
      shadow: '#A82828',       // Deep shadow red
      dark: '#D83A3A',         // Dark red
      medium: '#EA7575',       // Medium red
      pastel: '#FCBFBF',       // Light red
      bgAlt: '#FFE8E8',        // Very light red
      highlight: '#FF5757',    // Bright red
      bg: '#FFF5F5',           // Ultra light red
      accent: '#FBD8D8'        // Soft red
    },
    // Teal
    delegate: {
      veryDark: '#105551',     // Very dark teal
      shadow: '#1A6D69',       // Deep shadow teal
      dark: '#258F8A',         // Dark teal
      medium: '#57BFB9',       // Medium teal
      pastel: '#A9E3E0',       // Light teal
      bgAlt: '#DEFAF8',        // Very light teal
      highlight: '#2DCCBB',    // Bright teal
      bg: '#F2FFFE',           // Ultra light teal
      accent: '#C9F0EE'        // Soft teal
    }
  },
  // Tag colors that complement the balance theme while remaining distinct from tab colors
  tagColors: {
    // Priority colors - rich, balanced tones with strong contrast
    priority: {
      high: '#B83232',         // Balanced Crimson (distinct from red tab)
      medium: '#996633',       // Amber Gold (distinct from all tabs)
      low: '#547133',          // Olive Green (distinct from green tab)
      quickWin: '#B8671D',     // Deep Amber (distinct from orange tab)
      custom: '#6E416F',       // Muted Plum (distinct from purple tab)
      default: '#666F7A'       // Neutral Slate Gray
    },
    // Goal type colors - thoughtful, aspirational colors
    goalType: {
      tbd: '#695C87',          // Dusty Lavender (distinct from purple tab)
      notPriority: '#9C4848',  // Dusty Cedar (distinct from red tab)
      wish: '#3D7266',         // Jungle Green (distinct from teal/green tabs)
      custom: '#79553D',       // Rustic Brown (distinct from all tabs)
      default: '#666F7A'       // Neutral Slate Gray
    },
    // Day of week - balanced color spectrum spanning the week
    dayOfWeek: {
      mon: '#9E4352',          // Mulberry (distinct from red tab)
      tue: '#8D7144',          // Honey Gold (distinct from all tabs)
      wed: '#456855',          // Forest Green (distinct from green tab)
      thu: '#2E7391',          // Sea Blue (distinct from blue tabs)
      fri: '#7C5876',          // Mauve (distinct from purple tab)
      sat: '#856B4D',          // Khaki Brown (distinct from all tabs)
      sun: '#BD5B35',          // Terra Cotta (distinct from orange tab)
      default: '#666F7A'       // Neutral Slate Gray
    },
    // Cleaning location - fresh, clean tones that aren't the same as cleaning tab
    cleaningLocation: {
      kitchen: '#748547',      // Avocado Green (distinct from green tab)
      bathroom: '#4E7891',     // Steel Blue (distinct from blue tabs)
      bedroom: '#8A6D59',      // Walnut Brown (distinct from all tabs)
      custom: '#996B77',       // Dusty Rose (distinct from all tabs)
      default: '#666F7A'       // Neutral Slate Gray
    },
    // Self-care type - nurturing, wellness-focused colors different from self-care tab
    selfCareType: {
      physical: '#5E8353',     // Healing Green (distinct from green tab)
      mental: '#6F6696',       // Tranquil Purple (distinct from purple tab)
      rest: '#7B8FA2',         // Relaxing Blue-Gray (distinct from blue tabs)
      joy: '#C17954',          // Warm Terracotta (distinct from orange tab)
      default: '#666F7A'       // Neutral Slate Gray
    },
    // Delegate type - collaborative, people-focused colors
    delegateType: {
      partner: '#4B7994',      // Trustworthy Blue (distinct from blue tabs)
      family: '#A56F4B',       // Warm Auburn (distinct from all tabs)
      friends: '#637A54',      // Sage Green (distinct from green tab)
      kids: '#8D5F75',         // Raspberry (distinct from all tabs)
      default: '#666F7A'       // Neutral Slate Gray
    },
    // Meal type colors - appetizing food-inspired tones distinct from meals tab
    mealType: {
      breakfast: '#B88746',    // Golden Toast (distinct from orange tab)
      lunch: '#557153',        // Fresh Salad Green (distinct from green tab)
      dinner: '#93514B',       // Brick Red (distinct from red tab)
      snack: '#877A52',        // Nutty Brown (distinct from all tabs)
      custom: '#736A8F',       // Muted Grape (distinct from purple tab)
      default: '#666F7A'       // Neutral Slate Gray
    }
  }
};