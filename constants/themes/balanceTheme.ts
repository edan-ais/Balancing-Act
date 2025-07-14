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
      high: {
        selected: '#B83232',     // Balanced Crimson (distinct from red tab)
        unselected: '#F8E8E8'    // Very light crimson
      },
      medium: {
        selected: '#996633',     // Amber Gold (distinct from all tabs)
        unselected: '#F5EFE3'    // Very light amber
      },
      low: {
        selected: '#547133',     // Olive Green (distinct from green tab)
        unselected: '#EDF1E8'    // Very light olive
      },
      quickWin: {
        selected: '#B8671D',     // Deep Amber (distinct from orange tab)
        unselected: '#F8F0E7'    // Very light amber
      },
      custom: {
        selected: '#6E416F',     // Muted Plum (distinct from purple tab)
        unselected: '#F0E9F0'    // Very light plum
      },
      default: {
        selected: '#666F7A',     // Neutral Slate Gray
        unselected: '#EFF1F3'    // Very light slate
      }
    },
    // Goal type colors - thoughtful, aspirational colors
    goalType: {
      tbd: {
        selected: '#695C87',     // Dusty Lavender (distinct from purple tab)
        unselected: '#EFEDF3'    // Very light lavender
      },
      notPriority: {
        selected: '#9C4848',     // Dusty Cedar (distinct from red tab)
        unselected: '#F5EAEA'    // Very light cedar
      },
      wish: {
        selected: '#3D7266',     // Jungle Green (distinct from teal/green tabs)
        unselected: '#E9F0EE'    // Very light jungle green
      },
      custom: {
        selected: '#79553D',     // Rustic Brown (distinct from all tabs)
        unselected: '#F1ECE9'    // Very light rustic brown
      },
      default: {
        selected: '#666F7A',     // Neutral Slate Gray
        unselected: '#EFF1F3'    // Very light slate
      }
    },
    // Day of week - balanced color spectrum spanning the week
    dayOfWeek: {
      mon: {
        selected: '#9E4352',     // Mulberry (distinct from red tab)
        unselected: '#F5E9EB'    // Very light mulberry
      },
      tue: {
        selected: '#8D7144',     // Honey Gold (distinct from all tabs)
        unselected: '#F3F0E9'    // Very light honey
      },
      wed: {
        selected: '#456855',     // Forest Green (distinct from green tab)
        unselected: '#EAEFED'    // Very light forest
      },
      thu: {
        selected: '#2E7391',     // Sea Blue (distinct from blue tabs)
        unselected: '#E8F0F4'    // Very light sea blue
      },
      fri: {
        selected: '#7C5876',     // Mauve (distinct from purple tab)
        unselected: '#F1ECF1'    // Very light mauve
      },
      sat: {
        selected: '#856B4D',     // Khaki Brown (distinct from all tabs)
        unselected: '#F2EFEA'    // Very light khaki
      },
      sun: {
        selected: '#BD5B35',     // Terra Cotta (distinct from orange tab)
        unselected: '#F8ECE8'    // Very light terra cotta
      },
      default: {
        selected: '#666F7A',     // Neutral Slate Gray
        unselected: '#EFF1F3'    // Very light slate
      }
    },
    // Cleaning location - fresh, clean tones that aren't the same as cleaning tab
    cleaningLocation: {
      kitchen: {
        selected: '#748547',     // Avocado Green (distinct from green tab)
        unselected: '#F1F3EA'    // Very light avocado
      },
      bathroom: {
        selected: '#4E7891',     // Steel Blue (distinct from blue tabs)
        unselected: '#EBF1F4'    // Very light steel blue
      },
      bedroom: {
        selected: '#8A6D59',     // Walnut Brown (distinct from all tabs)
        unselected: '#F3EFEC'    // Very light walnut
      },
      custom: {
        selected: '#996B77',     // Dusty Rose (distinct from all tabs)
        unselected: '#F5EFF1'    // Very light dusty rose
      },
      default: {
        selected: '#666F7A',     // Neutral Slate Gray
        unselected: '#EFF1F3'    // Very light slate
      }
    },
    // Self-care type - nurturing, wellness-focused colors different from self-care tab
    selfCareType: {
      physical: {
        selected: '#5E8353',     // Healing Green (distinct from green tab)
        unselected: '#EDF2EB'    // Very light healing green
      },
      mental: {
        selected: '#6F6696',     // Tranquil Purple (distinct from purple tab)
        unselected: '#F0EEF5'    // Very light tranquil purple
      },
      rest: {
        selected: '#7B8FA2',     // Relaxing Blue-Gray (distinct from blue tabs)
        unselected: '#F1F3F6'    // Very light blue-gray
      },
      joy: {
        selected: '#C17954',     // Warm Terracotta (distinct from orange tab)
        unselected: '#F8F0EC'    // Very light terracotta
      },
      default: {
        selected: '#666F7A',     // Neutral Slate Gray
        unselected: '#EFF1F3'    // Very light slate
      }
    },
    // Delegate type - collaborative, people-focused colors
    delegateType: {
      partner: {
        selected: '#4B7994',     // Trustworthy Blue (distinct from blue tabs)
        unselected: '#EBF1F4'    // Very light trustworthy blue
      },
      family: {
        selected: '#A56F4B',     // Warm Auburn (distinct from all tabs)
        unselected: '#F6F0EA'    // Very light auburn
      },
      friends: {
        selected: '#637A54',     // Sage Green (distinct from green tab)
        unselected: '#EEF1EC'    // Very light sage
      },
      kids: {
        selected: '#8D5F75',     // Raspberry (distinct from all tabs)
        unselected: '#F4EDF1'    // Very light raspberry
      },
      default: {
        selected: '#666F7A',     // Neutral Slate Gray
        unselected: '#EFF1F3'    // Very light slate
      }
    },
    // Meal type colors - appetizing food-inspired tones distinct from meals tab
    mealType: {
      breakfast: {
        selected: '#B88746',     // Golden Toast (distinct from orange tab)
        unselected: '#F7F2E9'    // Very light golden toast
      },
      lunch: {
        selected: '#557153',     // Fresh Salad Green (distinct from green tab)
        unselected: '#ECF0EC'    // Very light salad green
      },
      dinner: {
        selected: '#93514B',     // Brick Red (distinct from red tab)
        unselected: '#F4EBEA'    // Very light brick red
      },
      snack: {
        selected: '#877A52',     // Nutty Brown (distinct from all tabs)
        unselected: '#F3F1EB'    // Very light nutty brown
      },
      custom: {
        selected: '#736A8F',     // Muted Grape (distinct from purple tab)
        unselected: '#F0EFF4'    // Very light grape
      },
      default: {
        selected: '#666F7A',     // Neutral Slate Gray
        unselected: '#EFF1F3'    // Very light slate
      }
    }
  }
};