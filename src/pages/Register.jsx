import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { BASE_URL } from "../App"

export default function Register() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        //Checking Both Passwords are same, Duh
        if (password !== confirmPassword) {
            setError("Password Don't Match!")
            return
        }

        // Sending Registration Request to fking server
        const response = await fetch(`${BASE_URL}/api/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        })

        // Turning response to JSON.
        const data = await response.json()

        // What to do with response?
        if (response.ok) {
            navigate("/login")
        } else {
            setError(data.error || "Registration Failed")
        }
    }
    return (

        <form onSubmit={handleSubmit} className="registerForm">
            <h1>Register</h1>
            {error && <span className="errorMsg">{error}</span>}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <span className="accountMessage">Already have an account? <Link to="/login" className="linkTag">Login</Link></span>
            <button type="submit">Register</button>
        </form>
    )
}