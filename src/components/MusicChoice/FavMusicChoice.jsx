import { useEffect, useState } from "react"
import { getMusicChoice } from "../../fetches/ChoiceFetches"

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
            <h2>What Kind of Music Does Your Monster like?</h2>
            <div>
                {allMusicChoice.map((music) => (
                    <label key={music.id}>
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