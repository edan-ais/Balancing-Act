// Latte Theme - Warm and diverse coffee-inspired color scheme with expanded options
export const latteTheme = {
  name: 'Latte Theme',
  id: 'latte',
  backgroundImage: '/images/Cafe.png', // Main theme background image
  tabBackgrounds: {
    daily: '/images/latte-daily-background.jpg',
    future: '/images/latte-future-background.jpg',
    calendar: '/images/latte-calendar-background.jpg',
    meals: '/images/latte-meals-background.jpg',
    cleaning: '/images/latte-cleaning-background.jpg',
    selfCare: '/images/latte-selfcare-background.jpg',
    delegate: '/images/latte-delegate-background.jpg',
  },
  tabColors: {
    // Deep Espresso - rich dark brown with reddish undertones
    daily: {
      pastel: '#EAD9CF',   // Very light Deep Espresso with reddish undertones
      medium: '#7D5B47',   // Medium Deep Espresso for text and icons
      dark: '#2A1B0F',     // Very dark Deep Espresso
      shadow: '#1A110A',   // Shadow color (darker than dark)
      bg: '#FAF5F2',       // Ultra light background with reddish undertones
      bgAlt: '#F5EBE5',    // Alternative background (slightly darker)
      accent: '#3F2A1A',   // Deep Espresso (original)
      highlight: '#6E3B28'  // Brighter highlight version with reddish tone
    },
    // Hazelnut - medium neutral brown with golden undertones
    future: {
      pastel: '#E7DCCA',   // Very light Hazelnut with more gold tint
      medium: '#8F6E49',   // Medium Hazelnut for text and icons
      dark: '#5E452D',     // Very dark Hazelnut
      shadow: '#3D2D1E',   // Shadow color (darker than dark)
      bg: '#F9F6ED',       // Ultra light background with golden undertones
      bgAlt: '#F2EBD9',    // Alternative background (slightly darker)
      accent: '#A67C52',   // Hazelnut (original)
      highlight: '#BF8E5C'  // Brighter highlight version
    },
    // Caramel Gold - amber brown with orange undertones
    calendar: {
      pastel: '#F5E4C7',   // Very light Caramel with orange undertones
      medium: '#C0904F',   // Medium Caramel Gold for text and icons
      dark: '#8C6030',     // Very dark Caramel with more orange
      shadow: '#5E4020',   // Shadow color (darker than dark)
      bg: '#FDF8EE',       // Ultra light background with warm orange undertones
      bgAlt: '#F7EBD6',    // Alternative background (slightly darker)
      accent: '#D9B382',   // Caramel Gold (original)
      highlight: '#E9A456'  // Brighter highlight version with orange tone
    },
    // Rose Pink - soft pink with brown undertones
    meals: {
      pastel: '#F6DFDF',   // Very light Rose Pink
      medium: '#C98787',   // Medium Rose Pink for text and icons
      dark: '#A66868',     // Dark Rose Pink
      shadow: '#7A4D4D',   // Shadow color (darker than dark)
      bg: '#FDF7F7',       // Ultra light pink background
      bgAlt: '#FAECEC',    // Alternative background (slightly darker)
      accent: '#D9A6A6',   // Rose Pink (original)
      highlight: '#E6847F'  // Brighter highlight version
    },
    // Lavender Mist - soft purple with warm undertones
    cleaning: {
      pastel: '#E9E4F4',   // Very light Lavender Mist
      medium: '#A598C7',   // Medium Lavender Mist for text and icons
      dark: '#7B6C96',     // Dark Lavender Mist
      shadow: '#534A67',   // Shadow color (darker than dark)
      bg: '#F9F7FC',       // Ultra light lavender background
      bgAlt: '#F0ECF7',    // Alternative background (slightly darker)
      accent: '#C9BED9',   // Lavender Mist (original)
      highlight: '#AB95E0'  // Brighter highlight version
    },
    // Pistachio Green - muted sage green
    selfCare: {
      pastel: '#E4EEDE',   // Very light Pistachio Green
      medium: '#8EAB7D',   // Medium Pistachio Green for text and icons
      dark: '#5E7B4D',     // Dark Pistachio Green
      shadow: '#3F5333',   // Shadow color (darker than dark)
      bg: '#F6FAF4',       // Ultra light green background
      bgAlt: '#EAF2E3',    // Alternative background (slightly darker)
      accent: '#B5C9A8',   // Pistachio Green (original)
      highlight: '#97BF71'  // Brighter highlight version
    },
    // Vanilla Cream - warm off-white
    delegate: {
      pastel: '#F8F5EF',   // Very light Vanilla Cream
      medium: '#D1C7B7',   // Medium Vanilla Cream for text and icons
      dark: '#BFB3A2',     // Darker Vanilla Cream
      shadow: '#A69986',   // Shadow color (darker than dark)
      bg: '#FEFCF9',       // Ultra light cream background
      bgAlt: '#F7F3EB',    // Alternative background (slightly darker)
      accent: '#EAE0D0',   // More visible version of Vanilla Cream
      highlight: '#F2D8B6'  // Warmer highlight version
    }
  }
};