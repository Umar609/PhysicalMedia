import { useState } from 'react';
import { Link } from 'react-router-dom';

function MediaFormPage({ title, formats, buttonText, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    year: '',
    format: formats[0],
  });

  const [savedMessage, setSavedMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setSavedMessage(`${formData.title} added successfully.`);
    setFormData((prev) => ({ ...prev, title: '', creator: '', year: '' }));
  };

  return (
    <main className="flex-shrink-0 d-flex align-items-center justify-content-center">
      <div className="container my-5" style={{ maxWidth: '720px' }}>
        <div className="card shadow-sm">
          <div className="card-body p-4 p-md-5">
            <h2 className="mb-4 text-center">{title}</h2>

            {savedMessage && <div className="alert alert-success">{savedMessage}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Artist / Creator</label>
                <input
                  className="form-control"
                  name="creator"
                  value={formData.creator}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Format</label>
                  <select className="form-select" name="format" value={formData.format} onChange={handleChange}>
                    {formats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Year</label>
                  <input
                    className="form-control"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button type="submit" className="btn btn-primary">
                  {buttonText}
                </button>
                <Link className="btn btn-outline-secondary" to="/">
                  Back
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MediaFormPage;
