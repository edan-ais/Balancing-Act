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
      bg: '#FAF5F2',           // Ultra light espresso
      
      // Priority tags
      priorityHighSelected: '#9D2933',     // Cranberry red (avoiding espresso brown)
      priorityHighUnselected: '#F6E7E8',    // Very light cranberry
      priorityMediumSelected: '#4A6741',     // Forest green (avoiding hazelnut)
      priorityMediumUnselected: '#EBEFEA',    // Very light forest green
      priorityLowSelected: '#4B6584',     // Steel blue (avoiding caramel)
      priorityLowUnselected: '#EBEFF4',    // Very light steel blue
      priorityQuickWinSelected: '#E67E22',     // Pumpkin orange (distinct from all tabs)
      priorityQuickWinUnselected: '#FCF2E8',    // Very light pumpkin
      priorityCustomSelected: '#8B6B8C',     // Muted purple (distinct from lavender)
      priorityCustomUnselected: '#F3EEF3',    // Very light muted purple
      priorityDefaultSelected: '#8A7F6F',     // Neutral dark vanilla
      priorityDefaultUnselected: '#F3F1EF'    // Very light vanilla
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
      bg: '#F9F6ED',           // Ultra light hazelnut
      
      // Goal type tags
      goalTbdSelected: '#6F4E7C',     // Muted grape (distinct from lavender)
      goalTbdUnselected: '#F0EBF2',    // Very light grape
      goalNotPrioritySelected: '#BA4A4A',     // Brick red (distinct from rose pink)
      goalNotPriorityUnselected: '#F8EBEB',    // Very light brick red
      goalWishSelected: '#5B6F4C',     // Olive green (distinct from pistachio)
      goalWishUnselected: '#EDEFE9',    // Very light olive
      goalCustomSelected: '#996B21',     // Bronze (distinct from hazelnut/caramel)
      goalCustomUnselected: '#F5F0E8',    // Very light bronze
      goalDefaultSelected: '#8A7F6F',     // Neutral dark vanilla
      goalDefaultUnselected: '#F3F1EF'    // Very light vanilla
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
      bg: '#FDF7F7',           // Ultra light rose pink
      
      // Day of week tags
      dayMonSelected: '#96514D',     // Terracotta (distinct from rose pink)
      dayMonUnselected: '#F5ECEB',    // Very light terracotta
      dayTueSelected: '#AD7D4C',     // Amber (distinct from caramel)
      dayTueUnselected: '#F7F2EA',    // Very light amber
      dayWedSelected: '#7D9148',     // Avocado (distinct from pistachio)
      dayWedUnselected: '#F2F4EA',    // Very light avocado
      dayThuSelected: '#5A8A72',     // Sage (distinct from pistachio)
      dayThuUnselected: '#EDF3F0',    // Very light sage
      dayFriSelected: '#577E9F',     // Denim blue (distinct from all tabs)
      dayFriUnselected: '#ECF2F6',    // Very light denim
      daySatSelected: '#7A6C93',     // Dusty purple (distinct from lavender)
      daySatUnselected: '#F1EFF4',    // Very light dusty purple
      daySunSelected: '#B25D85',     // Raspberry (distinct from rose pink)
      daySunUnselected: '#F7EDF2',    // Very light raspberry
      dayDefaultSelected: '#8A7F6F',     // Neutral dark vanilla
      dayDefaultUnselected: '#F3F1EF'    // Very light vanilla
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
      bg: '#F9F7FC',           // Ultra light lavender
      
      // Cleaning location tags
      cleaningKitchenSelected: '#D4A04F',     // Golden honey (distinct from caramel)
      cleaningKitchenUnselected: '#FAF6EB',    // Very light honey
      cleaningBathroomSelected: '#6487A5',     // Powder blue (distinct from all tabs)
      cleaningBathroomUnselected: '#EEF3F6',    // Very light powder blue
      cleaningBedroomSelected: '#8D6E63',     // Coffee brown (distinct from espresso/hazelnut)
      cleaningBedroomUnselected: '#F3EFED',    // Very light coffee
      cleaningCustomSelected: '#AF6458',     // Terra cotta (distinct from rose pink)
      cleaningCustomUnselected: '#F7EDEC',    // Very light terra cotta
      cleaningDefaultSelected: '#8A7F6F',     // Neutral dark vanilla
      cleaningDefaultUnselected: '#F3F1EF'    // Very light vanilla
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
      // Removed selfCare type tags as they are required tags
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
      bg: '#FEFCF9',           // Ultra light vanilla cream
      
      // Delegate type tags
      delegatePartnerSelected: '#7D93B2',     // Steel blue (distinct from all tabs)
      delegatePartnerUnselected: '#F1F4F7',    // Very light steel blue
      delegateFamilySelected: '#C7874F',     // Copper (distinct from caramel)
      delegateFamilyUnselected: '#F9F2EB',    // Very light copper
      delegateFriendsSelected: '#8B7D7B',     // Taupe (distinct from vanilla)
      delegateFriendsUnselected: '#F3F1F1',    // Very light taupe
      delegateKidsSelected: '#8DAA7B',     // Moss green (distinct from pistachio)
      delegateKidsUnselected: '#F3F6F1',    // Very light moss
      delegateDefaultSelected: '#8A7F6F',     // Neutral dark vanilla
      delegateDefaultUnselected: '#F3F1EF'    // Very light vanilla
    }
  }
};