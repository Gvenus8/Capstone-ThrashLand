import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import { supabase } from "../../supabaseClient"

export const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()


    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (authError) {
      window.alert("Invalid login: " + authError.message)
      return
    }

   
    navigate("/welcome")
  }

  const updateCredentials = (evt) => {
    const copy = { ...credentials }
    copy[evt.target.name] = evt.target.value
    setCredentials(copy)
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
                name="email"
                value={credentials.email}
                onChange={updateCredentials}
                className="form-control"
                placeholder="Email address"
                required
                autoFocus
              />
            </div>
          </fieldset>
          <fieldset className="lemon">
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={updateCredentials}
                className="form-control"
                placeholder="Password"
                required
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