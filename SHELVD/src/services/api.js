const BASE_URL = "https://musicbrainz.org/ws/2";

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

export const getPopularCDs = async () => {
    // MusicBrainz has no dedicated recent releases feed, so fetch recent album
    // release groups and sort them client-side by first release date.
    const response = await fetch(
        `${BASE_URL}/release-group?query=${encodeURIComponent(getRecentAlbumsQuery())}&fmt=json&limit=100`
    );

    if (!response.ok) {
        throw new Error("Failed to load popular CDs");
    }

    const data = await response.json();
    const releaseGroups = data["release-groups"] ?? [];

    return releaseGroups
        .sort(sortByNewestReleaseDate)
        .slice(0, 25)
        .map(mapReleaseGroupToCD);
}

export const searchCDs = async (query) => {
    const response = await fetch(
        `${BASE_URL}/release-group?query=${encodeURIComponent(`${query} AND primarytype:album`)}&fmt=json&limit=20`
    );

    if (!response.ok) {
        throw new Error("Failed to search CDs");
    }

    const data = await response.json();
    const releaseGroups = data["release-groups"] ?? [];

    return releaseGroups.map(mapReleaseGroupToCD);
}

