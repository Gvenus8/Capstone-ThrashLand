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
            <h2>How would you describe your Monster? </h2>
            <div>
                {allAdjectiveChoices.map((adjective) => (
                    <label key={adjective.id}>
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