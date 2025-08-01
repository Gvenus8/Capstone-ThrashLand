import { useNavigate } from "react-router-dom";
import "./Home.css";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="home-container">
            <h5></h5>
            <div className="login-buttons">
                         <button 
                    className="btn-primary btn-info" 
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
                <button 
                    className="btn-secondary btn-info" 
                    onClick={() => navigate("/register")}
                >
                    Register
                </button>
            </div>
        </div>
    );
};