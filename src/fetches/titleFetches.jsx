import { supabase } from './supabaseClient'

export const updateUserArtWithTitle = async (userArtId, title) => {
    const { data, error } = await supabase
        .from('user_art')
        .update({ title: title })
        .eq('id', userArtId)
        .select()
    
    if (error) {
        console.error('Error updating user art title:', error)
        return null
    }
    return data
}