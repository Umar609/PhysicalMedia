import '../css/MovieCard.css';
import { useCDContext } from '../contexts/CDContext';

function CdCard({cd}) {
    const {isFavourite, addToFavourites, removeFromFavourites} = useCDContext();
    const favourite = isFavourite(cd.id);
    const imageSrc = cd.poster_path?.startsWith("http")
        ? cd.poster_path
        : `https://image.tmdb.org/t/p/w500${cd.poster_path}`;

    function onfavouriteClick(e) {
        e.preventDefault();
        if (favourite) removeFromFavourites(cd.id);
        else addToFavourites(cd);
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
                className={`favourite-btn ${favourite ? 'active' : ''}`}
                onClick={onfavouriteClick}
                title={favourite ? 'Remove from favourites' : 'Add to favourites'}
            >
                ♥
            </button>
        </div>
    );
}

export default CdCard;