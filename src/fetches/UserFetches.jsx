import { supabase } from './supabaseClient'

export const createUser = async (customer) => {
    const { data, error } = await supabase
        .from('users')
        .insert([customer])
        .select()
    
    if (error) {
        console.error('Error creating user:', error)
        return null
    }
    return data
}

export const getUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
    
    if (error) {
        console.error('Error fetching user by email:', error)
        return []
    }
    return data
}

export const getUserById = async (id) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
    
    if (error) {
        console.error('Error fetching user by id:', error)
        return []
    }
    return data
}

export const getUserArtById = async (userId) => {
    const { data, error } = await supabase
        .from('user_art')
        .select('*')
        .eq('user_id', userId)
    
    if (error) {
        console.error('Error fetching user art by userId:', error)
        return []
    }
    return data
}

export const expandUserChoices = async (selectedMusic, selectedColor, selectedEmotion, selectedAdjective) => {
    const [musicResult, colorResult, emotionResult, adjectiveResult] = await Promise.all([
        supabase.from('fav_music_choices').select('*').eq('id', selectedMusic).single(),
        supabase.from('fav_color_choices').select('*').eq('id', selectedColor).single(),
        supabase.from('current_emotion_choices').select('*').eq('id', selectedEmotion).single(),
        supabase.from('adjective_choices').select('*').eq('id', selectedAdjective).single()
    ])
    
    return {
        music: musicResult.data,
        color: colorResult.data,
        emotion: emotionResult.data,
        adjective: adjectiveResult.data
    }
}