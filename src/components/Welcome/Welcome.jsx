import "./Welcome.css"
import { useNavigate } from 'react-router-dom'

export const Welcome = () => {
   const navigate = useNavigate();

   const handleProfileClick = () => {
      navigate("/profile");
   }

   const handleCreateClick = () => {
      navigate("/userArtChoice");
   }

   const handlePlayClick = () => {
      navigate("/brickbreaker");
   }

   const handleLogoutClick = () => {
         localStorage.removeItem("thrashland_user");
        navigate("/login");
    }
   

    return (
        <>
        <div className = "welcome-container">
            <h1>WELCOME TO THRASHLAND</h1>
            <button onClick={handleProfileClick}>Profile</button>
            <button onClick={handleCreateClick}>Create</button>
            <button onClick={handlePlayClick}>Play</button>
            <button onClick={handleLogoutClick}>Logout</button>

    
        </div>
    
        </>
    )
}
