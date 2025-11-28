import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import { supabase } from "../../supabaseClient"

export const Register = () => {
  const [customer, setCustomer] = useState({
    email: "",
    name: "",
    password: "",
    total_score: 0,
    bio: ""  
  })
  let navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: customer.email,
      password: customer.password,
    })

    if (authError) {
      window.alert("Error creating account: " + authError.message)
      return
    }

    // Step 2: Add user info to your users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id, // Use the auth user's ID
        name: customer.name,
        email: customer.email,
        total_score: 0,
        bio: ""
      }])
      .select()

    if (userError) {
      window.alert("Error saving user data: " + userError.message)
      return
    }

    // Success! Navigate to welcome page
    window.alert("Account created successfully!")
    navigate("/welcome")
  }

  const updateCustomer = (event) => {
    const copy = { ...customer }
    copy[event.target.id] = event.target.value
    setCustomer(copy)
  }

  return (
    <main style={{ textAlign: "center" }}>
      <form className="form-login" onSubmit={handleRegister}>
        <h1></h1>
        <h2>JOIN US TODAY</h2>
        <fieldset className="lemon">
          <div className="form-group">
            <input
              onChange={updateCustomer}
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
        </fieldset>
        <fieldset className="lemon2">
          <div className="form-group">
            <input
              onChange={updateCustomer}
              type="email"
              id="email"
              className="form-control"
              placeholder="Email address"
              required
            />
          </div>
        </fieldset>
        <fieldset className="lemon">
          <div className="form-group">
            <input
              onChange={updateCustomer}
              type="password"
              id="password"
              className="form-control"
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
            />
          </div>
        </fieldset>
        <fieldset className="lemon">
          <div className="form-group">
            <button className="login-btn btn-info" type="submit">
              Register
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  )
}