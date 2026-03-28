import '../css/MovieCard.css';
import { useCDContext } from '../contexts/CDContext';

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
    const imageSrc = cd.poster_path?.startsWith("http")
        ? cd.poster_path
        : `https://image.tmdb.org/t/p/w500${cd.poster_path}`;

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
                style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.15),rgba(255,255,255,0)), url(${imageSrc})` }}
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