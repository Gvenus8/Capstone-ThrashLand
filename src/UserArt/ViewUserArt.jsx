import { useEffect, useState } from "react"
import { getMonsterById } from "../fetches/MonsterFetch"
import { useLocation } from "react-router-dom";
import { ViewProfileBtn } from "../components/Buttons/ViewProfileBtn";
import { expandUserChoices } from "../fetches/UserFetches";

export const ViewArt = () => {
    
    const location = useLocation();
    const { selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title , id} = location.state;

    const [monster, setMonster] = useState(null);
    const [expandedMusic, setExpandedMusic] = useState(null);
    const [expandedColor, setExpandedColor] = useState(null);
    const [expandedEmotion, setExpandedEmotion] = useState(null);
    const [expandedAdjective, setExpandedAdjective] = useState(null);
   

    useEffect(() => {
        const monsterId = (selectedColor + selectedMusic + selectedEmotion + selectedAdjective);
        console.log(monsterId);
        getMonsterById(monsterId).then((monsterArray) => {
            setMonster(monsterArray[0]);
        });
    }, [selectedColor, selectedMusic, selectedEmotion, selectedAdjective]);

    useEffect(() => {
         expandUserChoices(selectedMusic, selectedColor, selectedEmotion, selectedAdjective)
            .then(({ music, color, emotion, adjective }) => {
                setExpandedMusic(music);
                setExpandedColor(color);
                setExpandedEmotion(emotion);
                setExpandedAdjective(adjective);
            });
    }, [selectedMusic, selectedColor, selectedEmotion, selectedAdjective]);

    if (!monster) {
        return (
            <div className="view-art-loading">
                <h2>Loading your monster...</h2>
            </div>
        );
    }
    
    return (
        <>
            <div className="view-art-container">
                <h2><strong>{title}</strong> </h2>
                <div>
                    <img className="monster-image" src={monster.url} alt="user-game-piece"/>
                    <div className = "monster-bio">
                        
                        {title} is a very {expandedAdjective?.adjective} monster.<br/>
                        {title} is {expandedEmotion?.emotion} and loves {expandedMusic?.music}.<br/>
                        {title}'s favorite color is {expandedColor?.color}.
                    
                    </div>
                </div>
            </div>
            <ViewProfileBtn/>
          
        </>
    );
}