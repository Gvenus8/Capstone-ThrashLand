import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SaveChoicesButton } from "../Buttons/ChoiceSaveBtn";
import "./Title.css";

export const AddTitle= () => {
    const location = useLocation();
    const {selectedColor, selectedMusic,selectedEmotion, selectedAdjective} = location.state
    const [title, setTitle] = useState("");
    
    return(
        <>
            <div className="title-group">
                <h3>Give Your THRASHER a Name</h3>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="form-text"
                        placeholder="NAME YOUR THRASHER!"
                        required
                    />
                <SaveChoicesButton
                   selectedMusic={selectedMusic}
                   selectedColor={selectedColor}
                   selectedEmotion={selectedEmotion}
                   selectedAdjective={selectedAdjective}
                   title= {title}                  
                />
            </div>
        </>
    )
}
        