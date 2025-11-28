
import { useNavigate } from "react-router-dom";
import "./Arcade.css";

export const Arcade = () => {
    const navigate = useNavigate();

    const handlePitButtonClick = () => {
        navigate("/brickbreaker");
    }
    return (
        <div className="arcade">
            <div className="arcade-header">ARCADE</div>
            <div className="arcade-container">
                <div className="arcade-image-container">
                    <div className="arcade-image"></div>
                </div>
                <div className="arcade-description">
                    <div className="arcade-text">GAMES</div>
                    <button className="Pitmaster-button" onClick={handlePitButtonClick}>
                    </button>
                    <button className="shredbutton">
                    </button>
                    <button className="micdrop-button" >
                    </button>
                </div>
            </div>
        </div>
    );
}
