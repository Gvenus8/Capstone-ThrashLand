import { PostChoices } from "../../fetches/ChoicePost"
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./saveBtn.css"

export const SaveChoicesButton = ({selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title}) => {
    const navigate = useNavigate();
    
    const SaveChoices = async () => {
        // Get user from Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        
        const Choices = {
            user_id: userId,  // Changed to snake_case for database
            fav_music_choice_id: selectedMusic,
            fav_color_choice_id: selectedColor,
            current_emotion_choice_id: selectedEmotion,
            adjective_choice_id: selectedAdjective,
            title: title
        };
        
        if (selectedColor !== null
            && selectedMusic !== null
            && selectedEmotion !== null
            && selectedAdjective !== null
            && userId) {
        
            await PostChoices(Choices);
            alert("A Monster is Born"); 
            
            navigate("/view-art", {
                state: { selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title }
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