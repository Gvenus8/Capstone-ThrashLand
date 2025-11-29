import { ViewArt } from "../../UserArt/ViewUserArt"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserArtById } from "../../fetches/UserFetches";
import { supabase } from "../../supabaseClient";
import "./addTitleBtn.css"

export const AddTitleButton = ({selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title }) => {
    const navigate = useNavigate();
    const [hasExistingArt, setHasExistingArt] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkExistingArt = async () => {
            try {
                // Get user from Supabase Auth
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    const userArt = await getUserArtById(user.id);
                    
                    if (userArt && userArt.length > 0) {
                        setHasExistingArt(true);
                    } else {
                        setHasExistingArt(false);
                    }
                }
            } catch (error) {
                console.error("Error checking existing art:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkExistingArt();
    }, []);
    
    const handleViewClick = () => {
        if (hasExistingArt) {
            alert("Please delete your Thrasher first!");
            return;
        }
    
        navigate("/add-Title", {
            state: { selectedColor, selectedMusic, selectedEmotion, selectedAdjective, title }
        });
    }
    
    if (isLoading) {
        return (
            <div className="conatainer-view-btn">
                <button className="view-btn" disabled>
                    Loading...
                </button>
            </div>
        );
    } 

    return (
        <div className="conatainer-view-btn" >
            <button
                className="view-btn"
                type="order"
                onClick={handleViewClick}
            >
                Next
            </button>
        </div>
    )
}