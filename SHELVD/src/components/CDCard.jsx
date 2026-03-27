import '../css/MovieCard.css';
import { useCDContext } from '../contexts/CDContext';


function CdCard({cd}) {
    const {isFavourite, addToFavourites, removeFromFavourites} = useCDContext();
    const favourite = isFavourite(cd.id);
        const imageSrc = cd.poster_path?.startsWith("http")
            ? cd.poster_path
            : `https://image.tmdb.org/t/p/w500${cd.poster_path}`;

    function onfavouriteClick(e) {
       e.preventDefault()
       if (favourite) removeFromFavourites(cd.id)
       else addToFavourites(cd)
    }

  return <div className="cd-card">
    <div className="cd-cover">
        <img src={imageSrc} alt={cd.title}/>
        <div className="cd-overlay">
            <button className={`favourite-btn ${favourite ? "active" : ''}`} onClick={onfavouriteClick}>
                ♥
            </button>
        </div>
    </div>
    <div className="cd-info">
        <h3>{cd.title}</h3>
        <p>{cd.artist}</p>
    </div>
  </div>
}

export default CdCard;