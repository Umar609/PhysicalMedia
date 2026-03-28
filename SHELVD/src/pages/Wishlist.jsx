import '../css/Wishlist.css';
import { useCDContext } from '../contexts/CDContext';
import CdCard from '../components/CDCard';


function Wishlist() {
  const { wishlist } = useCDContext();

  if (wishlist) {
    return (
    <div className="wishlist">
          <h2>Your Wishlist</h2>
      <div className="cd-grid">
              {wishlist.map((cd) => 
                  (
                  <CdCard cd={cd} key={cd.id}/>  
                  ))}
          </div>
        </div>
    );
  }
 
  return (
    <div className="wishlist-empty">
        <h2>Your wishlist is empty!</h2>
        <p>Start adding your owned media to see them here.</p>
    </div>
  )
}
export default Wishlist;