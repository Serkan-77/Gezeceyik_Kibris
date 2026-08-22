// data/transit.ts
// ============================================================
// MOCK TRANSIT DATA — Northern Cyprus
// ALL records are SAMPLE/UNVERIFIED.
// verificationStatus: 'sample' on every record.
// Do NOT present these as real bus schedules or fares.
// Real GTFS/timetable data to be integrated in a future phase.
// ============================================================

export interface TransitStop {
  id: string;
  name: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  verificationStatus: 'sample';
}

export interface TransitRoute {
  id: string;
  name: string;
  stopIds: string[];
  /** Days of operation: 0=Sun, 1=Mon … 6=Sat */
  operatingDays: number[];
  /** Estimated first departure HH:MM */
  startTime: string;
  /** Estimated last departure HH:MM */
  endTime: string;
  /** Average minutes between buses */
  estimatedFrequencyMinutes: number;
  /** Flat fare in TRY (sample) */
  fareTRY: number;
  verificationStatus: 'sample';
}

export interface TransitConnection {
  routeId: string;
  fromStopId: string;
  toStopId: string;
  /** Estimated journey duration in minutes */
  estimatedDurationMinutes: number;
}

// ─── Stops ──────────────────────────────────────────────────

export const transitStops: TransitStop[] = [
  // Lefkoşa
  { id: 'lk-merkez', name: 'Lefkoşa Merkez Terminal', region: 'Lefkoşa', city: 'Lefkoşa', latitude: 35.1766, longitude: 33.3500, verificationStatus: 'sample' },
  { id: 'lk-buyukhan', name: 'Büyük Han Durağı', region: 'Lefkoşa', city: 'Lefkoşa', latitude: 35.1770, longitude: 33.3643, verificationStatus: 'sample' },

  // Girne
  { id: 'gi-merkez', name: 'Girne Merkez Terminal', region: 'Girne', city: 'Girne', latitude: 35.3350, longitude: 33.3200, verificationStatus: 'sample' },
  { id: 'gi-liman', name: 'Girne Liman Durağı', region: 'Girne', city: 'Girne', latitude: 35.3410, longitude: 33.3187, verificationStatus: 'sample' },
  { id: 'gi-bellapais', name: 'Bellapais Köy Durağı', region: 'Girne', city: 'Bellapais', latitude: 35.3090, longitude: 33.3471, verificationStatus: 'sample' },

  // Gazimağusa
  { id: 'fa-merkez', name: 'Gazimağusa Merkez Terminal', region: 'Gazimağusa', city: 'Gazimağusa', latitude: 35.1220, longitude: 33.9380, verificationStatus: 'sample' },
  { id: 'fa-othello', name: 'Othello Kalesi Durağı', region: 'Gazimağusa', city: 'Gazimağusa', latitude: 35.1243, longitude: 33.9416, verificationStatus: 'sample' },
  { id: 'fa-salamis', name: 'Salamis Antik Kent Durağı', region: 'Gazimağusa', city: 'Gazimağusa', latitude: 35.1795, longitude: 33.9107, verificationStatus: 'sample' },

  // İskele / Karpaz
  { id: 'is-merkez', name: 'İskele Merkez', region: 'İskele', city: 'İskele', latitude: 35.2905, longitude: 33.8943, verificationStatus: 'sample' },

  // Güzelyurt
  { id: 'gu-merkez', name: 'Güzelyurt Terminal', region: 'Güzelyurt', city: 'Güzelyurt', latitude: 35.2013, longitude: 32.9937, verificationStatus: 'sample' },

  // Lefke
  { id: 'le-merkez', name: 'Lefke Merkez', region: 'Lefke', city: 'Lefke', latitude: 35.1183, longitude: 32.8479, verificationStatus: 'sample' },
];

// ─── Routes ─────────────────────────────────────────────────

export const transitRoutes: TransitRoute[] = [
  {
    id: 'hat-lk-gi',
    name: 'Lefkoşa – Girne Ana Hattı',
    stopIds: ['lk-merkez', 'gi-merkez'],
    operatingDays: [1, 2, 3, 4, 5, 6], // Mon–Sat
    startTime: '07:00',
    endTime: '19:00',
    estimatedFrequencyMinutes: 30,
    fareTRY: 50,
    verificationStatus: 'sample',
  },
  {
    id: 'hat-lk-fa',
    name: 'Lefkoşa – Gazimağusa Ana Hattı',
    stopIds: ['lk-merkez', 'fa-merkez'],
    operatingDays: [1, 2, 3, 4, 5, 6],
    startTime: '07:00',
    endTime: '19:00',
    estimatedFrequencyMinutes: 45,
    fareTRY: 60,
    verificationStatus: 'sample',
  },
  {
    id: 'hat-lk-gu',
    name: 'Lefkoşa – Güzelyurt',
    stopIds: ['lk-merkez', 'gu-merkez'],
    operatingDays: [1, 2, 3, 4, 5],
    startTime: '08:00',
    endTime: '17:00',
    estimatedFrequencyMinutes: 60,
    fareTRY: 55,
    verificationStatus: 'sample',
  },
  {
    id: 'hat-gi-bellapais',
    name: 'Girne – Bellapais Servis',
    stopIds: ['gi-merkez', 'gi-bellapais'],
    operatingDays: [1, 2, 3, 4, 5, 6],
    startTime: '09:00',
    endTime: '17:00',
    estimatedFrequencyMinutes: 60,
    fareTRY: 25,
    verificationStatus: 'sample',
  },
  {
    id: 'hat-fa-salamis',
    name: 'Gazimağusa – Salamis Servis',
    stopIds: ['fa-merkez', 'fa-othello', 'fa-salamis'],
    operatingDays: [1, 2, 3, 4, 5, 6],
    startTime: '09:00',
    endTime: '16:00',
    estimatedFrequencyMinutes: 60,
    fareTRY: 25,
    verificationStatus: 'sample',
  },
];

// ─── Precomputed connections ─────────────────────────────────

export const transitConnections: TransitConnection[] = [
  { routeId: 'hat-lk-gi', fromStopId: 'lk-merkez', toStopId: 'gi-merkez', estimatedDurationMinutes: 40 },
  { routeId: 'hat-lk-gi', fromStopId: 'gi-merkez', toStopId: 'lk-merkez', estimatedDurationMinutes: 40 },
  { routeId: 'hat-lk-fa', fromStopId: 'lk-merkez', toStopId: 'fa-merkez', estimatedDurationMinutes: 55 },
  { routeId: 'hat-lk-fa', fromStopId: 'fa-merkez', toStopId: 'lk-merkez', estimatedDurationMinutes: 55 },
  { routeId: 'hat-lk-gu', fromStopId: 'lk-merkez', toStopId: 'gu-merkez', estimatedDurationMinutes: 50 },
  { routeId: 'hat-gi-bellapais', fromStopId: 'gi-merkez', toStopId: 'gi-bellapais', estimatedDurationMinutes: 15 },
  { routeId: 'hat-fa-salamis', fromStopId: 'fa-merkez', toStopId: 'fa-salamis', estimatedDurationMinutes: 20 },
  { routeId: 'hat-fa-salamis', fromStopId: 'fa-othello', toStopId: 'fa-salamis', estimatedDurationMinutes: 12 },
];
