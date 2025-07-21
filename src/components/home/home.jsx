import { Link } from "react-router-dom";
import "./Home.css";

export const Home = () => {
    return (
        <div>
            <h5>Welcome to ThrashLand</h5>
            <div className="login-buttons">
                        <Link to="/login" className="btn primary">
                            Login
                        </Link>
                        <Link to="/register" className="btn secondary">
                            Sign Up
                        </Link>
                    </div>
        </div>
    );
};
