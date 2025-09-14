import base64ToBlob from "./convertImgToBlob";
import supabase from "./supabaseClient";

export default async function editProfileImg(path, newBase64 , type) {
    const {data, error} = await supabase.storage.from('Profile images').upload(path, base64ToBlob(newBase64, type), {
    upsert: true,
    })

    if (error) {
        console.error(error);
        return null;
    } else {
        return data.path;
    }
}