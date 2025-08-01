import { useEffect, useState } from "react"
import { getAdjectiveChoice } from "../../fetches/ChoiceFetches"
import "./AdjectiveChoice.css"
export const AdjectiveChoice = ({onAdjectiveChange}) => {
    const [allAdjectiveChoices, setAllAdjectiveChoices] = useState([]);

    useEffect(() => {
        getAdjectiveChoice().then((adjectiveArray) => {
            setAllAdjectiveChoices(adjectiveArray);
            
        })
    }, [])

    return (
    <>
        <div className="adjectives">
            <div className="adjective-choice-title">HOW WOULD YOU DESCRIBE YOUR THRASHER? </div>
            <div>
                {allAdjectiveChoices.map((adjective) => (
                    <label key={adjective.id} className="adjective-choice-label">
                        <input
                            className="adjective-choice-input"
                            type="radio"
                            value={adjective.id}
                            name="adjective-choice"
                            onChange = {(event) => onAdjectiveChange(parseInt(event.target.value))}
                        />  
                         
                        {adjective.adjective}
                    </label>
                ))}
            </div>
        </div>
    </>
)
}