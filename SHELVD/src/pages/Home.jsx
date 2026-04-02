import CdCard from "../components/CDCard";
import {useState, useEffect} from "react";
import { searchCDs, getPopularCDs } from "../services/api";
import '../css/Home.css'

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [cds, setCds] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
          try {
            const popularMovies = await getPopularCDs();
            setCds(popularMovies);
          } catch (err) {
            console.log(err)
            setError("Failed to load popular movies. Please try again later.");
          }
          finally {
            setLoading(false);
          }
        };

        loadPopularMovies();
    }, []);

  const handleSearch = async (e) => {   
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);

    try {
      const searchResults = await searchCDs(searchQuery);
      setCds(searchResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("An error occurred while searching. Please try again.");
    } finally {      
      setLoading(false);
    }
  };  

  return (
    <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input 
             type="text" 
             placeholder="Search for a CD" 
             className="search-input"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             />
            <button type="submit" className="search-button">Search</button>
        </form>


          {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (        
        <div className="cd-grid">
            {cds.map((cd) => 
                (
                <CdCard cd={cd} key={cd.id}/>  
                ))}
        </div>
      )}
    </div>
  );
}
export default Home;