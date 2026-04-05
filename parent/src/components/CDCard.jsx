import '../css/MovieCard.css';
import { useCDContext } from '../contexts/CDContext';

const FALLBACK_COVER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
    <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#5a5a5a" />
            <stop offset="100%" stop-color="#2e2e2e" />
        </linearGradient>
    </defs>
    <rect width="500" height="500" fill="url(#g)" />
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="36" font-family="Arial, sans-serif">No Cover</text>
</svg>
`;
const FALLBACK_COVER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(FALLBACK_COVER_SVG)}`;

function CdCard({cd}) {
    const {
        isOwned,
        addToOwned,
        removeFromOwned,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
    } = useCDContext();
    const owned = isOwned(cd.id);
    const wishlisted = isWishlisted(cd.id);
    const hasValidCover = typeof cd.poster_path === 'string'
        && /^(https?:\/\/|data:image\/)/i.test(cd.poster_path);
    const imageSrc = hasValidCover ? cd.poster_path : FALLBACK_COVER;

    function onOwnedClick(e) {
        e.preventDefault();
        if (owned) removeFromOwned(cd.id);
        else addToOwned(cd);
    }

    function onWishlistClick(e) {
        e.preventDefault();
        if (wishlisted) removeFromWishlist(cd.id);
        else addToWishlist(cd);
    }

    return (
        <div className="cd-case">
            <div
                className="album-art"
                style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.15),rgba(255,255,255,0)), url("${imageSrc}")` }}
                title={cd.title}
            >
                <div className="sup pos-tl"></div>
                <div className="sup pos-tr"></div>
                <div className="sup pos-bl"></div>
                <div className="sup pos-br"></div>
            </div>
            <div className="spine"></div>
            <div className="cd-info">
                <h3>{cd.title}</h3>
                <p>{cd.artist}</p>
            </div>
            <button
                className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                onClick={onWishlistClick}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                ♥
            </button>
            <button
                className={`owned-btn ${owned ? 'active' : ''}`}
                onClick={onOwnedClick}
                title={owned ? 'Remove from owned' : 'Add to owned'}
            >
                ✓
            </button>
        </div>
    );
}

export default CdCard;