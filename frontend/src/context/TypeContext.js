import React, { createContext, useContext, useState } from 'react'


export const TypeContext = createContext();

export const useTypeContext= ()  => {
    return useContext(TypeContext);
}
export const TypeContextProvider = ({ children }) => {
    const [type, setType] = useState("Select User Type");

    return (
        <TypeContext.Provider value={{ type, setType }}>
            {children}
        </TypeContext.Provider>
    )
}