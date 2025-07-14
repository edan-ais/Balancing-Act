// Latte Theme - Warm and diverse coffee-inspired color scheme with expanded options
export const latteTheme = {
  name: 'Latte Theme',
  id: 'latte',
  backgroundImage: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  tabColors: {
    // Deep Espresso - rich dark brown with reddish undertones
    daily: {
      veryDark: '#100A06',     // Very dark espresso
      shadow: '#1A110A',       // Deep shadow espresso
      dark: '#2A1B0F',         // Dark espresso
      accent: '#3F2A1A',       // Rich espresso
      highlight: '#6E3B28',    // Bright reddish espresso
      medium: '#7D5B47',       // Medium espresso
      bgAlt: '#F5EBE5',        // Very light espresso
      pastel: '#EAD9CF',       // Light espresso
      bg: '#FAF5F2'            // Ultra light espresso
    },
    // Hazelnut - medium neutral brown with golden undertones
    future: {
      veryDark: '#2A1F13',     // Very dark hazelnut
      shadow: '#3D2D1E',       // Deep shadow hazelnut
      dark: '#5E452D',         // Dark hazelnut
      medium: '#8F6E49',       // Medium hazelnut
      accent: '#A67C52',       // Rich hazelnut
      highlight: '#BF8E5C',    // Bright hazelnut
      bgAlt: '#F2EBD9',        // Very light hazelnut
      pastel: '#E7DCCA',       // Light hazelnut
      bg: '#F9F6ED'            // Ultra light hazelnut
    },
    // Caramel Gold - amber brown with orange undertones
    calendar: {
      veryDark: '#422E18',     // Very dark caramel
      shadow: '#5E4020',       // Deep shadow caramel
      dark: '#8C6030',         // Dark caramel
      medium: '#C0904F',       // Medium caramel
      accent: '#D9B382',       // Rich caramel
      highlight: '#E9A456',    // Bright orange caramel
      bgAlt: '#F7EBD6',        // Very light caramel
      pastel: '#F5E4C7',       // Light caramel
      bg: '#FDF8EE'            // Ultra light caramel
    },
    // Rose Pink - soft pink with brown undertones
    meals: {
      veryDark: '#593636',     // Very dark rose pink
      shadow: '#7A4D4D',       // Deep shadow rose pink
      dark: '#A66868',         // Dark rose pink
      medium: '#C98787',       // Medium rose pink
      accent: '#D9A6A6',       // Rich rose pink
      highlight: '#E6847F',    // Bright rose pink
      bgAlt: '#FAECEC',        // Very light rose pink
      pastel: '#F6DFDF',       // Light rose pink
      bg: '#FDF7F7'            // Ultra light rose pink
    },
    // Lavender Mist - soft purple with warm undertones
    cleaning: {
      veryDark: '#3D364E',     // Very dark lavender
      shadow: '#534A67',       // Deep shadow lavender
      dark: '#7B6C96',         // Dark lavender
      medium: '#A598C7',       // Medium lavender
      accent: '#C9BED9',       // Rich lavender
      highlight: '#AB95E0',    // Bright lavender
      bgAlt: '#F0ECF7',        // Very light lavender
      pastel: '#E9E4F4',       // Light lavender
      bg: '#F9F7FC'            // Ultra light lavender
    },
    // Pistachio Green - muted sage green
    selfCare: {
      veryDark: '#2A3820',     // Very dark pistachio
      shadow: '#3F5333',       // Deep shadow pistachio
      dark: '#5E7B4D',         // Dark pistachio
      medium: '#8EAB7D',       // Medium pistachio
      accent: '#B5C9A8',       // Rich pistachio
      highlight: '#97BF71',    // Bright pistachio
      bgAlt: '#EAF2E3',        // Very light pistachio
      pastel: '#E4EEDE',       // Light pistachio
      bg: '#F6FAF4'            // Ultra light pistachio
    },
    // Vanilla Cream - warm off-white
    delegate: {
      veryDark: '#8A7F6F',     // Very dark vanilla cream
      shadow: '#A69986',       // Deep shadow vanilla cream
      dark: '#BFB3A2',         // Dark vanilla cream
      medium: '#D1C7B7',       // Medium vanilla cream
      accent: '#EAE0D0',       // Rich vanilla cream
      highlight: '#F2D8B6',    // Bright vanilla cream
      bgAlt: '#F7F3EB',        // Very light vanilla cream
      pastel: '#F8F5EF',       // Light vanilla cream
      bg: '#FEFCF9'            // Ultra light vanilla cream
    }
  },
  // Tag colors that complement the coffee theme but avoid using the same colors as the tabs
  tagColors: {
    // Priority colors - warm, rich tones that stand out
    priority: {
      high: {
        selected: '#9D2933',     // Cranberry red (avoiding espresso brown)
        unselected: '#F6E7E8'    // Very light cranberry
      },
      medium: {
        selected: '#4A6741',     // Forest green (avoiding hazelnut)
        unselected: '#EBEFEA'    // Very light forest green
      },
      low: {
        selected: '#4B6584',     // Steel blue (avoiding caramel)
        unselected: '#EBEFF4'    // Very light steel blue
      },
      quickWin: {
        selected: '#E67E22',     // Pumpkin orange (distinct from all tabs)
        unselected: '#FCF2E8'    // Very light pumpkin
      },
      custom: {
        selected: '#8B6B8C',     // Muted purple (distinct from lavender)
        unselected: '#F3EEF3'    // Very light muted purple
      },
      default: {
        selected: '#8A7F6F',     // Neutral dark vanilla
        unselected: '#F3F1EF'    // Very light vanilla
      }
    },
    // Goal type colors - muted but distinct
    goalType: {
      tbd: {
        selected: '#6F4E7C',     // Muted grape (distinct from lavender)
        unselected: '#F0EBF2'    // Very light grape
      },
      notPriority: {
        selected: '#BA4A4A',     // Brick red (distinct from rose pink)
        unselected: '#F8EBEB'    // Very light brick red
      },
      wish: {
        selected: '#5B6F4C',     // Olive green (distinct from pistachio)
        unselected: '#EDEFE9'    // Very light olive
      },
      custom: {
        selected: '#996B21',     // Bronze (distinct from hazelnut/caramel)
        unselected: '#F5F0E8'    // Very light bronze
      },
      default: {
        selected: '#8A7F6F',     // Neutral dark vanilla
        unselected: '#F3F1EF'    // Very light vanilla
      }
    },
    // Day of week - warm spectrum that flows through the week
    dayOfWeek: {
      mon: {
        selected: '#96514D',     // Terracotta (distinct from rose pink)
        unselected: '#F5ECEB'    // Very light terracotta
      },
      tue: {
        selected: '#AD7D4C',     // Amber (distinct from caramel)
        unselected: '#F7F2EA'    // Very light amber
      },
      wed: {
        selected: '#7D9148',     // Avocado (distinct from pistachio)
        unselected: '#F2F4EA'    // Very light avocado
      },
      thu: {
        selected: '#5A8A72',     // Sage (distinct from pistachio)
        unselected: '#EDF3F0'    // Very light sage
      },
      fri: {
        selected: '#577E9F',     // Denim blue (distinct from all tabs)
        unselected: '#ECF2F6'    // Very light denim
      },
      sat: {
        selected: '#7A6C93',     // Dusty purple (distinct from lavender)
        unselected: '#F1EFF4'    // Very light dusty purple
      },
      sun: {
        selected: '#B25D85',     // Raspberry (distinct from rose pink)
        unselected: '#F7EDF2'    // Very light raspberry
      },
      default: {
        selected: '#8A7F6F',     // Neutral dark vanilla
        unselected: '#F3F1EF'    // Very light vanilla
      }
    },
    // Cleaning location - fresh and clean tones
    cleaningLocation: {
      kitchen: {
        selected: '#D4A04F',     // Golden honey (distinct from caramel)
        unselected: '#FAF6EB'    // Very light honey
      },
      bathroom: {
        selected: '#6487A5',     // Powder blue (distinct from all tabs)
        unselected: '#EEF3F6'    // Very light powder blue
      },
      bedroom: {
        selected: '#8D6E63',     // Coffee brown (distinct from espresso/hazelnut)
        unselected: '#F3EFED'    // Very light coffee
      },
      custom: {
        selected: '#AF6458',     // Terra cotta (distinct from rose pink)
        unselected: '#F7EDEC'    // Very light terra cotta
      },
      default: {
        selected: '#8A7F6F',     // Neutral dark vanilla
        unselected: '#F3F1EF'    // Very light vanilla
      }
    },
    // Self-care type - gentle nurturing colors
    selfCareType: {
      physical: {
        selected: '#778F67',     // Eucalyptus (distinct from pistachio)
        unselected: '#F1F4EE'    // Very light eucalyptus
      },
      mental: {
        selected: '#7D6D9C',     // Periwinkle (distinct from lavender)
        unselected: '#F1EFF6'    // Very light periwinkle
      },
      rest: {
        selected: '#669999',     // Seafoam (distinct from all tabs)
        unselected: '#EEF5F5'    // Very light seafoam
      },
      joy: {
        selected: '#CF745F',     // Coral (distinct from rose pink)
        unselected: '#F9F0ED'    // Very light coral
      },
      default: {
        selected: '#8A7F6F',     // Neutral dark vanilla
        unselected: '#F3F1EF'    // Very light vanilla
      }
    },
    // Delegate type - earthy tones that feel reassuring
    delegateType: {
      partner: {
        selected: '#7D93B2',     // Steel blue (distinct from all tabs)
        unselected: '#F1F4F7'    // Very light steel blue
      },
      family: {
        selected: '#C7874F',     // Copper (distinct from caramel)
        unselected: '#F9F2EB'    // Very light copper
      },
      friends: {
        selected: '#8B7D7B',     // Taupe (distinct from vanilla)
        unselected: '#F3F1F1'    // Very light taupe
      },
      kids: {
        selected: '#8DAA7B',     // Moss green (distinct from pistachio)
        unselected: '#F3F6F1'    // Very light moss
      },
      default: {
        selected: '#8A7F6F',     // Neutral dark vanilla
        unselected: '#F3F1EF'    // Very light vanilla
      }
    },
    // Meal type colors - appetizing food-inspired tones
    mealType: {
      breakfast: {
        selected: '#D99E6A',     // Toast brown (distinct from hazelnut)
        unselected: '#FAF5EE'    // Very light toast
      },
      lunch: {
        selected: '#7D9457',     // Olive (distinct from pistachio)
        unselected: '#F1F4EC'    // Very light olive
      },
      dinner: {
        selected: '#A05B53',     // Tomato (distinct from rose pink)
        unselected: '#F6ECEB'    // Very light tomato
      },
      snack: {
        selected: '#BE9E6F',     // Honey gold (distinct from caramel)
        unselected: '#F8F5EF'    // Very light honey gold
      },
      custom: {
        selected: '#8D7C9D',     // Dusky purple (distinct from lavender)
        unselected: '#F3F1F5'    // Very light dusky purple
      },
      default: {
        selected: '#8A7F6F',     // Neutral dark vanilla
        unselected: '#F3F1EF'    // Very light vanilla
      }
    }
  }
};