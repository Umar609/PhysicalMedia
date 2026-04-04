const DISCOGS_BASE_URL = "https://api.discogs.com";
const FRONT_PAGE_LIMIT = 25;
const SEARCH_LIMIT = 25;
const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 2000;
const POPULAR_SEEDS = ["r&b"];

// Discogs Auth Flow (preferred for frontend):
// 1) Personal token: VITE_DISCOGS_TOKEN
// 2) Consumer credentials: VITE_DISCOGS_CONSUMER_KEY + VITE_DISCOGS_CONSUMER_SECRET
// Never hardcode credentials in source.
const DISCOGS_TOKEN = import.meta.env.VITE_DISCOGS_TOKEN || "";
const DISCOGS_CONSUMER_KEY = import.meta.env.VITE_DISCOGS_CONSUMER_KEY || "";
const DISCOGS_CONSUMER_SECRET = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET || "";
const SEARCH_DETAIL_LOOKUPS = 15;

if (!DISCOGS_TOKEN && !(DISCOGS_CONSUMER_KEY && DISCOGS_CONSUMER_SECRET)) {
    console.error(
        "[Shelvd] No Discogs credentials found! " +
        "Create a .env.local file in the project root with VITE_DISCOGS_TOKEN=your_token. " +
        "Get a token at https://www.discogs.com/settings/developers"
    );
}

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
const FALLBACK_COVER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(FALLBACK_COVER_SVG)}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const detailsCache = new Map();

const hasImageUrl = (value) =>
    typeof value === "string" && /^(https?:\/\/|data:image\/)/i.test(value);

const isCDRelease = (release) => {
    const formats = Array.isArray(release?.format) ? release.format : [];

    // When Discogs search already uses format=CD, missing format metadata should not
    // cause us to drop otherwise valid CD results.
    if (formats.length === 0) {
        return true;
    }

    return formats.some((format) =>
        typeof format === "string" && format.toLowerCase().includes("cd")
    );
};

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

const buildDiscogsUrl = (path, params = {}) => {
    const url = new URL(`${DISCOGS_BASE_URL}${path}`);

    // Per Discogs docs, authenticate using either token or key/secret.
    if (DISCOGS_TOKEN) {
        url.searchParams.set("token", DISCOGS_TOKEN);
    } else if (DISCOGS_CONSUMER_KEY && DISCOGS_CONSUMER_SECRET) {
        url.searchParams.set("key", DISCOGS_CONSUMER_KEY);
        url.searchParams.set("secret", DISCOGS_CONSUMER_SECRET);
    }

    // Add any additional params
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, `${value}`);
        }
    }

    return url.toString();
};

const fetchJson = async (url, retries = RETRY_ATTEMPTS) => {
    const safeUrl = url.replace(/token=[^&]+/, "token=***").replace(/secret=[^&]+/, "secret=***");
    const response = await fetch(url);

    if (response.status === 429 && retries > 0) {
        const retryAfter = response.headers.get("Retry-After");
        const delayMs = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_MS;
        console.warn(`[Shelvd] Rate limited (429), retrying in ${delayMs}ms...`);
        await sleep(delayMs);
        return fetchJson(url, retries - 1);
    }

    if (response.status === 401) {
        console.error("[Shelvd] Authentication failed (401). Check your VITE_DISCOGS_TOKEN in .env.local");
        throw new Error("Discogs authentication failed. Check your API token.");
    }

    if (!response.ok) {
        console.error(`[Shelvd] API error ${response.status} for ${safeUrl}`);
        throw new Error(`Discogs API error: ${response.status}`);
    }

    return response.json();
};

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
            popularity: (data.community?.have || 0) * 2 + (data.community?.want || 0),
        };

        detailsCache.set(key, details);
        return details;
    } catch {
        const empty = { cover: "", popularity: 0 };
        detailsCache.set(key, empty);
        return empty;
    }
};

