import { PostChoices } from "../../fetches/ChoicePost"
import { useNavigate } from "react-router-dom";
import "./saveBtn.css"

export const SaveChoicesButton = ({selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title}) => {
    const navigate = useNavigate();
    const SaveChoices = ( ) => {
        const user = JSON.parse(localStorage.getItem("thrashland_user"));
        const userId = user?.id;
        const Choices = {
            userId: userId,
            favMusicChoiceId: selectedMusic,
            favColorChoiceId: selectedColor,
            currentEmotionChoiceId: selectedEmotion,
            adjectiveChoiceId: selectedAdjective,
            title: title
        };
       if (selectedColor !== null
            && selectedMusic !== null
            && selectedEmotion !== null
            && selectedAdjective !== null
            && userId) {
        
            PostChoices(Choices);
            alert("A Monster is Born"); 
            
            navigate("/view-art", {
            state: { selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title, }
            });
        
        } else {
            alert("ERROR: Please select all choices before saving.");
        }
    }

    return (
        <div className="conatainer-save-btn" >
            <button
                className="save-btn btn-info"
                type="order"
                onClick={SaveChoices}>
                Create
            </button>
        </div>
    )
}
