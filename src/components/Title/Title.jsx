import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SaveChoicesButton } from "../Buttons/ChoiceSaveBtn";

export const AddTitle= () => {
    const location = useLocation();
    const {selectedColor, selectedMusic,selectedEmotion, selectedAdjective} = location.state
    const [title, setTitle] = useState("");
    
    return(
        <>
            <div className="form-group">
                <h3>Give Your Monster A Name</h3>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="form-text"
                        placeholder="name your beast!"
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
        