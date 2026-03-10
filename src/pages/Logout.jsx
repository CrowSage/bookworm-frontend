import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
export default function Logout() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    useEffect(() => {
        logout()
        navigate("/login")
    }, [logout, navigate])

    return <p>Logging out...</p>
}