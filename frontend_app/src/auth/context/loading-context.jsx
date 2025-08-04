// LoadingContext.js
import React, { useMemo, useState, createContext } from 'react';

import { useTheme, useMediaQuery } from '@mui/material';

export const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [component, setComponent] = useState(null);
  const sizeTheme = useTheme();
  const isMobile = useMediaQuery(sizeTheme.breakpoints.down('md'));

  const value = useMemo(
    () => ({ loading, setLoading, error, setError, component, setComponent, isMobile }),
    [loading, error, component, isMobile]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}
