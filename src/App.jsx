import "./App.css";
import { Routes, Route,} from "react-router-dom";
import { Login } from "./components/auth/Login.jsx";
import { Register } from "./components/auth/Register.jsx";
import { Authorized } from "./components/views/Authorized.jsx";
import { ApplicationViews } from "./components/views/ApplicationViews.jsx";
import { Home } from "./components/home/home.jsx";



export const App = () => {
    return (
        <Routes>
            <Route path = "/" element = {<Home/>} />
            <Route path = "/login" element = {<Login/>} />
            <Route path = "/register" element = {<Register />} />
       
            <Route path = "/*" 
                   element = {
                    <Authorized>
                        <ApplicationViews/>
                    </Authorized>
                    }   
            />    
       </Routes>
   )
}
        
       