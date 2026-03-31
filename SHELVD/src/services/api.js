const BASE_URL = "https://musicbrainz.org/ws/2";
const SEARCH_PAGE_SIZE = 100;

const mapReleaseGroupToCD = (releaseGroup) => ({
    id: releaseGroup.id,
    title: releaseGroup.title || "Unknown Album",
    artist: releaseGroup["artist-credit"]?.[0]?.name || "Unknown Artist",
    poster_path: `https://coverartarchive.org/release-group/${releaseGroup.id}/front-250`,
});

const getRecentAlbumsQuery = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 1;

    return `primarytype:album AND firstreleasedate:[${startYear}-01-01 TO *]`;
};

const sortByNewestReleaseDate = (left, right) => {
    const leftDate = left["first-release-date"] || "";
    const rightDate = right["first-release-date"] || "";

    return rightDate.localeCompare(leftDate);
};

const fetchReleaseGroups = async (query, limit, offset = 0) => {
    const response = await fetch(
        `${BASE_URL}/release-group?query=${encodeURIComponent(query)}&fmt=json&limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
        throw new Error("Failed to load CDs");
    }

    return response.json();
};

export const getPopularCDs = async () => {
    // MusicBrainz has no dedicated recent releases feed, so fetch recent album
    // release groups and sort them client-side by first release date.
    const data = await fetchReleaseGroups(getRecentAlbumsQuery(), SEARCH_PAGE_SIZE);
    const releaseGroups = data["release-groups"] ?? [];

    return releaseGroups
        .sort(sortByNewestReleaseDate)
        .slice(0, 25)
        .map(mapReleaseGroupToCD);
}

export const searchCDs = async (query) => {
    const searchQuery = `${query} AND primarytype:album`;
    const allReleaseGroups = [];
    let offset = 0;
    let totalCount = 0;

    do {
        const data = await fetchReleaseGroups(searchQuery, SEARCH_PAGE_SIZE, offset);
        const releaseGroups = data["release-groups"] ?? [];

        totalCount = data.count ?? releaseGroups.length;
        allReleaseGroups.push(...releaseGroups);
        offset += releaseGroups.length;
    } while (offset < totalCount);

    return allReleaseGroups.map(mapReleaseGroupToCD);
}

