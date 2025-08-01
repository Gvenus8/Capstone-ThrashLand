import { useEffect, useState } from "react"
import { getEmotionChoice } from "../../fetches/ChoiceFetches"
import "./currentEmotionChoice.css"

export const EmotionChoice = ({onEmotionChange}) => {
    const [allEmotionChoices, setAllEmotionChoices] = useState([]);

    useEffect(() => {
        getEmotionChoice().then((emotionArray) => {
            setAllEmotionChoices(emotionArray);
            console.log("emotion picked");
        })
    }, [])

    return (
    <>
        <div className="current-emotion">
            <div className="emotion-choice-title">WEAPON OF CHOICE?</div>
            <div>
                {allEmotionChoices.map((emotion) => (
                    <label key={emotion.id} className="emotion-choice-label">
                        <input
                            className="emotion-choice-input"
                            type="radio"
                            value={emotion.id}
                            name="emotion-choice"
                        onChange = {(event) => onEmotionChange(parseInt(event.target.value))}
                        />
                        {emotion.emotion}
                    </label>
                ))}
            </div>
        </div>
    </>
)
}