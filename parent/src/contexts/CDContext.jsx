import {createContext, useState, useContext, useEffect} from "react";

const CDContext = createContext();

export const useCDContext  = () => useContext(CDContext);

export const CDProvider = ({children}) => {
    const [owned, setOwned] = useState([])
    const [wishlist, setWishlist] = useState([])
    
    useEffect(() => {
        const storedOwned = localStorage.getItem("owned")
        const storedWishlist = localStorage.getItem("wishlist")
        
        if (storedOwned) setOwned(JSON.parse(storedOwned));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    }, [])

    useEffect(() => {
        localStorage.setItem("owned", JSON.stringify(owned));
    }, [owned])

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist])

    const addToOwned = (cd) => {
            setOwned(prev => [...prev, cd]);
        }

    const removeFromOwned = (cdId) => {
        setOwned(prev => prev.filter(cd => cd.id !== cdId));
    }

    const isOwned = (cdId) => {
        return owned.some(cd => cd.id === cdId);
    }

    const addToWishlist = (cd) => {
        setWishlist(prev => [...prev, cd]);
    }

    const removeFromWishlist = (cdId) => {
        setWishlist(prev => prev.filter(cd => cd.id !== cdId));
    }

    const isWishlisted = (cdId) => {
        return wishlist.some(cd => cd.id === cdId);
    }

    const value = {
        owned,
        addToOwned,
        removeFromOwned,
        isOwned,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted
    }

    return (
        <CDContext.Provider value={value}>
            {children}
        </CDContext.Provider>
    );
}