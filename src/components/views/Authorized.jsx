import { Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"

export const Authorized = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Check if user is logged in with Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div> // Show loading while checking auth
  }

  if (user) {
    return children // User is logged in, show the protected content
  } else {
    return <Navigate to={`/login`} state={{ from: location }} replace /> // Not logged in, redirect to login
  }
}