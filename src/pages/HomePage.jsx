import { Link } from 'react-router-dom';

function HomePage({ mediaSections }) {
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

export default HomePage;
