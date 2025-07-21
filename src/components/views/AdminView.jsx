import { Outlet, Route, Routes } from "react-router-dom"
import { UserArtChoices } from "../../UserArt/UserArtChoices.jsx";
import { AdminNavBar } from "../nav/AdminNavBar.jsx";
import { Welcome } from "../Welcome/Welcome.jsx";
import { ViewArt } from "../../UserArt/ViewUserArt.jsx";
import { UserProfile } from "../UserProfile/UserProfile.jsx";
import { AddTitle } from "../Title/Title.jsx";
import { AdminProfile } from "../AdminProfile/AdminProfile.jsx";
import { Header } from "../header/header.jsx";
import { Play } from "../play/play.jsx";

export const AdminView = ({ currentUser }) => {
   return (
      <Routes>
         <Route path="/"
            element={
               <>
                  <Header />
                  <AdminNavBar />
                  <Outlet />
               </>
            }
         >
            <Route index element={
               <>
                  <Welcome />

               </>
            }
            />
            <Route path="/userArtChoice" element={<UserArtChoices />} />
            <Route path="/view-art" element={<ViewArt />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminProfile />} />
            <Route path="/add-Title" element={<AddTitle />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/brickbreaker" element={<Play />} />
         </Route>
      </Routes>
   )
}