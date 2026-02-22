import { useState } from 'react';
import { Link } from 'react-router-dom';

function WishlistManagerPage({ title, formats, items, onAdd, onRemove, emptyMessage }) {
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    format: formats[0],
  });

  const [savedMessage, setSavedMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(formData);
    setSavedMessage(`${formData.title} added to wishlist.`);
    setFormData((prev) => ({ ...prev, title: '', creator: '' }));
  };

  return (
    <main className="flex-shrink-0 d-flex align-items-center justify-content-center">
      <div className="container my-5">
        <div className="card shadow-sm">
          <div className="card-body p-4 p-md-5">
            <h2 className="mb-4">{title}</h2>

            {savedMessage && <div className="alert alert-success">{savedMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Artist / Creator</label>
                  <input
                    className="form-control"
                    name="creator"
                    value={formData.creator}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Format</label>
                  <select className="form-select" name="format" value={formData.format} onChange={handleChange}>
                    {formats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-primary">
                  Add to Wishlist
                </button>
              </div>
            </form>

            <hr className="my-4" />

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
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.creator}</td>
                        <td>{item.format}</td>
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

            <div className="mt-4">
              <Link className="btn btn-outline-secondary" to="/">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WishlistManagerPage;
