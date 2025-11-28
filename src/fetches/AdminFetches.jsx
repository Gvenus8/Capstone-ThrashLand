import { supabase } from './supabaseClient'

export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
    
    if (error) {
        console.error('Error fetching users:', error)
        return []
    }
    return data
}

export const getAllUserArt = async () => {
    const { data, error } = await supabase
        .from('user_art')
        .select('*')
    
    if (error) {
        console.error('Error fetching user art:', error)
        return []
    }
    return data
}

export const deleteUserArt = async (artId) => {
    const { data, error } = await supabase
        .from('user_art')
        .delete()
        .eq('id', artId)
    
    if (error) {
        console.error('Error deleting user art:', error)
        return null
    }
    return data
}

export const deleteUsers = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
    
    if (error) {
        console.error('Error deleting user:', error)
        return null
    }
    return data
}