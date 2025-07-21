import { useState, useEffect, } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserArtById, getUserById } from "../../fetches/UserFetches.jsx";
import { DeleteFetch } from "../../fetches/Deletefetch.jsx";
import { updateUserBio, updateUserEmail } from "../../fetches/userProfileFetches.jsx";
import { updateUserName } from "../../fetches/userProfileFetches.jsx";
import "./UserProfile.css";

export const UserProfile = () => {

    const [user, setUser] = useState({});
    const [bio, setBio] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [name, setName] = useState("");
    const [userArt, setUserArt] = useState([]);
    const [email, setEmail] = useState("");
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


    return (
        <div className="user-profile-container">
            <h2>Profile</h2>
            <div className="user-details-container">
                <div>
                    <strong>Name:</strong>
                    <div className="name-section">
                        {isEditingName ? (

                            <div className="name-container">

                                <input
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Enter your name"
                                    type="text"
                                />
                                <div>
                                    <button onClick={handleSaveName}>Save Name</button>
                                    <button onClick={() => setIsEditingName(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div>{user.name}</div>
                                <button onClick={() => setIsEditingName(true)}>
                                    Edit
                                </button>
                            </div>

                        )}
                    </div>
                </div>
                <div>
                    <strong>Email:</strong>
                    <div className="email-section">
                        {isEditingEmail ? (
                            <div>
                                <input
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Enter your email"
                                    type="email"
                                />
                                <div>
                                    <button onClick={handleSaveEmail}>Save Email</button>
                                    <button onClick={() => setIsEditingEmail(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div>{user.email}</div>
                                <button onClick={() => setIsEditingEmail(true)}>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h3>Bio</h3>
                    <div className="bio-section">
                        {isEditingBio ? (
                            <div>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    cols={50}
                                />
                                <div>
                                    <button onClick={handleSaveBio}>Save Bio</button>
                                    <button onClick={() => setIsEditingBio(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>{bio || "No bio added yet."}</p>
                                <button onClick={() => setIsEditingBio(true)}>
                                    {bio ? "Edit Bio" : "Add Bio"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="user-art-section">
                <h3>My Art</h3>
                {userArt.length > 0 ? (
                    <ul>
                        {userArt.map(art => (
                            <li key={art.id}>
                                <strong>{art.title}</strong>
                                <div className="art-action-delete">
                                    <button onClick={() => handleDeleteArt(art.id)}><i class="fa-solid fa-trash" />Delete</button>
                                    <button onClick={() => handleViewArt(art)}><i class="fa-solid fa-eye" />View</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No art created yet. <Link to="/UserArtChoice">Create your first art!</Link></p>
                )}
            </div>
        </div>
    );
}