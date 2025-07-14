// Balance Theme - Enhanced color scheme with expanded options
export const balanceTheme = {
  name: 'Balance Theme',
  id: 'balance',
  backgroundImage: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  addTaskIcon: 'palette', // Add task icon for all tabs in this theme
  tabColors: {
    // Blue - Daily
    daily: {
      veryDark: '#1A2870', // Very dark blue
      shadow: '#2A3A96', // Deep shadow blue
      dark: '#4055C5', // Dark blue
      medium: '#7385E0', // Medium blue
      pastel: '#B9C5FA', // Light blue
      bgAlt: '#E5EBFF', // Very light blue
      highlight: '#5E7CFF', // Bright blue
      bg: '#F2F5FF', // Ultra light blue
      accent: '#D9E0FC', // Soft blue
      
      // Priority tags
      priorityHighSelected: '#B83232', // Balanced Crimson 
      priorityHighUnselected: '#F8E8E8', // Very light crimson
      priorityMediumSelected: '#996633', // Amber Gold
      priorityMediumUnselected: '#F5EFE3', // Very light amber
      priorityLowSelected: '#547133', // Olive Green
      priorityLowUnselected: '#EDF1E8', // Very light olive
      priorityQuickWinSelected: '#B8671D', // Deep Amber
      priorityQuickWinUnselected: '#F8F0E7', // Very light amber
      priorityCustomSelected: '#6E416F', // Muted Plum
      priorityCustomUnselected: '#F0E9F0', // Very light plum
      priorityDefaultSelected: '#666F7A', // Neutral Slate Gray
      priorityDefaultUnselected: '#EFF1F3' // Very light slate
    },

    // Green - Future
    future: {
      veryDark: '#0E5A28', // Very dark green
      shadow: '#1B7340', // Deep shadow green
      dark: '#2A9958', // Dark green
      medium: '#5ABC82', // Medium green
      pastel: '#A9E6C0', // Light green
      bgAlt: '#E1F7E9', // Very light green
      highlight: '#3AD174', // Bright green
      bg: '#F2FFF7', // Ultra light green
      accent: '#C9F2D9', // Soft green
      
      // Goal type tags
      goalTbdSelected: '#695C87', // Dusty Lavender
      goalTbdUnselected: '#EFEDF3', // Very light lavender
      goalNotPrioritySelected: '#9C4848', // Dusty Cedar
      goalNotPriorityUnselected: '#F5EAEA', // Very light cedar
      goalWishSelected: '#3D7266', // Jungle Green
      goalWishUnselected: '#E9F0EE', // Very light jungle green
      goalCustomSelected: '#79553D', // Rustic Brown
      goalCustomUnselected: '#F1ECE9', // Very light rustic brown
      goalDefaultSelected: '#666F7A', // Neutral Slate Gray
      goalDefaultUnselected: '#EFF1F3' // Very light slate
    },

    // Purple - Calendar
    calendar: {
      veryDark: '#3E2980', // Very dark purple
      shadow: '#5A3CA0', // Deep shadow purple
      dark: '#7E55D4', // Dark purple
      medium: '#A989E5', // Medium purple
      pastel: '#D6C5F5', // Light purple
      bgAlt: '#EEEAFF', // Very light purple
      highlight: '#9D6BFF', // Bright purple
      bg: '#F8F5FF', // Ultra light purple
      accent: '#E8DDFA' // Soft purple
    },

    // Orange - Meals
    meals: {
      veryDark: '#823E08', // Very dark orange
      shadow: '#A5500F', // Deep shadow orange
      dark: '#DC6B15', // Dark orange
      medium: '#EE9A59', // Medium orange
      pastel: '#F8D0B0', // Light orange
      bgAlt: '#FFEEDA', // Very light orange
      highlight: '#FF9C45', // Bright orange
      bg: '#FFF8F2', // Ultra light orange
      accent: '#FBE2CE', // Soft orange
      
      // Day of week tags - moved here from daily
      dayMonSelected: '#9E4352', // Mulberry
      dayMonUnselected: '#F5E9EB', // Very light mulberry
      dayTueSelected: '#8D7144', // Honey Gold
      dayTueUnselected: '#F3F0E9', // Very light honey
      dayWedSelected: '#456855', // Forest Green
      dayWedUnselected: '#EAEFED', // Very light forest
      dayThuSelected: '#2E7391', // Sea Blue
      dayThuUnselected: '#E8F0F4', // Very light sea blue
      dayFriSelected: '#7C5876', // Mauve
      dayFriUnselected: '#F1ECF1', // Very light mauve
      daySatSelected: '#856B4D', // Khaki Brown
      daySatUnselected: '#F2EFEA', // Very light khaki
      daySunSelected: '#BD5B35', // Terra Cotta
      daySunUnselected: '#F8ECE8', // Very light terra cotta
      dayDefaultSelected: '#666F7A', // Neutral Slate Gray
      dayDefaultUnselected: '#EFF1F3' // Very light slate
    },

    // Light Blue - Cleaning
    cleaning: {
      veryDark: '#0F4578', // Very dark light blue
      shadow: '#195999', // Deep shadow light blue
      dark: '#2578C8', // Dark light blue
      medium: '#65A5E8', // Medium light blue
      pastel: '#B2DAFD', // Light light blue
      bgAlt: '#E1EEFF', // Very light light blue
      highlight: '#4AA5FF', // Bright light blue
      bg: '#F2F8FF', // Ultra light light blue
      accent: '#D4E8FE', // Soft light blue
      
      // Cleaning location tags
      cleaningKitchenSelected: '#748547', // Avocado Green
      cleaningKitchenUnselected: '#F1F3EA', // Very light avocado
      cleaningBathroomSelected: '#4E7891', // Steel Blue
      cleaningBathroomUnselected: '#EBF1F4', // Very light steel blue
      cleaningBedroomSelected: '#8A6D59', // Walnut Brown
      cleaningBedroomUnselected: '#F3EFEC', // Very light walnut
      cleaningCustomSelected: '#996B77', // Dusty Rose
      cleaningCustomUnselected: '#F5EFF1', // Very light dusty rose
      cleaningDefaultSelected: '#666F7A', // Neutral Slate Gray
      cleaningDefaultUnselected: '#EFF1F3' // Very light slate
    },

    // Red - Self Care
    selfCare: {
      veryDark: '#8C1E1E', // Very dark red
      shadow: '#A82828', // Deep shadow red
      dark: '#D83A3A', // Dark red
      medium: '#EA7575', // Medium red
      pastel: '#FCBFBF', // Light red
      bgAlt: '#FFE8E8', // Very light red
      highlight: '#FF5757', // Bright red
      bg: '#FFF5F5', // Ultra light red
      accent: '#FBD8D8' // Soft red
    },

    // Teal - Delegate
    delegate: {
      veryDark: '#105551', // Very dark teal
      shadow: '#1A6D69', // Deep shadow teal
      dark: '#258F8A', // Dark teal
      medium: '#57BFB9', // Medium teal
      pastel: '#A9E3E0', // Light teal
      bgAlt: '#DEFAF8', // Very light teal
      highlight: '#2DCCBB', // Bright teal
      bg: '#F2FFFE', // Ultra light teal
      accent: '#C9F0EE', // Soft teal
      
      // Delegate type tags
      delegatePartnerSelected: '#4B7994', // Trustworthy Blue
      delegatePartnerUnselected: '#EBF1F4', // Very light trustworthy blue
      delegateFamilySelected: '#A56F4B', // Warm Auburn
      delegateFamilyUnselected: '#F6F0EA', // Very light auburn
      delegateFriendsSelected: '#637A54', // Sage Green
      delegateFriendsUnselected: '#EEF1EC', // Very light sage
      delegateKidsSelected: '#8D5F75', // Raspberry
      delegateKidsUnselected: '#F4EDF1', // Very light raspberry
      delegateDefaultSelected: '#666F7A', // Neutral Slate Gray
      delegateDefaultUnselected: '#EFF1F3' // Very light slate
    }
  }
};