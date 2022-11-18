import * as React from 'react';
import { useTheme, darkTheme } from '@strapi/design-system';

const useIsDarkMode = () => {
  const theme = useTheme();

  return theme.colors.neutral0 === darkTheme.colors.neutral0;
};

export default useIsDarkMode;
