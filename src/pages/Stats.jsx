import { useEffect } from "react"
import { useLibrary } from "../hooks/useLibrary"
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Stats() {

    const { library, fetchLibrary } = useLibrary()
    const { token } = useAuth()

    const navigate = useNavigate()

    const booksNumber = library.length;
    const completedBooks = library.filter(book => book.status === "completed")
    const readingBooks = library.filter(book => book.status === "reading")
    const planedBooks = library.filter(book => book.status === "want_to_read")
    const dnfBooks = library.filter(book => book.status === "dnf")


    if (!token) {
        navigate("/login")
    }

    const averageRating = completedBooks.length > 0
        ? (completedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / completedBooks.length).toFixed(1)
        : "No ratings yet"

    useEffect(() => {

        fetchLibrary()
    }, [])

    return (
        <>
            <Navbar />
            <div className="stats">
                <h1>Your Stats</h1>
                <div className="booksNumbers">

                    <span><span className="bookLabel">All: </span>{booksNumber}</span>
                    <span><span className="bookLabel">Finished: </span>{completedBooks.length}</span>
                    <span><span className="bookLabel">Reading: </span>{readingBooks.length}</span>
                    <span><span className="bookLabel">Want to read: </span>{planedBooks.length}</span>
                    <span><span className="bookLabel">Did not finish: </span>{dnfBooks.length}</span>
                </div>

                <h3 className="averageRating"> <span>Average Rating:</span> {averageRating}</h3>
            </div>
        </>
    )
}