import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../App";


export default function Home() {

    const navigate = useNavigate()
    const [searchInput, setSearchInput] = useState("")
    const [searchResult, setSearchResult] = useState([])

    const [status, setStatus] = useState("")

    async function fetchResult(query) {

        if (!query.trim()) {
            setSearchResult([])
            setStatus("")
            return;
        }

        setStatus("Searching...")

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API}`)
            const data = await response.json()
            setSearchResult(data.items || [])
            setStatus(data.items?.length ? "" : "No results found.")


        } catch (err) {
            console.error(err)
            setStatus("Error fetching results")
        }
    }
    async function handleSubmit(e) {
        e.preventDefault()
        fetchResult()

    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchResult(searchInput);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    return (
        <>
            <Navbar />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0px', height: "150px" }}>
                <form onSubmit={handleSubmit} className="searchForm" style={{ justifyContent: 'flex-start', width: 'auto' }}>
                    <input type="text" placeholder="Search by title, author, or keyword…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="searchInput" />
                </form>
                {status && <span className="message searching" style={{ marginTop: '10px' }}>{status}</span>}
            </div>

            <div className="searchResultContainer">

                {searchResult && searchResult.map((book) => (

                    <div className="resultBook" key={book.id} onClick={() => navigate(`/book/${book.id}`)}>
                        <img src={book.volumeInfo.imageLinks?.thumbnail || "/no-cover.jpg"} alt="" />
                        <section>
                            <span style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>{book.volumeInfo.title}</span>
                            {book.volumeInfo.authors && (
                                <span><span className="resultBookLabel">Authors:</span>{book.volumeInfo.authors.join(", ")}</span>
                            )}

                            {book.volumeInfo.pageCount > 0 && (
                                <span><span className="resultBookLabel">Pages:</span> {book.volumeInfo.pageCount}</span>
                            )}

                            {book.volumeInfo.publisher && (
                                <span><span className="resultBookLabel">Publisher:</span> {book.volumeInfo.publisher}</span>
                            )}

                            {book.volumeInfo.publishedDate && (
                                <span><span className="resultBookLabel">Published On:</span> {book.volumeInfo.publishedDate}</span>
                            )}
                        </section>
                    </div>


                ))}
            </div >
        </>
    )
}