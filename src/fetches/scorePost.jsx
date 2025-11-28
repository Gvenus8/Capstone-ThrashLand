import { supabase } from './supabaseClient'


export const scorePut = async (userId, score) => {
    if (typeof userId !== 'number') {
        userId = parseInt(userId)
    }
    
    const { data, error } = await supabase
        .from('users')
        .update({ total_score: parseInt(score) })
        .eq('id', userId)
        .select()
    
    if (error) {
        console.error('Error updating score:', error)
        return null
    }
    return data
}