import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { login } = useAuth()


    async function handleSubmit(e) {
        e.preventDefault()

        const success = await login(username, password)
        if (success) {
            navigate("/library")
        } else {
            setError("Invalid Username or Password!")
        }
    }

    return (

        <form onSubmit={handleSubmit} className="loginForm">
            <h1>Login</h1>
            {error && <span className="errorMsg">{error}</span>}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className="accountMessage">Don't have an Account? <Link to="/register" className="linkTag">Register</Link></span>
            <button type="submit">Login</button>
        </form>
    )
}