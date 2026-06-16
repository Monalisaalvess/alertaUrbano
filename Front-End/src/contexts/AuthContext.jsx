import { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext()

const   STORAGE_KEYS = {
    token:'alertaUrbano_token',
    user :'alertaUrbano_user',
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        try{
        const storedToken = localStorage.getItem(STORAGE_KEYS.token)
        const storedUser  = localStorage.getItem(STORAGE_KEYS.user)

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        }catch (err) {
            console.error('Erro ao restaurar sessão:', err)
            localStorage.removeItem(STORAGE_KEYS.token)
            localStorage.removeItem(STORAGE_KEYS.user)
        } finally {
        setLoading(false)
        }
        }, [])
        
      
    const login = useCallback((userData, userToken) => {
        setUser (userData)
        setToken(userToken)
        localStorage.setItem(STORAGE_KEYS.token, userToken)
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData))
    }, [])
    const logout = useCallback (() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem(STORAGE_KEYS.token)
        localStorage.removeItem(STORAGE_KEYS.user)    
    }, [] )
    const isAuthenticated = !!token
    const isAdmin = user?.role === 'admin'


    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated,
            isAdmin,
}}>
          {!loading && children}
        </AuthContext.Provider>
  )
}