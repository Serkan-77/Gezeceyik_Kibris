// scripts/loadEnv.ts
// Minimal .env loader for standalone scripts run outside `next dev`/`next
// build` (which load .env files automatically — plain `node`/`tsx` doesn't).
// No dependency added for this — it's a dozen lines, and avoids pulling in
// a full dotenv package just for local key=value parsing.
//
// Never logs file contents or values — only which files it found.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

function parseEnvFile(path: string): Record<string, string> {
  const content = readFileSync(path, 'utf8');
  const result: Record<string, string> = {};

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const quoted = (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));
    if (quoted) value = value.slice(1, -1);

    result[key] = value;
  }

  return result;
}

/**
 * Loads .env, then .env.local (if present, overriding .env) into
 * process.env — mirroring Next.js's own precedence — without ever
 * overwriting a variable already set in the actual process environment.
 */
export function loadLocalEnv(): void {
  // Vars already present before we load anything are real shell-exported
  // env vars — those always win over file contents, no matter what.
  const shellKeys = new Set(Object.keys(process.env));
  const found: string[] = [];

  for (const file of ['.env', '.env.local']) {
    const path = resolve(projectRoot, file);
    if (!existsSync(path)) continue;
    found.push(file);
    const vars = parseEnvFile(path);
    for (const [key, value] of Object.entries(vars)) {
      if (shellKeys.has(key)) continue;
      process.env[key] = value; // .env.local (processed second) overrides .env
    }
  }

  if (found.length === 0) {
    console.warn('[loadEnv] No .env or .env.local file found at the project root.');
  } else {
    console.log(`[loadEnv] Loaded environment from: ${found.join(', ')}`);
  }
}
