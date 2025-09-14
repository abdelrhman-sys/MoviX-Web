import supabase from "./supabaseClient";

export default async function getImgUrl(path) {
    const {data, error} = await supabase.storage.from("Profile images").createSignedUrl(path, 60 * 60 * 2);

    if (error) {
        console.log(error);
        return null;
    } else {
        return data.signedUrl;
    }
}