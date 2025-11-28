import { supabase } from './supabaseClient'

export const addToUserScore = async (userId, scoreToAdd) => {
    try {
        // First get the current user
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('total_score')
            .eq('id', userId)
            .single()
        
        if (fetchError) throw fetchError
        
        const currentTotal = existingUser.total_score || 0
        const newTotal = currentTotal + scoreToAdd
        
        // Update with new total
        const { data, error } = await supabase
            .from('users')
            .update({ total_score: newTotal })
            .eq('id', userId)
            .select()
        
        if (error) throw error
        return data
        
    } catch (error) {
        console.error('Error adding score:', error)
        throw error
    }
}



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