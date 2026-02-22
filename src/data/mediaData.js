export const mediaSections = [
  {
    title: 'CDs',
    actions: [
      { label: 'Add New CD', href: '/addnewrecipe' },
      { label: 'View CDs', href: '/recipe' },
      { label: 'Wishlist CD', href: '/deleterecipe' },
    ],
  },
  {
    title: 'Vinyls',
    actions: [
      { label: 'Add New Vinyl', href: '/addnewinventory' },
      { label: 'View Vinyls', href: '/viewinventory' },
      { label: 'Wishlist Vinyls', href: '/deleteinventory' },
    ],
  },
  {
    title: 'Cassettes',
    actions: [
      { label: 'Add New Cassette', href: '/addnewrecipe' },
      { label: 'View Cassettes', href: '/recipe' },
      { label: 'Wishlist Cassettes', href: '/deleterecipe' },
    ],
  },
  {
    title: 'Games',
    actions: [
      { label: 'Add New Game', href: '/addnewinventory' },
      { label: 'View Games', href: '/viewinventory' },
      { label: 'Wishlist Games', href: '/deleteinventory' },
    ],
  },
];

export const primaryFormats = ['CD', 'Cassette'];
export const inventoryFormats = ['Vinyl', 'Game'];

export const initialCollection = [
  { id: 1, title: 'Random Access Memories', creator: 'Daft Punk', format: 'CD', year: '2013' },
  { id: 2, title: 'The Dark Side of the Moon', creator: 'Pink Floyd', format: 'Vinyl', year: '1973' },
  { id: 3, title: 'Halo 3', creator: 'Bungie', format: 'Game', year: '2007' },
];

export const initialWishlist = [
  { id: 101, title: 'Thriller', creator: 'Michael Jackson', format: 'CD' },
  { id: 102, title: 'Abbey Road', creator: 'The Beatles', format: 'Vinyl' },
];
