import { useEffect, useState } from "react"
import { getColorChoice } from "../../fetches/ChoiceFetches"

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
            <h2>Whats Your Favorite Color?</h2>
            <div>
                {allColorChoices.map((color) => (
                    <label key={color.id}>
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