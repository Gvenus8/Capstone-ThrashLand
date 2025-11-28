import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import { getUserByEmail, createUser } from "../../fetches/UserFetches"



export const Register = () => {
  const [customer, setCustomer] = useState({
    email: "",
    name: "",
    total_score: 0,
    bio: ""  
  })
  let navigate = useNavigate()

  const registerNewUser = () => {
    createUser(customer).then((createdUser) => {
     if (createdUser.id) {
        localStorage.setItem(
          "thrashland_user",
          JSON.stringify({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            total_score: createdUser.total_score || 0,

          })
        )

        navigate("/welcome")
      }
    })
  }

  const handleRegister = (event) => {
    event.preventDefault()
    getUserByEmail(customer.email).then((response) => {
      if (response.length > 0) {
        window.alert("Account with that email address already exists")
      } else {
        registerNewUser()
      }
    })
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
            <button className="login-btn btn-info" type="submit">
              Register
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  )
}
