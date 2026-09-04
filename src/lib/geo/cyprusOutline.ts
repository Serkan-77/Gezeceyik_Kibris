// lib/geo/cyprusOutline.ts
// Real, simplified coastline of Cyprus (the whole island — the physical
// landmass, not the political partition), derived from Natural Earth's
// 10m physical land dataset (ne_10m_land.geojson, public domain) and
// reduced with Douglas–Peucker simplification (epsilon ≈ 0.22% of the
// projected width) from 202 to 100 points. This is real geography, not a
// decorative squiggle — see the Karpaz peninsula's length and the north
// coast's actual bays in the path below.
//
// Projection: equirectangular with a cos(latitude) correction on the x
// axis (flat enough at this scale/latitude to be visually accurate without
// a full map projection library). `projectLonLat` uses the exact same
// constants used to build CYPRUS_PATH, so any place's real lat/long lands
// in the correct spot relative to the drawn coastline.

export const CYPRUS_VIEWBOX_WIDTH = 1000;
export const CYPRUS_VIEWBOX_HEIGHT = 602.6;
export const CYPRUS_VIEWBOX = `0 0 ${CYPRUS_VIEWBOX_WIDTH} ${CYPRUS_VIEWBOX_HEIGHT}`;

// Projection constants — must match the ones used to derive CYPRUS_PATH.
const LON_MIN = 32.271739;
const LAT_MAX = 35.691962;
const COS_LAT = 0.8178459671943256;
const SCALE = 517.9276574244275;
const PAD = 0.02;

/** Project a real [longitude, latitude] pair into CYPRUS_VIEWBOX coordinate space. */
export function projectLonLat(lon: number, lat: number): [number, number] {
  const x = (lon - LON_MIN + PAD) * COS_LAT * SCALE;
  const y = (LAT_MAX - lat + PAD) * SCALE;
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}

export const CYPRUS_PATH =
  'M971.1,17.4 L991.5,10.4 L985.7,17.4 L983.2,35.4 L970.3,38.7 L927.5,66.5 L889.8,99.1 L798.9,153.7 ' +
  'L776.7,177.2 L765.5,200.9 L759.1,205.5 L728.4,202.3 L720.1,207.4 L708.2,224.5 L701.3,242.9 L698.1,283.6 ' +
  'L720.9,305.2 L731.5,323.4 L762.2,351.6 L771.6,374.9 L782.5,386.8 L755.2,383 L745.4,375.2 L722.4,378.1 ' +
  'L702.5,384.2 L682.2,400.9 L657.6,382.9 L639.1,379.3 L620.8,380.3 L605.1,386.2 L590.9,404 L585.8,421.8 ' +
  'L584.9,445.1 L578.3,448.9 L573.5,461.1 L547.5,464.6 L534.3,479.9 L502.8,491.6 L492.8,493.9 L486.5,486.1 ' +
  'L486,500.7 L474,508.1 L442.6,514.7 L427.1,523.9 L390.5,521.5 L353.6,526.8 L327.9,549.3 L321.2,563 ' +
  'L320.8,577.3 L329.8,592.2 L291.9,592.2 L293.5,579.2 L281.3,555.5 L280.3,546.6 L246.8,539.2 L193,552.4 ' +
  'L175.4,548.9 L129.2,524.5 L94.9,517.3 L68.5,496.4 L54,446.9 L32.9,427.6 L30.1,414.7 L33.7,408 L25.6,394.5 ' +
  'L22.9,368 L10.3,344 L9.9,321.6 L14.8,318.4 L43,343.9 L51.1,347.3 L68.7,346.5 L84,338.3 L96.5,325.8 ' +
  'L116.9,287.4 L128,276.5 L136.8,280.4 L168.9,271.3 L209.1,276.5 L244.3,291.8 L259.9,287.4 L280.8,264.7 ' +
  'L287,248.1 L289.9,194.4 L283.2,162.7 L293.4,164.4 L310.8,174.7 L346.5,183 L376.3,181.2 L498,198.4 ' +
  'L596.7,182.6 L648.8,152.9 L670.5,156.4 L755.6,124.6 L772.9,112.7 L796.1,103.9 L817.5,81.7 L875.9,65.2 ' +
  'L893.7,53.7 L971.1,17.4 Z';
