import {createContext, useState, useContext, useEffect} from "react";

const CDContext = createContext();

export const useCDContext  = () => useContext(CDContext);

export const CDProvider = ({children}) => {
    const [favourites, setFavourites] = useState([])
    const [wishlist, setWishlist] = useState([])
    
    useEffect(() => {
        const storedFavs = localStorage.getItem("favourites")
        const storedWishlist = localStorage.getItem("wishlist")
        
        if (storedFavs) setFavourites(JSON.parse(storedFavs));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    }, [])

    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites])

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist])

    const addToFavourites = (cd) => {
            setFavourites(prev => [...prev, cd]);
        }

    const removeFromFavourites = (cdId) => {
        setFavourites(prev => prev.filter(cd => cd.id !== cdId));
    }

    const isFavourite = (cdId) => {
        return favourites.some(cd => cd.id === cdId);
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
        favourites,
        addToFavourites,
        removeFromFavourites,
        isFavourite,
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