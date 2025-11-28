import { supabase } from '../supabaseClient'

export const getMonsterById = async (monsterId) => {
    const { data, error } = await supabase
        .from('monsters')
        .select('*')
        .eq('id', monsterId)
    
    if (error) {
        console.error('Error fetching monster:', error)
        return []
    }
    return data
}