import { createContext, useContext, useState } from "react";
import { BASE_URL } from "../App";

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const isAuthenticated = !!token

    async function login(username, password) {
        const response = await fetch(`${BASE_URL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })

        const data = await response.json()
        if (response.ok) {
            setToken(data.access)
            localStorage.setItem("token", data.access)
            localStorage.setItem("refreshToken", data.refresh)
            return true
        }

        return false
    }

    function logout() {
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")

    }

    async function refreshAccessToken() {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) return false

        const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken })
        })

        if (response.ok) {
            const data = await response.json()
            setToken(data.access)
            localStorage.setItem("token", data.access)
            return true
        }

        return false
    }

    return (
        <AuthContext.Provider value={{ login, logout, token, isAuthenticated, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    )


}

export function useAuth() {
    return useContext(AuthContext)
}