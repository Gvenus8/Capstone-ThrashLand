import { useEffect, useState } from "react"
import { getEmotionChoice } from "../../fetches/ChoiceFetches"

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
            <h2>How are you Feeling?</h2>
            <div>
                {allEmotionChoices.map((emotion) => (
                    <label key={emotion.id}>
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