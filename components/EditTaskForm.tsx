// Inside the component, update the color selection logic:
  
  // Map category to appropriate tab color key
  const getCategoryColorKey = () => {
    if (!initialTask) return 'daily';
    
    switch (initialTask.category) {
      case 'daily': return 'daily';
      case 'future': return 'future';
      case 'weekly': return 'calendar';
      case 'meal-prep': return 'meals';
      case 'cleaning': return 'cleaning';
      case 'self-care': return 'selfCare';
      case 'delegation': return 'delegate';
      case 'goals': return 'future'; // Goals can use future colors
      default: return 'daily'; // Fallback to daily colors
    }
  };
  
  // Get the appropriate theme colors based on category
  const tabColorKey = getCategoryColorKey();
  const tabColors = colors?.tabColors?.[tabColorKey] || {};
  
  // Use the tab colors from the theme, with fallback to direct props
  const veryDarkColor = tabColors.veryDark || '#333333';
  const shadowColor = tabColors.shadow || '#444444';
  const darkColor = tabColors.dark || accentColor || '#555555';
  const mediumColor = tabColors.medium || mediumColor || '#777777';
  const accentColor = tabColors.highlight || accentColor || '#999999';
  const highlightColor = tabColors.highlight || accentColor || '#AAAAAA';
  const bgAltColor = tabColors.bgAlt || bgColor || '#F0F0F0';
  const pastelColor = tabColors.pastel || pastelColor || '#E0E0E0';
  const bgColor = tabColors.bg || bgColor || '#FFFFFF';