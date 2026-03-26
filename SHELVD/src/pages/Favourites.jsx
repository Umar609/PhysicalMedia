import '../css/Favorites.css';
import { useCDContext } from '../contexts/CDContext';
import CdCard from '../components/CDCard';


function Favourites() {
  const { favourites } = useCDContext();

  if (favourites) {
    return (
    <div className="favourites">
          <h2>Your Favourites</h2>
      <div className="cd-grid">
              {favourites.map((cd) => 
                  (
                  <CdCard cd={cd} key={cd.id}/>  
                  ))}
          </div>
        </div>
    );
  }
 
  return (
    <div className="favourites-empty">
        <h2>Your favourites list is empty!</h2>
        <p>Start adding your favourite media to see them here.</p>
    </div>
  )
}
export default Favourites;