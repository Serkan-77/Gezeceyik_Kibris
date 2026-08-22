'use client';
// hooks/useGeolocation.ts
// Browser Geolocation API wrapper — SSR-safe.
// Returns position, loading state, error string, and a trigger function.

import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  supported: boolean;
}

export function useGeolocation() {
  const supported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
    supported,
  });

  const request = useCallback(() => {
    if (!supported) {
      setState((s) => ({
        ...s,
        error: 'Tarayıcınız konum özelliğini desteklemiyor.',
      }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          loading: false,
          error: null,
          supported: true,
        });
      },
      (err) => {
        let message = 'Konum bilgisi alınamadı.';
        if (err.code === 1) message = 'Konum erişimi reddedildi.';
        else if (err.code === 2) message = 'Konum bilgisi kullanılamıyor.';
        else if (err.code === 3) message = 'Konum isteği zaman aşımına uğradı.';
        setState((s) => ({ ...s, loading: false, error: message }));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [supported]);

  const clear = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      loading: false,
      error: null,
      supported,
    });
  }, [supported]);

  return { ...state, request, clear };
}
