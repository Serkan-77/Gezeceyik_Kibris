// components/home/WeatherBand.tsx
// Right below the category bar: real current conditions for the six
// regions the catalogue covers, from Open-Meteo (free, no API key — see
// lib/weather.ts). Same bar language as CategoryNav on purpose, so the
// two read as one wayfinding strip.

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { getRegionWeather } from '@/lib/weather';

export async function WeatherBand() {
  const weather = await getRegionWeather();
  if (weather.length === 0) return null;

  return (
    <section className="border-b border-line bg-paper" aria-label="Bölgelere göre bugünkü hava durumu">
      <Container>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {weather.map(({ region, temperatureC, label, Icon }, i) => (
            <li key={region} className={i > 0 ? 'border-l border-line' : ''}>
              <Reveal delayMs={i * 50}>
                <div className="flex items-center gap-3 px-4 py-5 sm:justify-center sm:px-3">
                  <Icon className="h-6 w-6 shrink-0 text-brand" />
                  <span>
                    <span className="block font-display text-sm font-semibold text-strong">{region}</span>
                    <span className="block font-mono text-[11px] tabular-nums text-subtle">
                      {temperatureC !== null ? `${temperatureC}°C` : '—'} · {label}
                    </span>
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
