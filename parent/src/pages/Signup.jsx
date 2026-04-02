import '../css/Signup.css'

function SignUp() {
  return (
    <section className="signup-page">
      <form className="form-control" action="">
        <p className="title">Sign Up</p>
        <div className="input-field">
          <input id="signup-username" required className="input" type="text" />
          <label className="label" htmlFor="signup-username">Enter Username</label>
        </div>
        <div className="input-field">
          <input id="signup-email" required className="input" type="email" />
          <label className="label" htmlFor="signup-email">Enter Email</label>
        </div>
        <div className="input-field">
          <input id="signup-password" required className="input" type="password" />
          <label className="label" htmlFor="signup-password">Enter Password</label>
        </div>
        <div className="input-field">
          <input id="signup-confirm-password" required className="input" type="password" />
          <label className="label" htmlFor="signup-confirm-password">Confirm Password</label>
        </div>
        <button className="submit-btn" type="submit">Sign Up</button>
      </form>
    </section>
  )
}

export default SignUp
