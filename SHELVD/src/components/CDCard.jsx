import '../css/MovieCard.css';

function CdCard({cd}) {

    function onfavouriteClick() {
       alert("Favourite button clicked!");
    }

  return <div className="cd-card">
    <div className="cd-cover">
        <img src={`https://image.tmdb.org/t/p/w500${cd.poster_path}`} alt={cd.title}/>
        <div className="cd-overlay">
            <button className="favourite-btn" onClick={onfavouriteClick}>
                🤍
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