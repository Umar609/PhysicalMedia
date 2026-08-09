import '../css/LandingPage.css'

function Landing() {
  return (
    <section className="landing-page">
      <form className="form-control" action="">
        <p className="title">Melanged</p>
        <p className="title">Physical Media Collection Site!</p>
        <div className="landing-actions">
          <button className="submit-btn" type="submit">Log In</button>
          <button className="submit-btn" type="submit">Sign Up</button>
        </div>
      </form>
    </section>
  )
}
export default Landing;
