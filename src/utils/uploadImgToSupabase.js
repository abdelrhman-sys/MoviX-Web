import supabase from './supabaseClient';
import base64ToBlob from './convertImgToBlob';

export default async function uploadBlob(base64, type) {    
    const { data, error } = await supabase.storage.from('Profile images').upload(`${Date.now()}`, base64ToBlob(base64, type));

    if (error) {
        console.error('Error uploading image to Supabase:', error);
        return null; // img will be empty
    } else {
        return data.path;
    }
}