import { createContext, useContext, useState } from "react";

const Data= createContext();
export function DataProvider({children}) {
    const [formData, setFormData] = useState();
    return (
        <Data.Provider value={{formData, setFormData}}>
            {children}
        </Data.Provider>
    )
}
export function UseSearchData() {
    return useContext(Data);
}