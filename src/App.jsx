import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLayout from './components/PageLayout';
import {
  initialCollection,
  initialWishlist,
  inventoryFormats,
  mediaSections,
  primaryFormats,
} from './data/mediaData';
import HomePage from './pages/HomePage';
import MediaFormPage from './pages/MediaFormPage';
import MediaListPage from './pages/MediaListPage';
import NotFoundPage from './pages/NotFoundPage';
import WishlistManagerPage from './pages/WishlistManagerPage';

function App() {
  const [collection, setCollection] = useState(initialCollection);
  const [wishlist, setWishlist] = useState(initialWishlist);

  const addCollectionItem = (item) => {
    setCollection((prev) => [{ id: Date.now(), ...item }, ...prev]);
  };

  const addWishlistItem = (item) => {
    setWishlist((prev) => [{ id: Date.now(), ...item }, ...prev]);
  };

  const removeCollectionItem = (id) => {
    setCollection((prev) => prev.filter((item) => item.id !== id));
  };

  const removeWishlistItem = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const primaryCollection = collection.filter((item) => primaryFormats.includes(item.format));
  const inventoryCollection = collection.filter((item) => inventoryFormats.includes(item.format));
  const primaryWishlist = wishlist.filter((item) => primaryFormats.includes(item.format));
  const inventoryWishlist = wishlist.filter((item) => inventoryFormats.includes(item.format));

  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage mediaSections={mediaSections} />} />
        <Route
          path="/addnewrecipe"
          element={
            <MediaFormPage
              title="Add New CD / Cassette"
              formats={primaryFormats}
              buttonText="Save Media"
              onSubmit={addCollectionItem}
            />
          }
        />
        <Route
          path="/recipe"
          element={
            <MediaListPage
              title="CDs & Cassettes Collection"
              items={primaryCollection}
              onRemove={removeCollectionItem}
              emptyMessage="No CDs or cassettes saved yet."
            />
          }
        />
        <Route
          path="/deleterecipe"
          element={
            <WishlistManagerPage
              title="CDs & Cassettes Wishlist"
              formats={primaryFormats}
              items={primaryWishlist}
              onAdd={addWishlistItem}
              onRemove={removeWishlistItem}
              emptyMessage="No CD or cassette wishlist items yet."
            />
          }
        />
        <Route
          path="/addnewinventory"
          element={
            <MediaFormPage
              title="Add New Vinyl / Game"
              formats={inventoryFormats}
              buttonText="Save Media"
              onSubmit={addCollectionItem}
            />
          }
        />
        <Route
          path="/viewinventory"
          element={
            <MediaListPage
              title="Vinyls & Games Collection"
              items={inventoryCollection}
              onRemove={removeCollectionItem}
              emptyMessage="No vinyls or games saved yet."
            />
          }
        />
        <Route
          path="/deleteinventory"
          element={
            <WishlistManagerPage
              title="Vinyls & Games Wishlist"
              formats={inventoryFormats}
              items={inventoryWishlist}
              onAdd={addWishlistItem}
              onRemove={removeWishlistItem}
              emptyMessage="No vinyl or game wishlist items yet."
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
