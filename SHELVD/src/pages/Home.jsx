import CdCard from "../components/CDCard";
import {useState, useEffect} from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import '../css/Home.css'

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [cds, setCds] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
          try {
            const popularMovies = await getPopularMovies();
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

  const handleSearch = (e) => {   
    e.preventDefault();
    alert(searchQuery);
    setSearchQuery("Search for media....");
  }  

  return (
    <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input 
             type="text" 
             placeholder="Search for a CD...w" 
             className="search-input"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             />
            <button type="submit" className="search-button">Search</button>
        </form>


        <div className="cd-grid">
            {cds.map((cd) => 
                (
                <CdCard cd={cd} key={cd.id}/>  
                )
            )}
        </div>
    </div>
  );
}
export default Home;