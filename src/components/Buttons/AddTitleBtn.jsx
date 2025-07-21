import { ViewArt } from "../../UserArt/ViewUserArt"
import { useNavigate } from "react-router-dom";

export const AddTitleButton = ({selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title }) => {
    const navigate = useNavigate();
    
    const handleViewClick = () => {
        navigate("/add-Title", {
            state: { selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title }
        });
    }
    return (
        <div className="conatainer-view-btn" >
            <button
                className="view-btn"
                type="order"
                onClick={handleViewClick}
                >
                Next
            </button>
        </div>
    )
}
    

