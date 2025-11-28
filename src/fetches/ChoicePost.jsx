import { supabase } from './supabaseClient'

export const PostChoices = async (choices) => {
    const { data, error } = await supabase
        .from('user_art')
        .insert([choices])
        .select()
    
    if (error) {
        console.error('Error posting choices:', error)
        return null
    }
    return data
}