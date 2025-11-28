import { supabase } from './supabaseClient'

export const DeleteFetch = async (id) => {
    const { data, error } = await supabase
        .from('user_art')
        .delete()
        .eq('id', id)
    
    if (error) {
        console.error('Error deleting user art:', error)
        return null
    }
    return data
}
