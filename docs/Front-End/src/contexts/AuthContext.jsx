import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const storedToken = localStorage.getItem('alertaUrbano_token')
        const storedUser  = localStorage.getItem('alertaUrbano_user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])
    const login = (userData, UserToken)=>{
        setUser(userData)
        setToken(userToken)
        localStorage.setItem('alertaUrbano_token', userToken)
        localStorage.setItem('alertaUrbano_user', JSON.stringify(userData))
    }
    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('cidadeviva_token')
        localStorage.removeItem('cidadeviva_user')    
    }
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