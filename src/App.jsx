import { Link, Route, Routes } from 'react-router-dom';

const mediaSections = [
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

const routePages = [
  { path: '/addnewrecipe', title: 'Add New CD' },
  { path: '/recipe', title: 'View CDs & Cassettes' },
  { path: '/deleterecipe', title: 'Wishlist CDs & Cassettes' },
  { path: '/addnewinventory', title: 'Add New Vinyl / Game' },
  { path: '/viewinventory', title: 'View Vinyls / Games' },
  { path: '/deleteinventory', title: 'Wishlist Vinyls / Games' },
];

function PageLayout({ children }) {
  return (
    <div className="d-flex flex-column h-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container-fluid">
          <Link className="btn btn-outline-light me-auto" to="/">
            Home
          </Link>
        </div>
      </nav>

      {children}

      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5 className="border-bottom border-light pb-2">Physical Media Collection</h5>
              <p className="mb-1">Umar Muheed</p>
              <p className="mb-1">Test</p>
              <p className="small">A comprehensive look into a person's Physical Media Collection.</p>
            </div>

            <div className="col-md-4">
              <h5 className="border-bottom border-light pb-2">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/" className="text-light text-decoration-none">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/recipe" className="text-light text-decoration-none">
                    Test
                  </Link>
                </li>
                <li>
                  <Link to="/viewinventory" className="text-light text-decoration-none">
                    Test
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-4">
              <h5 className="border-bottom border-light pb-2">Information</h5>
              <p className="mb-1">About</p>
              <p className="mb-0">Contact</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <main className="flex-shrink-0 d-flex flex-column align-items-center justify-content-center">
      <div className="container m-3">
        <div className="mt-4 p-5 bg-primary text-white rounded text-center">
          <h1>SHELVED - A Physical Media Catalogue</h1>
          <h4>Umar Muheed</h4>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          {mediaSections.map((section) => (
            <div className="col-md-6 mb-4" key={section.title}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="container m-3">
                    <div className="mt-3 p-2 bg-white text-black rounded text-center">
                      <p>{section.title}</p>
                    </div>
                  </div>

                  {section.actions.map((action) => (
                    <div className="container m-3 text-center" key={`${section.title}-${action.label}`}>
                      <h2>
                        <Link className="btn btn-primary" to={action.href}>
                          {action.label}
                        </Link>
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function PlaceholderPage({ title }) {
  return (
    <main className="flex-shrink-0 d-flex align-items-center justify-content-center">
      <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-body text-center p-5">
            <h2 className="mb-3">{title}</h2>
            <p className="mb-4">This page is now routed by React. Add your form/table component here next.</p>
            <Link className="btn btn-primary" to="/">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="flex-shrink-0 d-flex align-items-center justify-content-center">
      <div className="container my-5 text-center">
        <h2>404 - Page Not Found</h2>
        <p className="mb-4">The route you entered does not exist.</p>
        <Link className="btn btn-primary" to="/">
          Go Home
        </Link>
      </div>
    </main>
  );
}

function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {routePages.map((route) => (
          <Route key={route.path} path={route.path} element={<PlaceholderPage title={route.title} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
