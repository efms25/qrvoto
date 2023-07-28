/* eslint-disable react/prop-types */
import React, { useContext, createContext, useMemo, useEffect, useState, useCallback } from "react";
import auth from "@react-native-firebase/auth"
import { retrieveDataEncrypted, storeDataEncrypted, delDataEncrypted } from "../Core/Functions";
import { useGlobalContext } from "./GlobalContext";

const AuthContext = createContext(null)

function AuthProvider(props) {
    const { children } = props
    const { setLoading } = useGlobalContext()
    const [isLogged, setIsLogged] = useState(false)

    const checkLogged = useCallback(async () => {
        const result = await retrieveDataEncrypted('session') != null
        setIsLogged(result)
        setLoading(true)
    }, [retrieveDataEncrypted])

    const valueProvider = useMemo(() => ({
        setAuth: async (token) => {
            await storeDataEncrypted("session", token, "Não foi possível salvar a sessão no momento, reinicie a aplicação")
            checkLogged()
        },
        isLogged,
        login: async (email, password) => {
            return await auth().signInWithEmailAndPassword(email, password)
        },
        logout: async () => {
            await delDataEncrypted('session')
        }
    }), [isLogged])

    useEffect(() => {
        checkLogged()
    }, [])

    return (<AuthContext.Provider value={valueProvider}>
        {children}
    </AuthContext.Provider>)
}


function useAuthContext() {
    return useContext(AuthContext)
}

export { useAuthContext }
export default AuthProvider