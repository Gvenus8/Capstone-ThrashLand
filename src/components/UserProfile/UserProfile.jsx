import { useState, useEffect, } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserArtById, getUserById } from "../../fetches/UserFetches.jsx";
import { DeleteFetch } from "../../fetches/Deletefetch.jsx";
import { updateUserBio, updateUserEmail } from "../../fetches/userProfileFetches.jsx";
import { updateUserName } from "../../fetches/userProfileFetches.jsx";
import "./UserProfile.css";
import { getMonsterById } from "../../fetches/MonsterFetch.jsx"

export const UserProfile = () => {

    const [user, setUser] = useState({});
    const [bio, setBio] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [name, setName] = useState("");
    const [userArt, setUserArt] = useState([]);
    const [email, setEmail] = useState("");
    const [monster, setMonster] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("thrashland_user"))?.id;
        if (userId) {
            getUserById(userId).then((data) => {
                setUser(data[0]);
                setBio(data[0]?.bio || "");
                setName(data[0]?.name || "");
                setEmail(data[0]?.email || "");
            });

            getUserArtById(userId).then(artData => {
                setUserArt(artData);
                if (artData && artData.length > 0) {
                    const firstArt = artData[0];
                    const monsterId = firstArt.favMusicChoiceId + firstArt.favColorChoiceId +
                        firstArt.currentEmotionChoiceId + firstArt.adjectiveChoiceId;
                    getMonsterById(monsterId).then(monsterArray => {
                        if (monsterArray && monsterArray.length > 0) {
                            setMonster(monsterArray[0].url);
                        }
                    });
                }
            });
        }
    }, []);


    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("thrashland_user"))?.id;
        if (userId) {
            getUserById(userId).then((data) => {
                setUser(data[0]);
                setBio(data[0]?.bio || "");
                setName(data[0]?.name || "");
                setEmail(data[0]?.email || "");

            });
            getUserArtById(userId).then(artData => {
                setUserArt(artData);
            });

        }

    }, []);

    const handleSaveBio = () => {
        const userId = JSON.parse(localStorage.getItem("thrashland_user"))?.id;

        updateUserBio(userId, bio)
            .then(updatedUser => {
                setUser(updatedUser);
                setIsEditingBio(false);
            })

    };

    const handleSaveName = () => {
        const userId = JSON.parse(localStorage.getItem("thrashland_user"))?.id;

        updateUserName(userId, name)
            .then(updatedUser => {
                setUser(updatedUser);
                setIsEditingName(false);
            })

    };
    const handleSaveEmail = () => {
        const userId = JSON.parse(localStorage.getItem("thrashland_user"))?.id;

        updateUserEmail(userId, email)
            .then(updatedUser => {
                setUser(updatedUser);
                setIsEditingEmail(false);
            })


    };
    const handleDeleteArt = async (artId) => {

        await DeleteFetch(artId);
        const userId = JSON.parse(localStorage.getItem("thrashland_user"))?.id;
        if (userId) {
            getUserArtById(userId).then(artData => {
                setUserArt(artData);
            });
        };
    }

    const handleViewArt = (art) => {
        navigate("/view-art", {
            state: {
                selectedColor: art.favColorChoiceId,
                selectedMusic: art.favMusicChoiceId,
                selectedEmotion: art.currentEmotionChoiceId,
                selectedAdjective: art.adjectiveChoiceId,
                title: art.title,
                id: art.id
            }
        });
    };

    const handleComPost = () => {
        navigate('/community');
    };


    return (
        <div className="user-profile-container">
            <div className="profile-header">Profile</div>
            <div className="user-profile">

                <div className="user-details">
                    <div className="name" >
                        <div className="name-label">Name:</div>
                        <div className="name-section">
                            {isEditingName ? (

                                <div className="name-container">

                                    <input className="editname"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        placeholder="Enter your name"
                                        type="text"
                                    />
                                    <div>
                                        <button onClick={handleSaveName} className="btn4">Save</button>
                                        <button onClick={() => setIsEditingName(false)} className="btn4">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="name-bottom">
                                    <div className="name-name">{user.name}</div>
                                    <button onClick={() => setIsEditingName(true)} className="btn-name">
                                        Edit
                                    </button>
                                </div>

                            )}
                        </div>
                    </div>
                    <div className="email">
                        <div className="email-label">Email:</div>
                        <div className="email-section">
                            {isEditingEmail ? (
                                <div>
                                    <input
                                        className="editname"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Enter your email"
                                        type="email"
                                    />
                                    <div>
                                        <button onClick={handleSaveEmail} className="btn4">Save</button>
                                        <button onClick={() => setIsEditingEmail(false)} className="btn4">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="email-bottom">
                                    <div>{user.email}</div>
                                    <button onClick={() => setIsEditingEmail(true)} className="btn-email">
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="user-art-section">
                    <div className="art-header">BEAST:</div>
                    <div className="art-description">
                        {userArt.length > 0 ? (
                            <div className="art-item" >
                                {monster ? (
                                    <img
                                        src={monster}
                                        alt={userArt[0].title}
                                        className="monster-image2"
                                        style={{
                                            width: '200px',
                                            height: '275px',
                                            objectFit: 'fill',
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '150px',
                                        height: '150px',
                                        border: '2px dashed #ff3131',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ff3131',
                                        marginBottom: '10px'
                                    }}>
                                        Loading...
                                    </div>
                                )}


                                <div className="art-title">{userArt[0].title}</div>
                                <div className="art-action-delete">
                                    <button onClick={() => handleDeleteArt(userArt[0].id)} className="btn-prod">Delete</button>
                                    <button onClick={() => handleViewArt(userArt[0])} className="btn-proview">View</button>
                                </div>
                            </div>

                        ) : (
                            <div className="noArt">No art created yet. <Link to="/UserArtChoice">Create your first art!</Link></div>

                        )}
                    </div>
                </div>
                <div className="right-side">
                    <div className="bio">

                        <div className="bio-container">
                            <div className="bio-header">Bio:</div>
                            <div className="bio-section">
                                {isEditingBio ? (
                                    <div>
                                        <textarea
                                            className="bio-textarea"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            cols={50}
                                        />
                                        <div className="bio-buttons">
                                            <button onClick={handleSaveBio} className="btn5">Save </button>
                                            <button onClick={() => setIsEditingBio(false)} className="btn5">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bio-bottom">
                                        <div className="bio-text">{bio || "No bio added yet."}</div>
                                        <button onClick={() => setIsEditingBio(true)} className="bio-btn">
                                            {bio ? "Edit Bio" : "Add Bio"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="score-display" >
                        <div className="score-title">Score:</div>
                        <div className="score-value">
                            {user.totalScore || 0}
                        </div>

                        <div className="community-post">

                            <button onClick={handleComPost} className="btn-post"
                            >
                                Scoreboard
                            </button>

                        </div>


                    </div>
                </div>




            </div>
        </div >
    );
}