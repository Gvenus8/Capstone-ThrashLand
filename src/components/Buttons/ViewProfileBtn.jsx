import React from "react";
import { useNavigate } from "react-router-dom";

export const ViewProfileBtn = ({selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title, }) => {
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate("/profile");
    }

    return (
            <div className="conatainer-view-btn" >
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
