import '../css/LogIn.css'

function LogIn() {
  return (
    <section className="login-page">
      <form className="form-control" action="">
        <p className="title">Login</p>
        <div className="input-field">
          <input id="login-email" required className="input" type="text" />
          <label className="label" htmlFor="login-email">Enter Email</label>
        </div>
        <div className="input-field">
          <input id="login-password" required className="input" type="password" />
          <label className="label" htmlFor="login-password">Enter Password</label>
        </div>
        <a href="#">Forgot your password?</a>
        <button className="submit-btn" type="submit">Log In</button>
      </form>
    </section>
  )
}

export default LogIn
