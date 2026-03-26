import {createContext, useState, useContext, useEffect} from "react";

const CDContext = createContext();

export const useCDContext  = () => useContext(CDContext);

export const CDProvider = ({children}) => {
    const [favourites, setFavourites] = useState([])
    
    useEffect(() => {
        const storedFavs = localStorage.getItem("favourites")
        
        if (storedFavs) setFavourites(JSON.parse(storedFavs));
    }, [])

    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites])

    const addToFavourites = (cd) => {
            setFavourites(prev => [...prev, cd]);
        }

    const removeFromFavourites = (cdId) => {
        setFavourites(prev => prev.filter(cd => cd.id !== cdId));
    }

    const isFavourite = (cdId) => {
        return favourites.some(cd => cd.id === cdId);
    }

    const value = {
        favourites,
        addToFavourites,
        removeFromFavourites,
        isFavourite
    }

    return (
        <CDContext.Provider value={value}>
            {children}
        </CDContext.Provider>
    );
}