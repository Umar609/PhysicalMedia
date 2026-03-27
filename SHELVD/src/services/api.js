const BASE_URL = "https://musicbrainz.org/ws/2";

const mapReleaseGroupToCD = (releaseGroup) => ({
    id: releaseGroup.id,
    title: releaseGroup.title || "Unknown Album",
    artist: releaseGroup["artist-credit"]?.[0]?.name || "Unknown Artist",
    poster_path: `https://coverartarchive.org/release-group/${releaseGroup.id}/front-250`,
});

export const getPopularCDs = async () => {
    // MusicBrainz has no "popular chart" endpoint on v2 web service, so use a
    // broad album search as a homepage feed.
    const response = await fetch(
        `${BASE_URL}/release-group?query=${encodeURIComponent("tag:pop AND primarytype:album")}&fmt=json&limit=10`
    );

    if (!response.ok) {
        throw new Error("Failed to load popular CDs");
    }

    const data = await response.json();
    const releaseGroups = data["release-groups"] ?? [];

    return releaseGroups.map(mapReleaseGroupToCD);
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

