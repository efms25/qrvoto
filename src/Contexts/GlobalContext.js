import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const GlobalContext = createContext({
    loading: false,
    readyForProcess: false,
    setReadyForProcess: (val) => { },

})

function GlobalContextProvider(props) {
    const { children } = props
    const [loading, setLoading] = useState(false)
    const [readyForProcess, setReadyForProcess] = useState(false)

    return (<GlobalContext.Provider value={{
        loading,
        readyForProcess,
        setReadyForProcess,
        setLoading: (value) => {
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