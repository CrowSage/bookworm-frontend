import { useState } from "react"
import { NavLink, Link } from "react-router-dom"
export default function Navbar() {


    return (
        <div className="navbar">
            <h1><Link className="logo" to="/">Bookworm</Link></h1>
            <ul>
                <li><NavLink to="/" className="navLink">Home</NavLink></li>
                <li><NavLink to="/library" className="navLink">Library</NavLink></li>
                <li><NavLink to="/stats" className="navLink">Stats</NavLink></li>
                <li><NavLink to="/logout" className="navLink">Logout</NavLink></li>
            </ul>
        </div>
    )
}