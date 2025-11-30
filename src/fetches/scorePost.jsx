import { supabase } from '../supabaseClient'


export const scorePut = async (userId, score) => {
    if (typeof userId !== 'number') {
       
    
    
    const { data, error } = await supabase
        .from('users')
        .update({ total_score: parseInt(score) })
        .eq('id', userId)
        .select()
        alert("Score updated successfully!");
    
    if (error) {
        console.error('Error updating score:', error)
        return null
    }
    return data
}
}