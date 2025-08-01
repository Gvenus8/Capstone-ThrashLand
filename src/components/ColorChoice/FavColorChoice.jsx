import { useEffect, useState } from "react"
import { getColorChoice } from "../../fetches/ChoiceFetches"
import "./FavColorChoice.css"

export const FavColorChoice = ({onColorChange}) => {
    const [allColorChoices, setAllColorChoices] = useState([]);

    useEffect(() => {
        getColorChoice().then((colorArray) => {
            setAllColorChoices(colorArray);
           
        })
    }, [])

    return (
    <>
        <div className="favcolor">
            <div className="color-choice-title">WHO IS SUPREME?</div>
            <div>
                {allColorChoices.map((color) => (
                    <label key={color.id} className="color-choice-label">
                        <input
                            className="color-choice-input"
                            type="radio"
                            value={color.id}
                            name="color-choice"
                            onChange = {(event) => onColorChange(parseInt(event.target.value))}
                        />
                        {color.color}
                    </label>
                ))}
            </div>
        </div>
    </>
)
}