'use server';

import { supabase } from '@/lib/supabaseClient';
import { UserAnimeStatus } from '@/types';
import { revalidatePath } from 'next/cache';

export async function updateAnimeStatus(animeId: number, status: UserAnimeStatus) {
    try {
        const { error } = await supabase
            .from('animes')
            .update({ ustatus: status })
            .eq('id', animeId);

        if (error) throw error;
        revalidatePath('/');
        revalidatePath(`/anime/${animeId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function deleteAnimeFromList(animeId: number) {
    try {
        const { error } = await supabase
            .from('animes')
            .update({ ustatus: null })
            .eq('id', animeId);

        if (error) throw error;
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete:', error);
        return { success: false, error: 'Failed to delete' };
    }
}
