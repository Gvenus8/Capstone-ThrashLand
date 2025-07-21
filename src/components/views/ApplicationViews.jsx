import { useEffect, useState } from "react"
import { AdminView } from "./AdminView"
import { UserView } from "./UserView"





export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() => {
    const localThrashlandUser = localStorage.getItem("thrashland_user")
    const thrashlandUserObject = JSON.parse(localThrashlandUser)
    setCurrentUser(thrashlandUserObject)
  }, [])
  return currentUser.name === "gary venus" ? (
    <AdminView />
  ) : (
    <UserView currentUser={currentUser} />
  )

}
