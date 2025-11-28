import { useState,useEffect } from "react";
import { deleteUserArt, getAllUsers } from "../../fetches/AdminFetches.jsx";
import { getAllUserArt } from "../../fetches/AdminFetches.jsx";
import { deleteUsers } from "../../fetches/AdminFetches.jsx";
import "../AdminProfile.css";

export const AdminProfile = () => {
const [allUsers, setAllUsers] = useState([]);
const [allUserArt, setAllUserArt] = useState([]);


   useEffect(() => {
        getAllUsers().then((usersArray) => {
            setAllUsers(usersArray);
        })
            getAllUserArt().then((artArray) => {
            setAllUserArt(artArray);    
            
        })
    }, [])

    const handleAdminDeleteArt = (artId) => {
        deleteUserArt(artId).then(() => {
            getAllUserArt().then((artArray) => {
                setAllUserArt(artArray);
            });
        });
    }
      const handleAdminDeleteUser = (userId) => {
          if (userId === 6) {
            alert("idiot, you can't delete yourself");
            return;
        }
        deleteUsers(userId).then(() => {
            getAllUsers().then((usersArray) => {
                setAllUsers(usersArray);
            });
        });
    }


    return (
        <div className="admin-profile-container"> 
           <div className="admin-header">
              Admin
           </div>
           <div className="admin-actions">
                <h3>All Users</h3>
                <h4>User Id</h4>
                    <ol className="user-list">
                        {allUsers.map(user => (
                     <li key={user.id} className="user-item">  {user.name}  Email:  {user.email}
                     <button className="delete-admin" onClick={() => handleAdminDeleteUser(user.id)}><i className="fa-solid fa-trash" />Delete</button>
                     </li>
                  ))}
                   </ol>
           </div>
           <div className="admin-actions">
           <h3>All User Art</h3>
           <h4>Art Id</h4>
           <ol className="art-list">
               {allUserArt.map(art => (
                   <li key={art.id} className="art-item">UserId:{art.userId} Title:{art.title}
                   <button className="delete-admin" onClick={() => handleAdminDeleteArt(art.id)}><i className="fa-solid fa-trash" />Delete</button>
                  </li>
               ))}
           </ol>
           </div>
        </div>
    );
};
