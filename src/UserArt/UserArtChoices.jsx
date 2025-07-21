import { useState } from "react"
import { FavMusicChoice } from "../components/MusicChoice/FavMusicChoice"
import { FavColorChoice } from "../components/ColorChoice/FavColorChoice"
import { EmotionChoice } from "../components/EmotionChoice/currentEmotionChoice"
import { AdjectiveChoice } from "../components/AdjectiveChoice/AdjectiveChoice"
import { AddTitleButton } from "../components/Buttons/AddTitleBtn"
import "./UserArtChoices.css"
export const UserArtChoices = () => {
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [selectedAdjective, setSelectedAdjective] = useState(null);

    const handleMusicChange = (musicId) => {
        setSelectedMusic(musicId);
        };
    const handleColorChange = (colorId) => {
        setSelectedColor(colorId);
        };
    const handleEmotionChange = (emotionId) => {
        setSelectedEmotion(emotionId);
        };
    const handleAdjectiveChange = (adjectiveId) => {
        setSelectedAdjective(adjectiveId);
        };

    return(
        <>
        <div className="user-art-choices"> 

            <h2> Build Your Monster</h2>
            
            <FavMusicChoice onMusicChange = {handleMusicChange}/>
            <FavColorChoice onColorChange = {handleColorChange}/>
            <EmotionChoice  onEmotionChange = {handleEmotionChange}/>
            <AdjectiveChoice  onAdjectiveChange= {handleAdjectiveChange}/>
            <AddTitleButton
                selectedMusic = {selectedMusic}
                selectedColor = {selectedColor}
                selectedEmotion = {selectedEmotion}
                selectedAdjective = {selectedAdjective}
             />
        </div>
        </>
    )
}
