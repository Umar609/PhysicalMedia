import '../css/Owned.css';
import { useCDContext } from '../contexts/CDContext';
import CdCard from '../components/CDCard';


function Owned() {
  const { owned } = useCDContext();

  if (owned) {
    return (
    <div className="owned">
          <h2>Your Owned</h2>
      <div className="cd-grid">
              {owned.map((cd) => 
                  (
                  <CdCard cd={cd} key={cd.id}/>  
                  ))}
          </div>
        </div>
    );
  }
 
  return (
    <div className="owned-empty">
        <h2>Your owned list is empty!</h2>
        <p>Start adding your owned media to see them here.</p>
    </div>
  )
}
export default Owned;