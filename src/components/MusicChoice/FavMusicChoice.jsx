import { useEffect, useState } from "react"
import { getMusicChoice } from "../../fetches/ChoiceFetches"
import "./FavMusicChoice.css"

export const FavMusicChoice = ({onMusicChange}) => {
    const [allMusicChoice, setAllMusicChoice] = useState([]);

    useEffect(() => {
        getMusicChoice().then((musicArray) => {
            setAllMusicChoice(musicArray);
            console.log("music picked");
        })
    }, [])

    return (
    <>
        <div className="favmusic">
            <div className="music-choice-title">HOW DO YOU LIKE YOUR METAL?</div>
            <div>
                {allMusicChoice.map((music) => (
                    <label key={music.id} className="music-choice-label">
                        <input
                            className="music-choice-input"
                            type="radio"
                            value={music.id}
                            name="music-choice"
                            onChange = {(event) => onMusicChange(parseInt(event.target.value))}
                        />                      
                        {music.genre}
                    </label>
                ))}
            </div>
        </div>
    </>
)
}