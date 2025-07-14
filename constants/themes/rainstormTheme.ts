// Rainstorm Theme - Cool and diverse rain-inspired color scheme with expanded options
export const rainstormTheme = {
  name: 'Rainstorm Theme',
  id: 'rainstorm',
  backgroundImage: 'https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  addTaskIcon: 'cloud-rain', // Added rain cloud icon for the Rainstorm theme
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
      bg: '#F7FAFF',           // Ultra light ocean blue
      
      // Priority tags
      priorityHighSelected: '#B83B3B',     // Rainy Day Red (distinct from all blues)
      priorityHighUnselected: '#F8E9E9',    // Very light rainy day red
      priorityMediumSelected: '#906B3E',     // Muddy Puddle Brown (distinct from all blues)
      priorityMediumUnselected: '#F4F0E9',    // Very light muddy puddle
      priorityLowSelected: '#50883C',     // Rainy Forest Green (distinct from all blues)
      priorityLowUnselected: '#ECF3E9',    // Very light rainy forest
      priorityQuickWinSelected: '#C3773B',     // Thunder Orange (distinct from all blues)
      priorityQuickWinUnselected: '#F9F1E9',    // Very light thunder
      priorityCustomSelected: '#855C87',     // Lightning Purple (distinct from storm lavender)
      priorityCustomUnselected: '#F3ECF3',    // Very light lightning
      priorityDefaultSelected: '#657280',     // Neutral Rain Cloud Gray
      priorityDefaultUnselected: '#EFF1F3'    // Very light rain cloud
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
      bg: '#F7FAFF',           // Ultra light midnight blue
      
      // Goal type tags
      goalTbdSelected: '#75558D',     // Deep Iris Purple (distinct from storm lavender)
      goalTbdUnselected: '#F1ECF4',    // Very light iris
      goalNotPrioritySelected: '#9C4B4B',     // Rust Red (distinct from all blues)
      goalNotPriorityUnselected: '#F5EBEB',    // Very light rust
      goalWishSelected: '#36745E',     // Evergreen (distinct from all blues)
      goalWishUnselected: '#E9F1ED',    // Very light evergreen
      goalCustomSelected: '#8A683F',     // Wet Soil Brown (distinct from all blues)
      goalCustomUnselected: '#F3EFEA',    // Very light wet soil
      goalDefaultSelected: '#657280',     // Neutral Rain Cloud Gray
      goalDefaultUnselected: '#EFF1F3'    // Very light rain cloud
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
      bg: '#F8F9FB',           // Ultra light slate shower
      
      // Day of week tags
      dayMonSelected: '#A15555',     // Wet Brick Red (distinct from all blues)
      dayMonUnselected: '#F6ECEC',    // Very light wet brick
      dayTueSelected: '#7B6B43',     // Wet Sand (distinct from all blues)
      dayTueUnselected: '#F2EFEA',    // Very light wet sand
      dayWedSelected: '#4F7347',     // Damp Moss (distinct from all blues)
      dayWedUnselected: '#ECF1EA',    // Very light damp moss
      dayThuSelected: '#3F7380',     // Shallow Puddle Teal (distinct from ocean/rain blues)
      dayThuUnselected: '#EAF1F3',    // Very light puddle teal
      dayFriSelected: '#73426B',     // Twilight Purple (distinct from storm lavender)
      dayFriUnselected: '#F1EAEF',    // Very light twilight
      daySatSelected: '#486A8D',     // Faded Denim (distinct shade from other blues)
      daySatUnselected: '#EBF0F4',    // Very light faded denim
      daySunSelected: '#7D5E40',     // Wet Tree Bark (distinct from all blues)
      daySunUnselected: '#F2EDEA',    // Very light tree bark
      dayDefaultSelected: '#657280',     // Neutral Rain Cloud Gray
      dayDefaultUnselected: '#EFF1F3'    // Very light rain cloud
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
      bg: '#F9FBFF',           // Ultra light misty sky
      
      // Cleaning location tags
      cleaningKitchenSelected: '#5F8064',     // Indoor Plant Green (distinct from all blues)
      cleaningKitchenUnselected: '#EEF2EF',    // Very light plant green
      cleaningBathroomSelected: '#7C96A8',     // Foggy Mirror (distinct shade from misty sky)
      cleaningBathroomUnselected: '#F1F4F6',    // Very light foggy mirror
      cleaningBedroomSelected: '#8A7969',     // Cozy Blanket Taupe (distinct from all blues)
      cleaningBedroomUnselected: '#F3F1EF',    // Very light cozy blanket
      cleaningCustomSelected: '#9D7277',     // Dusty Rose (distinct from all blues/purples)
      cleaningCustomUnselected: '#F5F0F1',    // Very light dusty rose
      cleaningDefaultSelected: '#657280',     // Neutral Rain Cloud Gray
      cleaningDefaultUnselected: '#EFF1F3'    // Very light rain cloud
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
      // Removed selfCare type tags as they are required tags
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
      bg: '#FAFBFD',           // Ultra light storm lavender
      
      // Delegate type tags
      delegatePartnerSelected: '#665B83',     // Twilight Purple (distinct from storm lavender)
      delegatePartnerUnselected: '#EFEDF3',    // Very light twilight purple
      delegateFamilySelected: '#8D6F58',     // Warm Wood (distinct from all blues)
      delegateFamilyUnselected: '#F4F0EC',    // Very light warm wood
      delegateFriendsSelected: '#5A8377',     // Sage Green (distinct from all blues)
      delegateFriendsUnselected: '#EDF3F1',    // Very light sage
      delegateKidsSelected: '#8B6A6E',     // Muted Berry (distinct from all blues)
      delegateKidsUnselected: '#F3EFF0',    // Very light muted berry
      delegateDefaultSelected: '#657280',     // Neutral Rain Cloud Gray
      delegateDefaultUnselected: '#EFF1F3'    // Very light rain cloud
    }
  }
};