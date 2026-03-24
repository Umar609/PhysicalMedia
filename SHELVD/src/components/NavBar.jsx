import { Link } from "react-router-dom";

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">SHELVD</Link>
        </div>
        <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/favourites">Favourites</Link>
        </div>
    </nav>
}

export default NavBar;