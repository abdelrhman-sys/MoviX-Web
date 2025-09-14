import axios from "axios";
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { ServerUrl } from "./generalContext";
import getImgUrl from "../utils/getImgUrl";

const userData= createContext();

export function UserProvider({children}) {
    const [user, setUser] = useState({});
    const server = useContext(ServerUrl);

    useEffect (()=> {
        async function getUser() {
            try {
                const { data }= await axios.get(`${server}/user`, {withCredentials: true});
                setUser(data);
                if (data.user.profile_pic) {
                    var imgUrl = await getImgUrl(data.user.profile_pic);
                }
                setUser({...data, user: {...data.user, profile_pic: imgUrl}});
            } catch (error) {
                return;
            }
        }
        getUser();
    }, [server])

    return (
        <userData.Provider value={{user, setUser}}>
            {children}
        </userData.Provider>
    )
}
export function UserData() {
    return useContext(userData);
}