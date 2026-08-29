# MongoDB Setup Guide — Cyprus Discovery

This is a step-by-step walkthrough for setting up the MongoDB Atlas database that will back this project's place data. It's written for someone who has never used MongoDB before, and it's scoped specifically to what **this app** — Kuzey Kıbrıs Discovery, a Next.js travel/discovery site — actually needs.

**This document is documentation only.** Following it does not touch any application code. By the end, you'll have a running Atlas cluster, a `places` collection with the right shape and indexes, and a `.env.local` file the Next.js app can eventually read from. Wiring the application itself up to MongoDB (installing a driver, writing a data-access layer, replacing `src/data/places.ts`) is separate follow-up work — see [Section 14](#section-14--what-to-send-to-claude-when-youre-done).

> Atlas's web UI gets redesigned from time to time, so an exact button label or menu position below might have shifted slightly by the time you read this. The steps, order, and reasoning will still hold — if something's not exactly where described, look for the nearest equivalent.

**Why this project needs a real database at all:** right now, every place lives in a single hard-coded TypeScript file (`src/data/places.ts`). That's fine for ~20 sample places, but it means adding, editing, or unpublishing a place requires a code change and a redeploy. Moving to MongoDB is what makes "add a place," "edit a place," "hide a place," and "find places near me" possible without touching code.

---

## Section 1 — Create a MongoDB Atlas Account

1. **Where to go:** open [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) in your browser.
2. **What to click / enter:** sign up with an email + password, or with an existing Google/GitHub account. Verify your email if prompted.
3. **Why:** Atlas is MongoDB's managed hosting service — it runs the actual database servers for you, so you don't install or maintain MongoDB yourself.
4. **What you'll see:** after your first login, Atlas will ask you to create an **Organization** and a **Project** (sometimes combined into one setup screen). An Organization is just a top-level container for billing and members — accept the default. What matters is the **Project** name.
5. **Project name to use:** `Cyprus Discovery`. A project is where your clusters, database users, and network rules for *this app* live, separate from any other app you might build later.

**Expect to see afterward:** an empty Atlas Project dashboard with a prompt to "Create a deployment" or "Build a database."

---

## Section 2 — Create the Cluster

A **cluster** (Atlas now often calls it a "deployment") is the actual running database server(s) your data lives on.

