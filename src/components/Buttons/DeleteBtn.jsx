import { DeleteFetch } from "../../fetches/Deletefetch";
import { useNavigate } from "react-router-dom";
import { getUserArtById } from "../../fetches/UserFetches.jsx";
import { useState, useEffect } from "react";


export const DeleteBtn = ({id, onDelete}) => {
   const [user, setUser] = useState(null);

    useEffect(() => {
        if (id) { 
            getUserArtById(id).then((data) => {
                setUser(data);    
            });
        }
    }, [id]);
   
   
    const navigate = useNavigate();
    const handleDelete = () => {
     if (user && user.id) { 
            DeleteFetch(user.id).then(() => {
                onDelete(user.id);
                navigate("/create-art");
           
            });
        } 
}

    return (
        <button onClick={handleDelete} disabled={!user}>
            Delete
        </button>
    );
};