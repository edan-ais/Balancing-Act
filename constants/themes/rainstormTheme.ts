// Rainstorm Theme - Cool and diverse rain-inspired color scheme with expanded options
export const rainstormTheme = {
  name: 'Rainstorm Theme',
  id: 'rainstorm',
  backgroundImage: 'https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  tabColors: {
    // Deep Ocean Blue - deep navy with cool undertones
    daily: {
      veryDark: '#0A1930',     // Very dark ocean blue
      shadow: '#102442',       // Deep shadow ocean blue
      dark: '#1E3A5F',         // Dark ocean blue
      accent: '#2A4A75',       // Rich ocean blue
      highlight: '#3B67A5',    // Bright ocean blue
      medium: '#6D8CB3',       // Medium ocean blue
      bgAlt: '#EEF4FC',        // Very light ocean blue
      pastel: '#E1E8F0',       // Light ocean blue
      bg: '#F7FAFF'            // Ultra light ocean blue
    },
    // Midnight Blue - medium-dark navy with cool undertones
    future: {
      veryDark: '#0F2442',     // Very dark midnight blue
      shadow: '#1B3A61',       // Deep shadow midnight blue
      dark: '#2F5585',         // Dark midnight blue
      accent: '#3D6499',       // Rich midnight blue
      highlight: '#4E7AB8',    // Bright midnight blue
      medium: '#7C95BB',       // Medium midnight blue
      bgAlt: '#EEF3FA',        // Very light midnight blue
      pastel: '#E3E9F2',       // Light midnight blue
      bg: '#F7FAFF'            // Ultra light midnight blue
    },
    // Rain Blue - medium blue with slate undertones
    calendar: {
      veryDark: '#1C3254',     // Very dark rain blue
      shadow: '#2E4B76',       // Deep shadow rain blue
      dark: '#4A6FA5',         // Dark rain blue
      accent: '#5D7FB3',       // Rich rain blue
      highlight: '#6E99D3',    // Bright rain blue
      medium: '#8BA4C9',       // Medium rain blue
      bgAlt: '#EEF3FB',        // Very light rain blue
      pastel: '#E8EDF6',       // Light rain blue
      bg: '#F7FAFF'            // Ultra light rain blue
    },
    // Slate Showers - medium gray with blue-purple undertones
    meals: {
      veryDark: '#252C39',     // Very dark slate shower
      shadow: '#333B4A',       // Deep shadow slate shower
      dark: '#4E586D',         // Dark slate shower
      accent: '#5F6882',       // Rich slate shower
      highlight: '#7784A3',    // Bright slate shower with purple-blue
      medium: '#8A91A1',       // Medium slate shower
      bgAlt: '#F0F1F5',        // Very light slate shower
      pastel: '#E9EAEF',       // Light slate shower
      bg: '#F8F9FB'            // Ultra light slate shower
    },
    // Misty Sky - light blue with gray undertones
    cleaning: {
      veryDark: '#3D5375',     // Very dark misty sky
      shadow: '#526E9D',       // Deep shadow misty sky
      dark: '#7B9DC9',         // Dark misty sky
      accent: '#8BACD3',       // Rich misty sky
      highlight: '#94B7E9',    // Bright misty sky
      medium: '#AABFDD',       // Medium misty sky
      bgAlt: '#F1F6FC',        // Very light misty sky
      pastel: '#EDF2F9',       // Light misty sky
      bg: '#F9FBFF'            // Ultra light misty sky
    },
    // Silver Droplet - soft silver-blue
    selfCare: {
      veryDark: '#4A5570',     // Very dark silver droplet
      shadow: '#677590',       // Deep shadow silver droplet
      dark: '#92A1B9',         // Dark silver droplet
      accent: '#A1ADC2',       // Rich silver droplet
      highlight: '#B0C0D9',    // Bright silver droplet
      medium: '#B7C0D1',       // Medium silver droplet
      bgAlt: '#F4F6FA',        // Very light silver droplet
      pastel: '#F0F3F7',       // Light silver droplet
      bg: '#FAFBFD'            // Ultra light silver droplet
    },
    // Storm Lavender - muted lavender with cool blue undertones
    delegate: {
      veryDark: '#3F4161',     // Very dark storm lavender
      shadow: '#575A7C',       // Deep shadow storm lavender
      dark: '#7E82A8',         // Dark storm lavender
      accent: '#8F93B6',       // Rich storm lavender
      highlight: '#9B9FCC',    // Bright storm lavender
      medium: '#AAACC7',       // Medium storm lavender
      bgAlt: '#F3F4F9',        // Very light storm lavender
      pastel: '#EEEFF6',       // Light storm lavender
      bg: '#FAFBFD'            // Ultra light storm lavender
    }
  },
  // Tag colors that complement the rainstorm theme but avoid using the same colors as the tabs
  tagColors: {
    // Priority colors - rich, saturated colors that pop against the cool backgrounds
    priority: {
      high: {
        selected: '#B83B3B',     // Rainy Day Red (distinct from all blues)
        unselected: '#F8E9E9'    // Very light rainy day red
      },
      medium: {
        selected: '#906B3E',     // Muddy Puddle Brown (distinct from all blues)
        unselected: '#F4F0E9'    // Very light muddy puddle
      },
      low: {
        selected: '#50883C',     // Rainy Forest Green (distinct from all blues)
        unselected: '#ECF3E9'    // Very light rainy forest
      },
      quickWin: {
        selected: '#C3773B',     // Thunder Orange (distinct from all blues)
        unselected: '#F9F1E9'    // Very light thunder
      },
      custom: {
        selected: '#855C87',     // Lightning Purple (distinct from storm lavender)
        unselected: '#F3ECF3'    // Very light lightning
      },
      default: {
        selected: '#657280',     // Neutral Rain Cloud Gray
        unselected: '#EFF1F3'    // Very light rain cloud
      }
    },
    // Goal type colors - muted but distinct
    goalType: {
      tbd: {
        selected: '#75558D',     // Deep Iris Purple (distinct from storm lavender)
        unselected: '#F1ECF4'    // Very light iris
      },
      notPriority: {
        selected: '#9C4B4B',     // Rust Red (distinct from all blues)
        unselected: '#F5EBEB'    // Very light rust
      },
      wish: {
        selected: '#36745E',     // Evergreen (distinct from all blues)
        unselected: '#E9F1ED'    // Very light evergreen
      },
      custom: {
        selected: '#8A683F',     // Wet Soil Brown (distinct from all blues)
        unselected: '#F3EFEA'    // Very light wet soil
      },
      default: {
        selected: '#657280',     // Neutral Rain Cloud Gray
        unselected: '#EFF1F3'    // Very light rain cloud
      }
    },
    // Day of week - colors inspired by changing weather conditions
    dayOfWeek: {
      mon: {
        selected: '#A15555',     // Wet Brick Red (distinct from all blues)
        unselected: '#F6ECEC'    // Very light wet brick
      },
      tue: {
        selected: '#7B6B43',     // Wet Sand (distinct from all blues)
        unselected: '#F2EFEA'    // Very light wet sand
      },
      wed: {
        selected: '#4F7347',     // Damp Moss (distinct from all blues)
        unselected: '#ECF1EA'    // Very light damp moss
      },
      thu: {
        selected: '#3F7380',     // Shallow Puddle Teal (distinct from ocean/rain blues)
        unselected: '#EAF1F3'    // Very light puddle teal
      },
      fri: {
        selected: '#73426B',     // Twilight Purple (distinct from storm lavender)
        unselected: '#F1EAEF'    // Very light twilight
      },
      sat: {
        selected: '#486A8D',     // Faded Denim (distinct shade from other blues)
        unselected: '#EBF0F4'    // Very light faded denim
      },
      sun: {
        selected: '#7D5E40',     // Wet Tree Bark (distinct from all blues)
        unselected: '#F2EDEA'    // Very light tree bark
      },
      default: {
        selected: '#657280',     // Neutral Rain Cloud Gray
        unselected: '#EFF1F3'    // Very light rain cloud
      }
    },
    // Cleaning location - colors inspired by indoor spaces during rain
    cleaningLocation: {
      kitchen: {
        selected: '#5F8064',     // Indoor Plant Green (distinct from all blues)
        unselected: '#EEF2EF'    // Very light plant green
      },
      bathroom: {
        selected: '#7C96A8',     // Foggy Mirror (distinct shade from misty sky)
        unselected: '#F1F4F6'    // Very light foggy mirror
      },
      bedroom: {
        selected: '#8A7969',     // Cozy Blanket Taupe (distinct from all blues)
        unselected: '#F3F1EF'    // Very light cozy blanket
      },
      custom: {
        selected: '#9D7277',     // Dusty Rose (distinct from all blues/purples)
        unselected: '#F5F0F1'    // Very light dusty rose
      },
      default: {
        selected: '#657280',     // Neutral Rain Cloud Gray
        unselected: '#EFF1F3'    // Very light rain cloud
      }
    },
    // Self-care type - soothing, nurturing colors for rainy day self-care
    selfCareType: {
      physical: {
        selected: '#6B7F55',     // Eucalyptus Leaf (distinct from all blues)
        unselected: '#F0F2EC'    // Very light eucalyptus
      },
      mental: {
        selected: '#6B5B7E',     // Calming Lavender (distinct from storm lavender)
        unselected: '#F0EDF2'    // Very light calming lavender
      },
      rest: {
        selected: '#7D7462',     // Warm Wool Gray (distinct from all blues)
        unselected: '#F2F1EE'    // Very light warm wool
      },
      joy: {
        selected: '#A0746A',     // Terracotta (distinct from all blues)
        unselected: '#F5F0EF'    // Very light terracotta
      },
      default: {
        selected: '#657280',     // Neutral Rain Cloud Gray
        unselected: '#EFF1F3'    // Very light rain cloud
      }
    },
    // Delegate type - warm, human tones to contrast with cool rain theme
    delegateType: {
      partner: {
        selected: '#665B83',     // Twilight Purple (distinct from storm lavender)
        unselected: '#EFEDF3'    // Very light twilight purple
      },
      family: {
        selected: '#8D6F58',     // Warm Wood (distinct from all blues)
        unselected: '#F4F0EC'    // Very light warm wood
      },
      friends: {
        selected: '#5A8377',     // Sage Green (distinct from all blues)
        unselected: '#EDF3F1'    // Very light sage
      },
      kids: {
        selected: '#8B6A6E',     // Muted Berry (distinct from all blues)
        unselected: '#F3EFF0'    // Very light muted berry
      },
      default: {
        selected: '#657280',     // Neutral Rain Cloud Gray
        unselected: '#EFF1F3'    // Very light rain cloud
      }
    },
    // Meal type colors - warm food-inspired tones to contrast with cool rain theme
    mealType: {
      breakfast: {
        selected: '#9D7E52',     // Toasted Oatmeal (distinct from all blues)
        unselected: '#F5F2EC'    // Very light toasted oatmeal
      },
      lunch: {
        selected: '#5C7C5E',     // Fresh Herb (distinct from all blues)
        unselected: '#EDF2ED'    // Very light fresh herb
      },
      dinner: {
        selected: '#8E5F5F',     // Mulled Wine Red (distinct from all blues)
        unselected: '#F4EDED'    // Very light mulled wine
      },
      snack: {
        selected: '#8A7960',     // Warm Cinnamon (distinct from all blues)
        unselected: '#F3F1ED'    // Very light cinnamon
      },
      custom: {
        selected: '#6A6B8D',     // Muted Plum (distinct from storm lavender)
        unselected: '#F0F0F4'    // Very light muted plum
      },
      default: {
        selected: '#657280',     // Neutral Rain Cloud Gray
        unselected: '#EFF1F3'    // Very light rain cloud
      }
    }
  }
};