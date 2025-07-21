import { Outlet, Route, Routes } from "react-router-dom"
import { UserArtChoices } from "../../UserArt/UserArtChoices.jsx";
import { NavBar } from "../nav/NavBar.jsx";
import { Welcome } from "../Welcome/Welcome.jsx";
import { ViewArt } from "../../UserArt/ViewUserArt.jsx";
import { UserProfile } from "../UserProfile/UserProfile.jsx";
import { AddTitle } from "../Title/Title.jsx";
import { Header } from "../header/header.jsx";
import { Play } from "../play/play.jsx";

export const UserView = ({ currentUser }) => {
   return (
      <Routes>
         <Route path="/"
            element={
               <>
                  <Header />
                  <NavBar />
                  <Outlet />
               </>
            }
         >
            <Route index element=
               {
                  <>
                     <Welcome />
                  </>
               }
            />
            <Route path="/UserArtChoice" element={<UserArtChoices />} />
            <Route path="/view-art" element={<ViewArt />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/add-Title" element={<AddTitle />} />
            <Route path="/brickbreaker" element={<Play />} />
            <Route path="/welcome" element={<Welcome />} />
         </Route>
      </Routes>
   )
}


