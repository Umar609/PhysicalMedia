// ========== CONFIGURATION ==========
// Base URL for all Discogs API requests
const DISCOGS_BASE_URL = "https://api.discogs.com";
// Max number of CDs to show on the homepage
const FRONT_PAGE_LIMIT = 25;
// Max number of CDs to return from a search
const SEARCH_LIMIT = 25;
// How many times to retry a request if we get rate-limited (429)
const RETRY_ATTEMPTS = 2;
// How long to wait (in ms) before retrying a rate-limited request
const RETRY_DELAY_MS = 2000;
// Genre keywords used to find popular CDs for the homepage
const POPULAR_SEEDS = ["r&b", "rnb", "soul"];

// ========== AUTHENTICATION ==========
// Discogs requires authentication for API access.
// We support two methods (set these in a .env.local file):
//   1) Personal access token: VITE_DISCOGS_TOKEN
//   2) Consumer key + secret: VITE_DISCOGS_CONSUMER_KEY + VITE_DISCOGS_CONSUMER_SECRET
// NEVER hardcode credentials directly in this file.
const DISCOGS_TOKEN = import.meta.env.VITE_DISCOGS_TOKEN || "";
const DISCOGS_CONSUMER_KEY = import.meta.env.VITE_DISCOGS_CONSUMER_KEY || "";
const DISCOGS_CONSUMER_SECRET = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET || "";
// Max number of individual release lookups when hydrating search result covers
const SEARCH_DETAIL_LOOKUPS = 15;

// Warn in the console if no credentials are configured — API calls will fail
if (!DISCOGS_TOKEN && !(DISCOGS_CONSUMER_KEY && DISCOGS_CONSUMER_SECRET)) {
    console.error(
        "[Shelvd] No Discogs credentials found! " +
        "Create a .env.local file in the project root with VITE_DISCOGS_TOKEN=your_token. " +
        "Get a token at https://www.discogs.com/settings/developers"
    );
}

// ========== FALLBACK COVER IMAGE ==========
// An inline SVG used as a placeholder when an album has no cover art.
// It displays a grey gradient box with "No Cover" text.
const FALLBACK_COVER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#555" />
      <stop offset="100%" stop-color="#2a2a2a" />
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#g)" />
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="34" font-family="Arial, sans-serif">No Cover</text>
</svg>
`;
// Encoded as a data URI so it can be used directly as an image source
const FALLBACK_COVER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(FALLBACK_COVER_SVG)}`;

// ========== UTILITY HELPERS ==========

// Returns a promise that resolves after the given number of milliseconds (used for retry delays)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Cache for release detail lookups — avoids re-fetching the same release
const detailsCache = new Map();

// Checks if a value is a valid image URL (starts with http/https or is a data URI)
const hasImageUrl = (value) =>
    typeof value === "string" && /^(https?:\/\/|data:image\/)/i.test(value);

// ========== DATA FILTERS ==========

// Checks if a Discogs search result is a CD release.
// If the result has no format info, we accept it (the search was already filtered to CD).
// Otherwise, at least one format string must contain "cd".
const isCDRelease = (release) => {
    const formats = Array.isArray(release?.format) ? release.format : [];

    if (formats.length === 0) {
        return true;
    }

    return formats.some((format) =>
        typeof format === "string" && format.toLowerCase().includes("cd")
    );
};

// ========== TITLE PARSING ==========

// Discogs returns titles as "Artist - Album Title".
// This function splits that into separate artist and title fields.
// If there's no " - " separator, the whole string becomes the title.
const splitArtistTitle = (rawTitle = "") => {
    const index = rawTitle.indexOf(" - ");

    if (index === -1) {
        return {
            artist: "Unknown Artist",
            title: rawTitle || "Unknown Album",
        };
    }

    return {
        artist: rawTitle.slice(0, index).trim() || "Unknown Artist",
        title: rawTitle.slice(index + 3).trim() || "Unknown Album",
    };
};

