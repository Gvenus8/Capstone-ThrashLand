import { supabase } from './supabaseClient'

export const getMusicChoice = async () => {
    const { data, error } = await supabase
        .from('fav_music_choices')
        .select('*')
    
    if (error) {
        console.error('Error fetching music choices:', error)
        return []
    }
    return data
}

export const getColorChoice = async () => {
    const { data, error } = await supabase
        .from('fav_color_choices')
        .select('*')
    
    if (error) {
        console.error('Error fetching color choices:', error)
        return []
    }
    return data
}

export const getEmotionChoice = async () => {
    const { data, error } = await supabase
        .from('current_emotion_choices')
        .select('*')
    
    if (error) {
        console.error('Error fetching emotion choices:', error)
        return []
    }
    return data
}

export const getAdjectiveChoice = async () => {
    const { data, error } = await supabase
        .from('adjective_choices')
        .select('*')
    
    if (error) {
        console.error('Error fetching adjective choices:', error)
        return []
    }
    return data
}



