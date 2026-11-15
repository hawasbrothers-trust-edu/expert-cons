import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { SiteCmsConfig } from '../types';

interface SiteCmsContextValue {
  cms: SiteCmsConfig;
  refreshCms: () => Promise<void>;
}

const SiteCmsContext = createContext<SiteCmsContextValue | undefined>(undefined);

export function SiteCmsProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<SiteCmsConfig>(() => api.getSiteCmsConfigSync());

  const refreshCms = useCallback(async () => {
    const latest = await api.getSiteCmsConfig();
    setCms(latest);
  }, []);

  useEffect(() => {
    refreshCms();
    const handleSync = () => {
      setCms(api.getSiteCmsConfigSync());
    };
    window.addEventListener('expert:cms-updated', handleSync);
    window.addEventListener('expert:production-media-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('expert:cms-updated', handleSync);
      window.removeEventListener('expert:production-media-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refreshCms]);

  return (
    <SiteCmsContext.Provider value={{ cms, refreshCms }}>{children}</SiteCmsContext.Provider>
  );
}

export function useSiteCms() {
  const ctx = useContext(SiteCmsContext);
  if (!ctx) {
    throw new Error('useSiteCms must be used within SiteCmsProvider');
  }
  return ctx;
}