1. **Where to go:** from the Project dashboard, click **Create** / **Build a Database**.
2. **What to click:** choose the **M0 Free** tier. This is what you want — do not pick a paid tier for this project right now.
3. **Provider/region — what actually matters:** the cloud provider (AWS / Google Cloud / Azure) barely matters for a project this size; pick **AWS**, since it has the widest region selection on the free tier. For region, pick whichever available free-tier region is geographically closest to Cyprus/Turkey — **Frankfurt (`eu-central-1`)** is typically the closest option on AWS's free-tier list. Closer region = lower latency for reads/writes, nothing else changes. If you later deploy the app to a hosting platform (e.g. Vercel), it's a nice bonus to pick a region close to where *that* platform's servers run too, but don't over-think this for now.
4. **Cluster name:** name it `cyprus-discovery-cluster` (or just leave the Atlas default, `Cluster0` — it has no effect on anything in this guide, it's purely a label in the Atlas UI).
5. **Click** the create/deploy button.

**Why M0 and not a paid tier:** M0 is free forever (with modest storage/throughput limits), and it fully supports everything this project needs right now — regular queries, unique indexes, and `2dsphere` geospatial indexes for the map/nearby-search features. There is no reason to pay for anything until this app has real production traffic.

**What you'll see:** a cluster card showing a provisioning status, which typically finishes in 1–3 minutes and then shows the cluster as running/green.

---

## Section 3 — Understand the Naming, and Pick a Database Name

Before creating anything else, here's the hierarchy you're working within, top to bottom:

| Level | What it is | In this guide |
|---|---|---|
| **Organization** | Billing/admin container, holds one or more Projects | created automatically, default is fine |
| **Project** | Groups clusters + settings for one app | `Cyprus Discovery` |
| **Cluster** | The actual running database server(s) | `cyprus-discovery-cluster` (or `Cluster0`) |
| **Database** | A named group of collections inside a cluster | `cyprus_discovery` (this section) |
| **Collection** | A named group of documents — roughly like a "table" | `places` (Section 8–9) |
| **Document** | One record — a JSON-like object | one place, one user, etc. |

A single cluster can hold many databases, and a database can hold many collections. You don't create the database explicitly in Atlas's UI ahead of time in most flows — it's created the moment you create its first collection or insert its first document (see Section 8).

**Database name to use:** `cyprus_discovery` — lowercase, underscore-separated, matches the app's domain rather than a generic name like `test` or `app`. If you ever need separate dev/staging/production data, you'd create additional databases like `cyprus_discovery_dev` on the *same* cluster later — you don't need to do that now.

---

## Section 4 — Create the Application Database User

This is a **database user** — a credential the *application* uses to authenticate to MongoDB. It is completely separate from your Atlas account login (the email/password or Google/GitHub login you used in Section 1). Your Atlas account can create clusters, billing settings, and delete the project; a database user can only do what you scope it to do inside the database — and should never be able to do more than that.

1. **Where to go:** in the left sidebar, under **Security**, click **Database Access**.
2. **What to click:** **Add New Database User**.
3. **Authentication method:** leave it on **Password**.
4. **Username:** `cyprus_discovery_app` — a username that describes *what* is using this credential (the app), not a personal name.
5. **Password:** click **Autogenerate Secure Password** and then **copy it somewhere safe immediately** (a password manager, not a text file in this repo). Atlas will not show it to you again. Do not hand-type a password — the auto-generated one avoids characters that are awkward to URL-encode later, and it's simply stronger.
6. **Database User Privileges:** choose **Restrict Access to Specific Databases** rather than a built-in "read/write to any database" role, then grant this user `readWrite` scoped to the `cyprus_discovery` database only. This means that even if this credential ever leaks, it can't touch any other database or perform admin actions like dropping the cluster.
7. **Click** **Add User**.

**Never put this password directly in source code**, in a file that gets committed, or paste it into chat with a coding agent (including this one) — see Section 6 and Section 14.

**What you'll see:** the new user listed on the Database Access page, with the scoped role next to it.

---

## Section 5 — Network Access

MongoDB Atlas blocks all incoming connections by default. **Network Access** is the allow-list of IP addresses permitted to even attempt to authenticate.

1. **Where to go:** left sidebar → **Security** → **Network Access**.
2. **What to click:** **Add IP Address**.

You have two realistic options:

- **Add Current IP Address** — Atlas detects the public IP you're browsing from right now and allow-lists just that address. This is the more secure option: only your current network can reach the database.
- **Allow Access from Anywhere (`0.0.0.0/0`)** — allow-lists every IP address on the internet (the database is still protected by the username/password from Section 4, but anyone who obtains valid credentials can connect from anywhere).

**What to do right now (development):** click **Add Current IP Address**. This covers you while developing locally.

**Why `0.0.0.0/0` is convenient but less secure:** your home/office IP address usually isn't fixed — it can change, and if it does, your app will suddenly fail to connect until you add the new IP. `0.0.0.0/0` sidesteps that annoyance entirely, which is why so many tutorials default to it — but it also means the database will accept a connection attempt from literally any address on the internet, relying entirely on the password not leaking.

**What should change for production:** if you deploy this app to a platform with fixed, published server IPs, add exactly those IPs and remove `0.0.0.0/0`. If you deploy to a serverless/edge platform with rotating IPs (Vercel is the common example), Atlas has no way to allow-list a stable IP range for you on the free tier — in that case `0.0.0.0/0` combined with a strong, unique database password is the realistic option unless you upgrade to a paid tier that supports Atlas's private network peering. Either way, that decision is a production step, not something to solve today — allow-list your current IP for now and revisit this section before you deploy.

**What you'll see:** an entry in the Network Access list showing the IP/CIDR you added and a status of "Active" (it can take a minute to apply).

---

## Section 6 — Get the Connection String

1. **Where to go:** go back to **Database** (left sidebar) → find your cluster → click **Connect**.
2. **What to click:** **Drivers**.
3. On the driver screen, select **Node.js** and the version shown (any recent 5.x/6.x is fine — this guide doesn't depend on the exact minor version).
4. Atlas shows two things: an `npm install mongodb` command (ignore this for now — installing the driver is application work, covered in a later task, not this guide) and a connection string that looks like:

   ```
   mongodb+srv://<username>:<password>@<cluster-address>/?retryWrites=true&w=majority&appName=<cluster-name>
   ```

5. **Copy that string.** You'll edit it in two ways before it's usable:

   - Replace `<username>` with the database username from Section 4 (`cyprus_discovery_app`).
   - Replace `<password>` with the password you generated in Section 4.
   - Insert the database name from Section 3 right after the host, before the `?`:

     ```
     mongodb+srv://<username>:<password>@<cluster-address>/cyprus_discovery?retryWrites=true&w=majority&appName=<cluster-name>
     ```

**If your password contains special characters** (`@`, `#`, `%`, `/`, `:`, spaces, etc.), you must URL-encode them, because a raw `@` or `/` in the password will be parsed as part of the URI's structure instead of the password. Common ones:

| Character | Encoded |
|---|---|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `/` | `%2F` |
| `:` | `%3A` |
| space | `%20` |

This is exactly why Section 4 recommended **Autogenerate Secure Password** — Atlas's generated passwords are already safe to drop into a URI without encoding. If you ever hand-type your own password, encode it (in Node, `encodeURIComponent(password)` does this correctly) or just regenerate one via Atlas instead of hand-encoding.

**Never paste the real, filled-in connection string anywhere public** — not into a GitHub issue, not into chat with a coding agent, not into this guide. Placeholders only, always.

---

## Section 7 — Environment Variables

1. **Where to go:** the root of this project (same folder as `package.json`).
2. **What to do:** create a new file named exactly `.env.local`.
3. **What to put in it:**

   ```
   MONGODB_URI=
   MONGODB_DB=cyprus_discovery
   ```

   Paste your full, filled-in connection string from Section 6 after `MONGODB_URI=` (no quotes needed). `MONGODB_DB` is a convenience so the app doesn't have to parse the database name back out of the URI string.

**Why not `NEXT_PUBLIC_MONGODB_URI`:** in Next.js, any environment variable prefixed with `NEXT_PUBLIC_` is deliberately bundled into the JavaScript that ships to the browser, so it can be read by client-side code. A database connection string is a secret with write access to your data — if it's prefixed `NEXT_PUBLIC_`, anyone who opens your site's browser dev tools can read it out of the page source and connect to your database directly. `MONGODB_URI` (no prefix) stays server-only: Next.js only exposes it to code that runs on the server (API routes, Server Components, server actions), which is exactly where database access belongs.

**Confirm `.env.local` is git-ignored:** this repository's `.gitignore` already contains the line `.env*` (see the "env files" section near the bottom of `.gitignore`), which covers `.env.local` and any other `.env.*` variant. You don't need to add anything — but it's worth verifying yourself once: run `git status` after creating the file, and confirm `.env.local` does **not** show up as an untracked file. If it does show up, something has changed that rule and it needs fixing before you commit anything.

---

## Section 8 — Which Collections to Create Now

Based on what this app actually does today (verified directly against the codebase, not assumed):

**Create now:**
- **`places`** — the one collection this app actually reads from right now (`src/data/places.ts` → soon to become this collection). This is the only collection worth setting up ahead of time, because it needs a unique index and a geospatial index in place *before* real data starts flowing in (Section 11).

**Do not create yet — and here's why, specific to this codebase:**
- **`categories` / `regions`** — in the current app, `Category` and `Region` are just fixed TypeScript string unions (11 categories, 6 KKTC regions), stored directly as string fields on each place document. There's no admin UI or feature anywhere in the app that treats categories/regions as independently editable records. Splitting them into their own collections now would be normalizing data that has no current reason to be dynamic — add these later only if you build a feature that needs to add/rename a category without a code change.
- **`users`** — there is currently no authentication or user-account system anywhere in this application (no login, no session, no auth-related dependency in `package.json`). Don't create a `users` collection until an actual auth feature exists to populate it.
- **`trips`** — the trip planner (`/gezi-planla`) currently generates an itinerary entirely in the visitor's browser and never sends or saves it anywhere — there's nothing server-side to persist. Add a `trips` collection only when/if "save my trip" becomes a real, server-backed feature.
- **`favorites`** — favorites are currently stored client-side only, in the browser's `localStorage`, per device. There's no server concept of "whose favorite" without user accounts, so a `favorites` collection has nothing to attach to yet. This depends on `users` existing first.

In short: build the collection for the data model that already exists (`places`), and don't pre-build collections for features that don't exist in the app yet.

---

## Section 9 — The `places` Collection: Document Shape

This shape is based directly on `src/types/place.ts` (the app's current `Place` type), adjusted for what a database record needs that a hard-coded TypeScript object doesn't: a geospatial `location` field instead of separate `latitude`/`longitude`, a `published` flag, and `createdAt`/`updatedAt` timestamps.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Added automatically by MongoDB — don't set this yourself |
| `slug` | string | URL identifier, must be unique — see Section 11 |
| `name` | string | |
| `shortDescription` | string | Used on cards/listings |
| `description` | string | Full detail-page text |
| `history` | string \| null | Optional historical background |
| `category` | string | One of the app's existing category values (`"Castle"`, `"Museum"`, `"Beach"`, etc.) |
| `region` | string | One of the app's existing region values (`"Girne"`, `"Lefkoşa"`, etc.) |
| `city` | string | |
| `address` | string | |
| `location` | GeoJSON `Point` | **Longitude first, then latitude** — see Section 10 |
| `images` | object | `{ cover: string, gallery: string[] }` |
| `openingHours` | object \| null | Per weekday, `"HH:MM–HH:MM"` string or `null` if closed that day |
| `entranceFee` | object \| null | `{ isFree, adultPrice, childPrice, currency, notes }` |
| `contact` | object | `{ phone, website }` |
| `visitDuration` | number | Estimated visit length, in minutes |
| `featured` | boolean | Shown in the homepage's featured rail |
| `published` | boolean | Whether this place should be visible on the live site — see below |
| `verificationStatus` | string | `"sample"`, `"unverified"`, or `"verified"` |
| `sources` | string[] | Reference URLs used to compile this record |
| `createdAt` | date | Set once, on insert |
| `updatedAt` | date | Updated every time the document is edited |

**On `published`:** this field doesn't exist in the app yet (today, every place in `src/data/places.ts` is implicitly "published" — it's in the array, so it renders). Once the app reads from MongoDB, this becomes the on/off switch: the site's queries will filter for `published: true`, so you can stage or retire a place without deleting it. When you insert real data going forward, set `published: true` for anything ready to show publicly, and `false` for drafts.

### Sample document

Everything below is **sample data** — copy the shape, not the specific values, when you add real places later.

```json
{
  "slug": "girne-kalesi",
  "name": "Girne Kalesi ve Gemi Müzesi",
  "shortDescription": "A striking harbourside castle housing the Kyrenia Ship Museum.",
  "description": "Girne Castle stands beside the town's historic harbour...",
  "history": "Built in the early Byzantine period, expanded under the Lusignans...",
  "category": "Castle",
  "region": "Girne",
  "city": "Girne",
  "address": "Girne Kalesi, Girne Limanı, Girne, KKTC",
  "location": {
    "type": "Point",
    "coordinates": [33.3187, 35.3403]
  },
  "images": {
    "cover": "https://images.unsplash.com/photo-example",
    "gallery": []
  },
  "openingHours": {
    "monday": "08:00–17:00",
    "tuesday": "08:00–17:00",
    "wednesday": "08:00–17:00",
    "thursday": "08:00–17:00",
    "friday": "08:00–17:00",
    "saturday": "08:00–17:00",
    "sunday": "08:00–17:00"
  },
  "entranceFee": {
    "isFree": false,
    "adultPrice": 250,
    "childPrice": 100,
    "currency": "TRY",
    "notes": "Sample price — verify before visiting."
  },
  "contact": {
    "phone": "+90 392 815 2145",
    "website": null
  },
  "visitDuration": 90,
  "featured": true,
  "published": true,
  "verificationStatus": "sample",
  "sources": [],
  "createdAt": { "$date": "2026-08-28T00:00:00.000Z" },
  "updatedAt": { "$date": "2026-08-28T00:00:00.000Z" }
}
```

(The `{ "$date": ... }` form is how Atlas's UI represents a BSON date when you view/insert JSON directly — see Section 12.)

---

## Section 10 — GeoJSON Location

MongoDB's geospatial features expect location data in **GeoJSON** format:

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

**This is the opposite order from how the current app stores coordinates** (`Place.latitude` and `Place.longitude` as two separate fields, latitude first by convention). Read that again: **MongoDB/GeoJSON is `[longitude, latitude]` — longitude first.** This is a near-universal source of bugs when migrating location data into MongoDB, because it's the reverse of how most people say coordinates out loud ("35.34, 33.32" — lat, then lng) and the reverse of how this app's current type stores them.

If you get this backwards, you won't get an error — you'll get a `location` field that looks plausible but silently plots every place in the wrong place on the globe (often in the ocean, or a different hemisphere entirely), and any `$near`/`$geoWithin` geospatial query will return wrong or empty results. When real data migration work happens, double-check every converted point: `[longitude, latitude]`, not `[latitude, longitude]`.

---

## Section 11 — Indexes

An index lets MongoDB find matching documents without scanning every document in the collection. With ~20 documents right now this doesn't matter for performance yet — but two of these indexes exist to **enforce correctness**, not speed, so they're worth creating from day one.

**Create now:**

1. **`slug` — unique index.** Prevents two places from ever accidentally sharing the same URL slug. This is a data-integrity guarantee, not an optimization — worth having before any real data entry starts, not after you discover a duplicate in production.
2. **`location` — `2dsphere` index.** Required by MongoDB before you can run any geospatial query (`$near`, `$geoWithin`) at all — without it, nearby-place / "near me" queries simply won't work. Since the map and planner features are explicitly part of this app's direction, set this up now while there's no real data yet to worry about reindexing.

**Can wait:**

3. **`published`**, **`region`**, **`category`** — useful once the collection has hundreds of documents and listing/filter queries need to skip large numbers of non-matching documents quickly. At today's scale (dozens of places), a full collection scan costs nothing noticeable. Add these later — likely as compound indexes matching real query patterns (e.g. `{ published: 1, region: 1 }`) — once the data-access layer and its actual query shapes exist, rather than guessing now.

### How to create an index through the Atlas UI

1. **Where to go:** **Database** → your cluster → **Browse Collections** → select the `cyprus_discovery` database → select the `places` collection → **Indexes** tab.
2. **What to click:** **Create Index**.
3. For the unique slug index: field `slug`, type `1` (ascending), then check **Create Unique Index** before confirming.
4. For the geospatial index: field `location`, type `2dsphere`.
5. **Click Create.**

**What you'll see:** both indexes listed on the Indexes tab, each showing its field name and type.

---

## Section 12 — Insert One Test Document

1. **Where to go:** **Browse Collections** → `cyprus_discovery` → `places` (if the collection doesn't exist yet, Atlas will let you create it here — name it `places` when prompted).
2. **What to click:** **Insert Document**.
3. Switch the insert dialog to its **JSON view** (usually a `{}` toggle in the corner of the dialog).
4. Paste the sample document from Section 9 (the Girne Kalesi example) — you can leave `createdAt`/`updatedAt` as today's date, or omit them for this manual test insert.
5. **Click Insert.**

**How to confirm it worked:** the collection view should now show **1** document in the list, with `girne-kalesi` visible as the `slug` field. Click into the document to see all its fields rendered — spot-check that `location.coordinates` shows `[33.3187, 35.3403]` in that exact order (longitude, then latitude — see Section 10).

---

## Section 13 — Connection Checklist

```
[ ] Atlas project created ("Cyprus Discovery")
[ ] Cluster running (M0, e.g. "cyprus-discovery-cluster")
[ ] Database user created (readWrite, scoped to cyprus_discovery only)
[ ] Network access configured (current IP added)
[ ] Connection URI copied and edited (username, password, database name filled in)
[ ] .env.local created, with MONGODB_URI and MONGODB_DB set
[ ] .env.local confirmed NOT tracked by git (git status shows nothing)
[ ] places collection created inside the cyprus_discovery database
[ ] slug unique index created
[ ] location 2dsphere index created
[ ] one test place document inserted and visible in Atlas
```

---

## Section 14 — What to Send to Claude When You're Done

You should **never** paste your real MongoDB password or full connection string into this chat — the coding agent doesn't need it, and it shouldn't touch your terminal history or this conversation. All it needs to know is that the two environment variables exist and are named correctly.

A short message like this is enough:

> I've finished the MongoDB Atlas setup from `docs/MONGODB_SETUP_GUIDE.md`. `.env.local` has `MONGODB_URI` and `MONGODB_DB` set (`cyprus_discovery`). The `places` collection exists with a unique `slug` index and a `2dsphere` index on `location`, and I've inserted one test document. Go ahead and wire up the actual MongoDB integration in the app.

That's the trigger for the next task: installing the MongoDB Node.js driver, building a data-access module that talks to Atlas instead of `src/data/places.ts`, and deciding how much of the existing static-data code path stays vs. gets replaced.

---

## Section 15 — Troubleshooting

| Symptom | Likely cause | How to check / fix |
|---|---|---|
| **Authentication failed** | Wrong username/password in the URI, user not created in this project, or user was created but the password in your URI doesn't match | Re-check Database Access for the exact username; if in doubt, edit the user and reset the password (via Autogenerate), then update `.env.local` |
| **IP not allowed / "not authorized" style network errors** | Your current IP isn't in the Network Access list, or your IP changed since you added it | Network Access tab → check whether your current IP is listed; if your network's IP changed, click **Add Current IP Address** again |
| **Bad connection string / URI parse error** | Left a literal `<username>`/`<password>` placeholder in the string, missing `mongodb+srv://` prefix, or forgot to insert the database name before the `?` | Re-compare your string character-by-character against the Section 6 format |
| **Special characters in password breaking the connection** | An un-encoded `@`, `#`, `%`, `/`, `:`, or space in the password is being parsed as URI structure | URL-encode the password (see the table in Section 6), or simplest: regenerate a password via **Autogenerate Secure Password** and avoid this entirely |
| **Database not appearing in Atlas's UI** | This is expected until it holds at least one collection with at least one document — Atlas doesn't show empty databases | Insert a document (Section 12); it will then appear |
| **Collection not appearing** | Same as above — collections appear on first document insert, not on creation of an empty schema | Confirm you actually inserted a document (Section 12), or check whether an app-side write silently failed/threw |
| **Timeout / `ECONNREFUSED` / "server selection timeout"** | Almost always Network Access again, but can also mean the cluster is paused/still provisioning, a typo in the cluster hostname portion of the URI, or a restrictive local/VPN/corporate firewall blocking outbound MongoDB traffic | Check Network Access first; check the cluster's status on the Database dashboard (should say it's running); try from a different network to rule out a local firewall |

---

**Nothing in this document changes any application code.** This is purely the Atlas + `.env.local` setup — the next step is a separate task where the actual Next.js integration (driver install, data-access layer, replacing the static data file) gets built.
