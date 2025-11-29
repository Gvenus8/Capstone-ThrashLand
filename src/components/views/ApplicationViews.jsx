import { useEffect, useState } from "react"
import { AdminView } from "./AdminView"
import { UserView } from "./UserView"
import { supabase } from "../../supabaseClient"

export const ApplicationViews = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the logged-in user from Supabase Auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Fetch the user's profile data from your users table
        supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
          .then(({ data, error }) => {
            if (data) {
              setCurrentUser(data)
            }
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return currentUser?.name === "gary venus" ? (
    <AdminView />
  ) : (
    <UserView currentUser={currentUser} />
  )
}