import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import { getUserByEmail } from "../../fetches/UserFetches"

export const Login = () => {
  const [email, set] = useState("alice@example.com")
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    getUserByEmail(email).then((foundUsers) => {
      if (foundUsers.length === 1) {
        const user = foundUsers[0]
        localStorage.setItem(
          "thrashland_user",
          JSON.stringify({
            id: user.id,
           name: user.name,
          email: user.email,
          })
        )

        navigate("/welcome")
      } else {
        window.alert("Invalid login")
      }
    })
  }

  return (
    <main className="container-login">
      <section>
        <form className="form-login" onSubmit={handleLogin}>
          <h1></h1>
          <h2>PLEASE SIGN IN</h2>
          <fieldset className="lemon">
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(evt) => set(evt.target.value)}
                className="form-control"
                placeholder="Email address"
                required
                autoFocus
              />
            </div>
          </fieldset>
          <fieldset className="lemon2">
            <div className="form-group">
              <button className="login-btn btn-info" type="submit">
                Sign in
              </button>
            </div>
          </fieldset>
        </form>
      
      <div className="register-link">
        <Link to="/register" className="btn-link">READY TO THRASH?</Link>
      </div>
      </section>
    </main>
  )
}
