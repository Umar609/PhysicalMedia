import { Link } from 'react-router-dom';

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

export default NotFoundPage;
