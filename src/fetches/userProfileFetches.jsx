import { supabase } from '../supabaseClient'

export const updateUserBio = async (userId, bio) => {
    const { data, error } = await supabase
        .from('users')
        .update({ bio: bio })
        .eq('id', userId)
        .select()
    
    if (error) {
        console.error('Error updating user bio:', error)
        return null
    }
    return data
}

export const updateUserName = async (userId, name) => {
    const { data, error } = await supabase
        .from('users')
        .update({ name: name })
        .eq('id', userId)
        .select()
    
    if (error) {
        console.error('Error updating user name:', error)
        return null
    }
    return data
}

export const updateUserEmail = async (userId, email) => {
    const { data, error } = await supabase
        .from('users')
        .update({ email: email })
        .eq('id', userId)
        .select()
    
    if (error) {
        console.error('Error updating user email:', error)
        return null
    }
    return data
}