import React from "react";
import { useNavigate } from "react-router-dom";
import "./ViewProfileBtn.css";

export const ViewProfileBtn = ({selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title, }) => {
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate("/profile");
    }

    return (
            <div className="viewbtn" >
                <button
                    className="view-btn btn-info"
                    type="order"
                    onClick={handleViewClick}
                    >
                    View Profile
                </button>
            </div>
    
        )

}
