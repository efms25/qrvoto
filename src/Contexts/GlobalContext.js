import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const GlobalContext = createContext({
    loading: false,
    
})

function GlobalContextProvider(props) {
    const { children } = props
    const [loading, setLoading] = useState(false)

    return (<GlobalContext.Provider value={{
        loading,
        setLoading: (value)=>{
            setLoading(value)
        }
    }}>
        {children}
    </GlobalContext.Provider>)

}

function useGlobalContext() {
    return useContext(GlobalContext)
}
export { useGlobalContext, GlobalContext }
export default GlobalContextProvider