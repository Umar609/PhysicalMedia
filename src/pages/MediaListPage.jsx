import { Link } from 'react-router-dom';

function MediaListPage({ title, items, onRemove, emptyMessage }) {
  return (
    <main className="flex-shrink-0 d-flex align-items-center justify-content-center">
      <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
              <h2 className="mb-0">{title}</h2>
              <Link className="btn btn-outline-secondary" to="/">
                Back to Dashboard
              </Link>
            </div>

            {items.length === 0 ? (
              <p className="text-muted mb-0">{emptyMessage}</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Creator</th>
                      <th>Format</th>
                      <th>Year</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.creator}</td>
                        <td>{item.format}</td>
                        <td>{item.year || '-'}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(item.id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MediaListPage;