const hydrateSomeCovers = async (cds, maxDetailCalls) => {
    const output = [...cds];
    let used = 0;

    for (let i = 0; i < output.length; i += 1) {
        const cd = output[i];
        if (hasImageUrl(cd.poster_path)) {
            continue;
        }

        if (used >= maxDetailCalls) {
            output[i] = { ...cd, poster_path: FALLBACK_COVER };
            continue;
        }

        const details = await fetchReleaseDetails(cd.id);
        used += 1;
        output[i] = {
            ...cd,
            poster_path: hasImageUrl(details.cover) ? details.cover : FALLBACK_COVER,
        };
    }

    return output.map((cd) => ({
        ...cd,
        poster_path: hasImageUrl(cd.poster_path) ? cd.poster_path : FALLBACK_COVER,
    }));
};

const dedupeById = (items) => {
    const byId = new Map();

    // Group all items by ID.
    for (const item of items) {
        const existing = byId.get(item.id);

        if (!existing) {
            byId.set(item.id, item);
            continue;
        }

        // If we already have this ID, prefer the one with a cover.
        const currentHasCover = hasImageUrl(existing.poster_path);
        const newHasCover = hasImageUrl(item.poster_path);

        if (newHasCover && !currentHasCover) {
            byId.set(item.id, item);
        }
    }

    return Array.from(byId.values());
};

const searchDiscogs = async (query, limit = SEARCH_LIMIT, extraParams = {}) => {
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
        // Continue to fallback query.
    }

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
        return { results: [] };
    }
};

export const getPopularCDs = async () => {
    let candidates = [];

    // Only show CDs released in the last year
    const now = new Date();
    const lastYear = now.getFullYear() - 1;
    const thisYear = now.getFullYear();
    const years = [lastYear, thisYear];

    // Fetch a larger pool so we can rank by popularity
    for (const seed of POPULAR_SEEDS) {
        for (const year of years) {
            try {
                const data = await searchDiscogs(seed, 40, { year });
                const results = data.results ?? [];
                console.log(`[Shelvd] Seed "${seed}" (${year}): ${results.length} results`);
                candidates.push(...results);
            } catch (err) {
                console.warn(`[Shelvd] Seed "${seed}" (${year}) failed:`, err.message);
            }
        }
    }

    if (candidates.length === 0) {
        console.warn("[Shelvd] No results from any seed query. Check your Discogs credentials.");
        return [];
    }

    const mapped = dedupeById(candidates.map(mapReleaseToCD));

    // Hydrate all candidates to get popularity scores + covers
    const hydrated = [];
    for (const cd of mapped) {
        const details = await fetchReleaseDetails(cd.id);
        hydrated.push({
            ...cd,
            poster_path: hasImageUrl(details.cover) ? details.cover
                : hasImageUrl(cd.poster_path) ? cd.poster_path
                : FALLBACK_COVER,
            _popularity: details.popularity,
        });
    }

    // Sort by popularity (most owned/wanted first) and take top 25
    hydrated.sort((a, b) => b._popularity - a._popularity);
    const top = hydrated.slice(0, FRONT_PAGE_LIMIT);

    console.log(`[Shelvd] Top 25 by popularity:`, top.map((c) => `${c.artist} - ${c.title} (${c._popularity})`));

    // Strip internal field before returning
    return top.map(({ _popularity, ...rest }) => rest);
};

export const searchCDs = async (query) => {
    const cleanQuery = (query || "").trim();
    if (!cleanQuery) {
        return [];
    }

    try {
        const data = await searchDiscogs(cleanQuery, SEARCH_LIMIT);
        const results = data.results ?? [];
        console.log(`[Shelvd] Search "${cleanQuery}": ${results.length} results`);
        const mapped = dedupeById(results.map(mapReleaseToCD)).slice(0, SEARCH_LIMIT);
        return hydrateSomeCovers(mapped, SEARCH_DETAIL_LOOKUPS);
    } catch (err) {
        console.error(`[Shelvd] Search failed:`, err.message);
        return [];
    }
};
