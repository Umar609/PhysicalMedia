import { Link } from 'react-router-dom';

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

export default PageLayout;