// ========== URL BUILDER ==========

// Builds a full Discogs API URL with authentication and any extra query parameters.
// Automatically attaches the token or key/secret from environment variables.
const buildDiscogsUrl = (path, params = {}) => {
    const url = new URL(`${DISCOGS_BASE_URL}${path}`);

    // Attach authentication credentials
    if (DISCOGS_TOKEN) {
        url.searchParams.set("token", DISCOGS_TOKEN);
    } else if (DISCOGS_CONSUMER_KEY && DISCOGS_CONSUMER_SECRET) {
        url.searchParams.set("key", DISCOGS_CONSUMER_KEY);
        url.searchParams.set("secret", DISCOGS_CONSUMER_SECRET);
    }

    // Append any additional query parameters (e.g. search terms, page number)
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, `${value}`);
        }
    }

    return url.toString();
};

// ========== API FETCH WITH RETRY ==========

// Fetches JSON from a URL with automatic retry on rate-limiting (429).
// Also handles 401 (bad credentials) with a clear error message.
// Logs errors with "[Shelvd]" prefix for easy debugging in the browser console.
const fetchJson = async (url, retries = RETRY_ATTEMPTS) => {
    // Create a safe version of the URL for logging (hides token/secret)
    const safeUrl = url.replace(/token=[^&]+/, "token=***").replace(/secret=[^&]+/, "secret=***");
    const response = await fetch(url);

    // If rate-limited and we have retries left, wait and try again
    if (response.status === 429 && retries > 0) {
        const retryAfter = response.headers.get("Retry-After");
        const delayMs = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS;
        console.warn(`[Shelvd] Rate limited (429), retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        return fetchJson(url, retries - 1);
    }

    // Authentication error — token is invalid or missing
    if (response.status === 401) {
        console.error("[Shelvd] Authentication failed (401). Check your VITE_DISCOGS_TOKEN in .env.local");
        throw new Error("Discogs authentication failed. Check your API token.");
    }

    // Any other non-OK response
    if (!response.ok) {
        console.error(`[Shelvd] API error ${response.status} for ${safeUrl}`);
        throw new Error(`Discogs API error: ${response.status}`);
    }

    return response.json();
};

// ========== DATA MAPPING ==========

// Converts a raw Discogs search result into our app's CD object format.
// Extracts the artist and title from the combined "Artist - Title" string,
// and picks the best available cover image.
const mapReleaseToCD = (release) => {
    const parsed = splitArtistTitle(release.title);

    return {
        id: `${release.id}`,
        title: parsed.title,
        artist: parsed.artist,
        master_id: release.master_id || null,
        poster_path: hasImageUrl(release.cover_image)
            ? release.cover_image
            : hasImageUrl(release.thumb)
                ? release.thumb
                : "",
    };
};

// ========== RELEASE DETAILS (COVER + POPULARITY) ==========

// Fetches detailed info for a single release from Discogs.
// Returns the cover image URL and a popularity score based on
// how many people own it (have) and want it (want).
// Results are cached so we don't re-fetch the same release.
const fetchReleaseDetails = async (releaseId) => {
    const key = `${releaseId}`;
    if (detailsCache.has(key)) {
        return detailsCache.get(key);
    }

    try {
        const url = buildDiscogsUrl(`/releases/${releaseId}`);
        const data = await fetchJson(url, RETRY_ATTEMPTS);
        const details = {
            cover: data.images?.[0]?.uri || data.thumb || "",
            // Popularity = (owners × 2) + wanters — weights owning higher
            popularity: (data.community?.have || 0) * 2 + (data.community?.want || 0),
        };

        detailsCache.set(key, details);
        return details;
    } catch {
        // If the lookup fails, return empty data and cache it to avoid retrying
        const empty = { cover: "", popularity: 0 };
        detailsCache.set(key, empty);
        return empty;
    }
};

// ========== COVER HYDRATION ==========

// Many Discogs search results come back without cover art.
// This function goes through a list of CDs and fetches the actual cover
// from the release details endpoint for any that are missing one.
// It stops after `maxDetailCalls` lookups to avoid hitting rate limits.
// Any CDs still without a cover get the fallback "No Cover" placeholder.
const hydrateSomeCovers = async (cds, maxDetailCalls) => {
    const output = [...cds];
    let used = 0;

    for (let i = 0; i < output.length; i += 1) {
        const cd = output[i];

        // Skip if this CD already has a valid cover
        if (hasImageUrl(cd.poster_path)) {
            continue;
        }

        // If we've used up our lookup budget, just assign the fallback
        if (used >= maxDetailCalls) {
            output[i] = { ...cd, poster_path: FALLBACK_COVER };
            continue;
        }

        // Fetch the release details to get the cover image
        const details = await fetchReleaseDetails(cd.id);
        used += 1;
        output[i] = {
            ...cd,
            poster_path: hasImageUrl(details.cover) ? details.cover : FALLBACK_COVER,
        };
    }

    // Final pass: ensure every CD has some image (catches any edge cases)
    return output.map((cd) => ({
        ...cd,
        poster_path: hasImageUrl(cd.poster_path) ? cd.poster_path : FALLBACK_COVER,
    }));
};

// ========== DEDUPLICATION ==========

// Removes duplicate CDs (same ID) from a list.
// When duplicates are found, keeps the version that has a cover image.
const dedupeById = (items) => {
    const byId = new Map();

    for (const item of items) {
        const existing = byId.get(item.id);

        // First time seeing this ID — keep it
        if (!existing) {
            byId.set(item.id, item);
            continue;
        }

        // Duplicate found — prefer the one with a cover image
        const currentHasCover = hasImageUrl(existing.poster_path);
        const newHasCover = hasImageUrl(item.poster_path);

        if (newHasCover && !currentHasCover) {
            byId.set(item.id, item);
        }
    }

    return Array.from(byId.values());
};

// ========== DISCOGS SEARCH ==========

// Searches Discogs for releases matching the given query.
// First tries a strict search (CD format only). If that returns no results,
// falls back to a broader search (all formats) and filters for CDs after.
// Extra params (like year) can be passed in for more specific searches.
// Returns { results: [...] } — always safe to read .results from the return value.
const searchDiscogs = async (query, limit = SEARCH_LIMIT, extraParams = {}) => {
    // Strict search: only CD format results
    const strictUrl = buildDiscogsUrl("/database/search", {
        type: "release",
        format: "CD",
        per_page: limit,
        page: 1,
        q: query,
        ...extraParams,
    });

    try {
        const strictData = await fetchJson(strictUrl, RETRY_ATTEMPTS);
        const strictResults = (strictData.results ?? []).filter(isCDRelease);

        if (strictResults.length > 0) {
            return {
                ...strictData,
                results: strictResults,
            };
        }
    } catch {
        // Strict search failed — continue to fallback
    }

    // Fallback search: all formats, then filter for CDs on our side
    try {
        const fallbackUrl = buildDiscogsUrl("/database/search", {
            type: "release",
            per_page: limit,
            page: 1,
            q: query,
            ...extraParams,
        });

        const fallbackData = await fetchJson(fallbackUrl, RETRY_ATTEMPTS);
        return {
            ...fallbackData,
            results: (fallbackData.results ?? []).filter(isCDRelease),
        };
    } catch {
        // Both searches failed — return empty results so the app doesn't crash
        return { results: [] };
    }
};

// ========== HOMEPAGE: GET POPULAR CDs ==========

// Fetches the top 25 most popular R&B/Soul CDs for the homepage.
// How it works:
//   1. Searches Discogs for CDs matching each genre seed (r&b, rnb, soul)
//      from the last year, sorted by most collected
//   2. If no results found for last year, retries without the year filter
//   3. Removes duplicates and "Various Artists" compilations
//   4. Looks up each CD's popularity score (based on Discogs community stats)
//   5. Sorts by popularity and returns the top 25 with cover art
export const getPopularCDs = async () => {
    let candidates = [];

    // Calculate the year range (last year and this year)
    const now = new Date();
    const lastYear = now.getFullYear() - 1;
    const thisYear = now.getFullYear();
    const years = [lastYear, thisYear];

    // Step 1: Search each genre seed for each year, sorted by most owned
    for (const seed of POPULAR_SEEDS) {
        for (const year of years) {
            try {
                const data = await searchDiscogs(seed, 30, { year, sort: "have", sort_order: "desc" });
                const results = data.results ?? [];
                console.log(`[Shelvd] Seed "${seed}" (${year}): ${results.length} results`);
                candidates.push(...results);
            } catch (err) {
                console.warn(`[Shelvd] Seed "${seed}" (${year}) failed:`, err.message);
            }
        }
    }

    // Step 2: If year-filtered search returned nothing, try without year filter
    if (candidates.length === 0) {
        console.warn("[Shelvd] No year-filtered results, trying without year filter...");
        for (const seed of POPULAR_SEEDS) {
            try {
                const data = await searchDiscogs(seed, 40, { sort: "have", sort_order: "desc" });
                const results = data.results ?? [];
                console.log(`[Shelvd] Seed "${seed}" (no year): ${results.length} results`);
                candidates.push(...results);
            } catch (err) {
                console.warn(`[Shelvd] Seed "${seed}" (no year) failed:`, err.message);
            }
        }
    }

    // If still nothing, credentials are probably wrong
    if (candidates.length === 0) {
        console.warn("[Shelvd] No results from any seed query. Check your Discogs credentials.");
        return [];
    }

    // Step 3: Remove duplicates and filter out "Various Artists" compilations
    const mapped = dedupeById(candidates.map(mapReleaseToCD))
        .filter((cd) => !/^various\s+artists?$/i.test(cd.artist));

    // Step 4: Look up each CD's cover art and popularity score
    // Capped at 35 lookups to avoid hitting Discogs rate limits
    const toHydrate = mapped.slice(0, 35);
    const hydrated = [];
    for (const cd of toHydrate) {
        const details = await fetchReleaseDetails(cd.id);
        hydrated.push({
            ...cd,
            poster_path: hasImageUrl(details.cover) ? details.cover
                : hasImageUrl(cd.poster_path) ? cd.poster_path
                : FALLBACK_COVER,
            _popularity: details.popularity,
        });
    }

    // Step 5: Sort by popularity (highest first) and take the top 25
    hydrated.sort((a, b) => b._popularity - a._popularity);
    const top = hydrated.slice(0, FRONT_PAGE_LIMIT);

    console.log(`[Shelvd] Top ${top.length} by popularity:`, top.map((c) => `${c.artist} - ${c.title} (${c._popularity})`));

    // Remove the internal _popularity field before returning to the UI
    return top.map(({ _popularity, ...rest }) => rest);
};

// ========== SEARCH: FIND CDs BY QUERY ==========

// Searches for CDs matching the user's search input.
// Returns up to 25 results with cover art hydrated for the top 15.
// Returns an empty array if the search fails (so the UI doesn't break).
export const searchCDs = async (query) => {
    const cleanQuery = (query || "").trim();
    if (!cleanQuery) {
        return [];
    }

    try {
        const data = await searchDiscogs(cleanQuery, SEARCH_LIMIT);
        const results = data.results ?? [];
        console.log(`[Shelvd] Search "${cleanQuery}": ${results.length} results`);
        // Remove duplicates, limit to 25, then fetch covers for the first 15
        const mapped = dedupeById(results.map(mapReleaseToCD)).slice(0, SEARCH_LIMIT);
        return hydrateSomeCovers(mapped, SEARCH_DETAIL_LOOKUPS);
    } catch (err) {
        console.error(`[Shelvd] Search failed:`, err.message);
        return [];
    }
};

