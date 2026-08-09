import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState, useRef } from "react";
import '../css/Navbar.css'

function NavBar() {
    const location = useLocation();
    const links = useMemo(() => [
        { to: '/', label: 'Home' },
        { to: '/owned', label: 'Owned' },
        { to: '/wishlist', label: 'Wishlist' },
        { to: '/profile', label: 'Profile' },
    ], []);

    const linkRefs = useRef([]);
    const [activeBubble, setActiveBubble] = useState({ left: 0, width: 0, opacity: 0 });
    const [hoverBubble, setHoverBubble] = useState({ left: 0, width: 0, opacity: 0 });

    const setBubbleFromElement = (element, setter) => {
        if (!element) return;
        setter({
            left: element.offsetLeft,
            width: element.offsetWidth,
            opacity: 1,
        });
    };

    useEffect(() => {
        const activeIndex = links.findIndex(({ to }) => {
            if (to === '/') {
                return location.pathname === '/';
            }
            return location.pathname.startsWith(to);
        });

        const indexToUse = activeIndex === -1 ? 0 : activeIndex;
        setBubbleFromElement(linkRefs.current[indexToUse], setActiveBubble);
    }, [location.pathname, links]);

    return (
        <header className="navbar">
            <Link to="/" className="nav-logo">MELANGED</Link>

            <div className="nav-wrap" onMouseLeave={() => setHoverBubble((prev) => ({ ...prev, opacity: 0 }))}>
                <div
                    className="bubble active"
                    style={{ transform: `translateX(${activeBubble.left}px)`, width: `${activeBubble.width}px`, opacity: activeBubble.opacity }}
                    aria-hidden="true"
                />
                <div
                    className="bubble hover"
                    style={{ transform: `translateX(${hoverBubble.left}px)`, width: `${hoverBubble.width}px`, opacity: hoverBubble.opacity }}
                    aria-hidden="true"
                />

                <nav className="nav" aria-label="Primary">
                    {links.map(({ to, label }, index) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onMouseEnter={(event) => setBubbleFromElement(event.currentTarget, setHoverBubble)}
                            ref={(element) => {
                                linkRefs.current[index] = element;
                            }}
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default NavBar;