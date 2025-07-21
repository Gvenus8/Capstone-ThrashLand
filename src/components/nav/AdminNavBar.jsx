import "./NavBar.css"
import { Link, useNavigate } from 'react-router-dom'

export const AdminNavBar = () => {
    const navigate = useNavigate();

    const HandleLogout = () => {
        localStorage.removeItem("thrashland_user");
        navigate("/login");
    }

    return (
        <ul className = "navBar">
            <li className = "navbar-item">
                <Link to = "/welcome">Home</Link>
            </li>
            <li className = "navbar-item">
                <Link to = "/userArtChoice">Create+</Link>
            </li>
            <li className = "navbar-item">
                <Link to="/brickbreaker">Play</Link>
            </li>
            <li className = "navbar-item">
                <Link to = "/profile">Profile</Link>
            </li>
             <li className = "navbar-item">
                <Link to = "/admin">Admin</Link>
            </li>
            <li className = "navbar-item">
                <button onClick = {HandleLogout}>Logout</button>
            </li>
        </ul >
    )
}