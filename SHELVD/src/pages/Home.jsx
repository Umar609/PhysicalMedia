import CdCard from "../components/CDCard";
import {useState} from "react";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");

    const cds = [
        {id: 1, title: "Dawn FM", artist: "The Weeknd", year: 2022},
        {id: 2, title: "Hurry Up Tomorrow", artist: "The Weeknd", year: 2025},
        {id: 3, title: "Casino", artist: "Baby Keem", year: 2026},
        {id: 4, title: "The Melodic Blue", artist: "Baby Keem", year: 2024},
    ];

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
             placeholder="Search for a CD..." 
             className="search-input"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             />
            <button type="submit" className="search-button">Search</button>
        </form>
        <div className="cd-grid">
            {cds.map(cd => <CdCard cd={cd} key={cd.id}/> )}
        </div>
    </div>
  );
}
export default Home;