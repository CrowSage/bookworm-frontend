import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react"
import { useLibrary } from "../hooks/useLibrary"
import Navbar from "../components/Navbar"

export default function Library() {
    const navigate = useNavigate()
    const { token } = useAuth()
    const { library, fetchLibrary, updateBook, deleteBook } = useLibrary()
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({})


    // Redirect to login page if no token
    if (!token) {
        navigate("/login")
        return null
    }

    useEffect(() => {
        fetchLibrary()
    }, [])

    function setEditing(book) {

        setEditData({
            "date_started": book.date_started,
            "date_finished": book.date_finished,
            "status": book.status,
            "rating": book.rating,
            "review": book.review,
        })
        setEditingId(book.id)
    }

    return (
        <>
            <Navbar />
            <div className="libraryContainer">
                <h1>Your Library</h1>

                <div className="libraryBooks">
                    {library.length === 0 && <span className="libraryStatus message">Your Library is Empty!</span>}

                    {library.map((book) => (
                        <div className="libraryBook" key={book.id}>
                            <div className="libraryBookPoster">
                                <img src={book.thumbnail || "/no-cover.jpg"} alt="book cover" />
                            </div>

                            {/* 2. Fixed JSX Conditional Logic */}
                            {editingId !== book.id ? (
                                <div className="libraryBookInfo">
                                    <span className="libraryBookTitle">{book.title}</span>
                                    <span className="libraryBookAuthors">By {book.authors}</span>
                                    <span><span className="libraryBookLabel">Status:</span> {book.status}</span>
                                    <span><span className="libraryBookLabel">Date started:</span> {book.date_started || "None"}</span>
                                    <span><span className="libraryBookLabel">Date finished:</span> {book.date_finished || "None"}</span>
                                    {book.rating && <span><span className="libraryBookLabel">Rating:</span> {book.rating}</span>}
                                    {book.review && <span><span className="libraryBookLabel">Review:</span> {book.review}</span>}

                                    <div className="libraryBookAction">

                                        <button onClick={() => setEditing(book)} className="libraryBookBtn">Edit</button>
                                        <button onClick={async () => {
                                            const success = await deleteBook(book.id);
                                            if (success) {
                                                fetchLibrary()
                                            }
                                        }} className="libraryBookBtn">Delete</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="libraryBookInfo">
                                    <span className="libraryBookTitle">{book.title}</span>
                                    <span className="libraryBookAuthors">By {book.authors}</span>


                                    <span className="statusInput">
                                        <label htmlFor="status"><span className="libraryBookLabel">Status: </span></label>
                                        <select
                                            name="status"
                                            value={editData.status}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                        >
                                            <option value="want_to_read">Want to Read</option>
                                            <option value="reading">Reading</option>
                                            <option value="completed">Completed</option>
                                            <option value="dnf">DNF</option>
                                        </select>
                                    </span>

                                    <span className="dateInput">

                                        <label htmlFor="dateStarted"><span className="libraryBookLabel">Date started: </span></label>
                                        <input name="dateStarted" type="date" value={editData.date_started || ""} onChange={(e) => setEditData({ ...editData, date_started: e.target.value })} />
                                    </span>

                                    <span className="dateInput">

                                        <label htmlFor="dateFinished"><span className="libraryBookLabel">Date finished: </span></label>
                                        <input name="dateFinished" type="date" value={editData.date_finished || ""} onChange={(e) => setEditData({ ...editData, date_finished: e.target.value })} />
                                    </span>
                                    <input className="ratingInput" type="number" min="1" max="5" placeholder="Rating" value={editData.rating || ""} onChange={(e) => setEditData({ ...editData, rating: e.target.value })} />
                                    <textarea className="reviewInput" placeholder="Review" value={editData.review || ""} onChange={(e) => setEditData({ ...editData, review: e.target.value })} />


                                    <div className="libraryBookAction">

                                        <button onClick={async () => {
                                            const success = await updateBook(book.id, editData);
                                            if (success) {
                                                setEditingId(null);
                                                fetchLibrary();
                                            }
                                        }} className="libraryBookBtn">Save</button>
                                        <button onClick={() => {
                                            setEditingId(null);
                                            setEditData({})
                                        }} className="libraryBookBtn">Cancel</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}