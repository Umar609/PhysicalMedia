import { Link } from "react-router-dom";
import '../css/Navbar.css'

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">SHELVD</Link>
        </div>
        <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/owned">Owned</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/profile">Profile</Link>
        </div>
    </nav>
}

export default NavBar;