import { createContext, useContext, useEffect, useState } from 'react'
import { tokenStore } from '../api/tokenStore'
import { getCurrentUser, logout, refresh, Role, type UserResponse } from '../api'
import toast from 'react-hot-toast'

interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    authLogin: (token: string) => void
    authLogout: () => void
    isInRole: (role: Role) => boolean
    user: UserResponse | undefined
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<UserResponse>()

    function authLogin(token: string) {
        tokenStore.set(token)
        setIsAuthenticated(true)
    }


    function authLogout() {
        logout()
            .then(() => {
                tokenStore.set(null)
                setIsAuthenticated(false)
                setUser(undefined)
            })
            .catch(() => toast.error("Errore nel logout"))
    }

    function isInRole(role: Role) {
        if (user) {
            return user.role === role;
        }
        return false;
    }

    useEffect(() => {
        refresh()
            .then((res) => {
                authLogin(res.accessToken);
            })
            .catch(() => {
                setIsAuthenticated(false)
            })
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            getCurrentUser()
                .then((res) => {
                    setUser(res)
                })
                .catch(() => toast.error("Errore nel recupero dell'utente"))
        }
    }, [isAuthenticated])

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, authLogin, authLogout, user, isInRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
