import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../App";
import { useAuth } from "../context/AuthContext";
import { useLibrary } from "../hooks/useLibrary";
import Navbar from "../components/Navbar";

export default function BookDetail() {
    const { bookId } = useParams()
    const [book, setBook] = useState(null)
    const [libraryBook, setLibraryBook] = useState()
    const [isInLibrary, setIsInLibrary] = useState(false)

    const [categories, setCategories] = useState([])

    const { library, addBook, fetchLibrary } = useLibrary()
    const { token } = useAuth()
    const navigate = useNavigate()



    if (!token) {
        navigate("/login")
    }

    async function fetchBook() {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API}`)
        const data = await response.json()
        console.log(data)
        setBook(data)

        // getting categories in an array so i can display it.

        if (data.volumeInfo.categories) {
            const topCategories = Array.from(
                new Set(
                    data.volumeInfo.categories.map(x => x.split('/')[0].trim())
                )
            );
            setCategories(topCategories);
        }
    }

    useEffect(() => {
        async function init() {
            const [lib] = await Promise.all([
                fetchLibrary(),
                fetchBook()
            ])

            const found = lib.find((b) => b.book_id === bookId);
            if (found) {
                setIsInLibrary(true)
                setLibraryBook(found)
            }
        }
        init()
    }, [bookId])


    if (!book) return <div className="loadingBook"><Navbar /> <span className="message">Loading...</span></div>;
    return (
        <>

            <Navbar />
            <div className="bookDetailContainer">

                <div className="bookHeader">


                    <div className="bookPoster">

                        <img src={book.volumeInfo.imageLinks?.thumbnail || "/no-cover.jpg"} alt="" />
                        <div className="bookAction">

                            {!isInLibrary && <button onClick={() => {
                                const bookData = {
                                    book_id: bookId,
                                    title: book.volumeInfo.title,
                                    authors: book.volumeInfo.authors?.join(", "),
                                    thumbnail: book.volumeInfo.imageLinks?.thumbnail || "/no-cover.jpg",
                                };
                                const success = addBook(bookData);
                                if (success) {
                                    setIsInLibrary(true);
                                    setLibraryBook({ ...bookData, rating: null, review: null });
                                }
                            }} className="addBtn">Add to Library</button>}


                            {isInLibrary && <span className="statusTag">In Library</span>}
                        </div>
                    </div>

                    <div className="bookDetail">

                        <div className="bookDetailHighlight">

                            <h1 className="bookTitle">{book.volumeInfo.title}</h1>
                            <p className="bookAuthor">{book.volumeInfo.authors}</p>

                        </div>
                        <div className="bookDetailInfo">

                            <span className="value"><span className="bookLabel">Published On:</span> {book.volumeInfo.publishedDate}</span>
                            <span className="value"><span className="bookLabel">Published By:</span> {book.volumeInfo.publisher}</span>
                            <span className="value"><span className="bookLabel">Pages:</span> {book.volumeInfo.pageCount}</span>


                            <div className="categoriesContainer">
                                {categories.map((category) => (
                                    <span className="category">{category}</span>
                                ))}
                            </div>
                        </div>

                        {isInLibrary && libraryBook && (libraryBook.rating && libraryBook.review) && <span className="ratingReview">


                            {libraryBook.rating && <span className="myRating">My Rating: {libraryBook.rating}/5</span>}
                            {libraryBook.review && <span className="myReview">My Review: {libraryBook.review}</span>}
                        </span>}

                    </div>
                </div>
                <div className="bookDescription">
                    <h3>About this book</h3>
                    <div dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }} />
                </div>
            </div>
        </>
    )
}