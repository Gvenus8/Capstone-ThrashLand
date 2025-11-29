import "./NavBar.css"
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from "../../supabaseClient"

export const AdminNavBar = () => {
    const navigate = useNavigate();

    const HandleLogout = async () => {
        await supabase.auth.signOut();
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
                <Link to="/arcade">Arcade</Link>
            </li>
             <li className = "navbar-item">
                <Link to="/community">Stats</Link>
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