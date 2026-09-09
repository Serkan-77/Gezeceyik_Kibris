import 'server-only';
// lib/weather.ts — current weather for the six regions the catalogue
// covers, from Open-Meteo (open-meteo.com): free, no API key, no
// attribution wall. One request fetches all regions at once — Open-Meteo
// accepts comma-separated lat/lon lists and returns an array of results
// in the same order.

import { ComponentType } from 'react';
import { Region } from '@/types/place';
import {
  IconProps,
  SunIcon,
  CloudIcon,
  CloudSunIcon,
  CloudFogIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudLightningIcon,
} from '@/components/ui/icons';

export interface RegionWeather {
  region: Region;
  /** Rounded current temperature in °C, or null if the API didn't return one. */
  temperatureC: number | null;
  label: string;
  Icon: ComponentType<IconProps>;
}

// Approximate district-centre coordinates — precise enough for a
// city-level "what's it like right now" reading.
const REGION_COORDS: { region: Region; lat: number; lon: number }[] = [
  { region: 'Girne', lat: 35.3396, lon: 33.3192 },
  { region: 'Lefkoşa', lat: 35.1856, lon: 33.3823 },
  { region: 'Gazimağusa', lat: 35.1176, lon: 33.9391 },
  { region: 'İskele', lat: 35.2872, lon: 33.8956 },
  { region: 'Güzelyurt', lat: 35.1989, lon: 32.9997 },
  { region: 'Lefke', lat: 35.1103, lon: 32.8497 },
];

// WMO weather codes (the vocabulary Open-Meteo's `weather_code` field
// uses) collapsed into the handful of conditions worth showing on a
// homepage strip.
function describeWeatherCode(code: number | undefined): { label: string; Icon: ComponentType<IconProps> } {
  switch (code) {
    case 0:
      return { label: 'Açık', Icon: SunIcon };
    case 1:
      return { label: 'Az bulutlu', Icon: SunIcon };
    case 2:
      return { label: 'Parçalı bulutlu', Icon: CloudSunIcon };
    case 3:
      return { label: 'Kapalı', Icon: CloudIcon };
    case 45:
    case 48:
      return { label: 'Sisli', Icon: CloudFogIcon };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return { label: 'Çiseleyen yağmur', Icon: CloudRainIcon };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return { label: 'Yağmurlu', Icon: CloudRainIcon };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return { label: 'Karlı', Icon: CloudSnowIcon };
    case 95:
    case 96:
    case 99:
      return { label: 'Gök gürültülü fırtına', Icon: CloudLightningIcon };
    default:
      return { label: 'Hava durumu', Icon: CloudIcon };
  }
}

interface OpenMeteoCurrent {
  current?: { temperature_2m?: number; weather_code?: number };
}

/**
 * Current conditions for every region, in REGION_COORDS order. Returns an
 * empty array (never throws) if Open-Meteo is unreachable — the homepage
 * simply omits the weather strip that day rather than failing to render.
 */
export async function getRegionWeather(): Promise<RegionWeather[]> {
  const lat = REGION_COORDS.map((r) => r.lat).join(',');
  const lon = REGION_COORDS.map((r) => r.lon).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Open-Meteo request failed: ${res.status}`);
    const data: OpenMeteoCurrent | OpenMeteoCurrent[] = await res.json();
    const results = Array.isArray(data) ? data : [data];

    return REGION_COORDS.map((r, i) => {
      const current = results[i]?.current;
      const { label, Icon } = describeWeatherCode(current?.weather_code);
      const temperatureC = typeof current?.temperature_2m === 'number' ? Math.round(current.temperature_2m) : null;
      return { region: r.region, temperatureC, label, Icon };
    });
  } catch (err) {
    console.warn('[lib/weather] Open-Meteo fetch failed:', err instanceof Error ? err.message : err);
    return [];
  }
}
