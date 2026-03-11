import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API, BASE_URL } from "../App";

export function useLibrary() {

    const { token, refreshAccessToken, logout } = useAuth()
    const [library, setLibrary] = useState([])



    useEffect(() => {
        if (!token) {
            setLibrary([])
        }
    }, [token])


    async function fetchLibrary() {
        const response = await fetch(`${BASE_URL}/api/library/`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` }
        })


        if (response.status === 401) {
            const refreshed = await refreshAccessToken()
            if (refreshed) {
                const newToken = localStorage.getItem("token")
                const retry = await fetch(`${BASE_URL}/api/library/`, {
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${newToken}` }
                })
                const data = await retry.json()
                setLibrary(data)
                return data
            } else {
                logout()
            }

        }

        const data = await response.json()
        setLibrary(data)
        return data
    }

    async function addBook(bookData) {
        const response = await fetch(`${BASE_URL}/api/library/add/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(bookData)
        })



        if (response.status === 401) {
            const refreshed = await refreshAccessToken()

            if (refreshed) {
                const newToken = localStorage.getItem("token")
                const retry = await fetch(`${BASE_URL}/api/library/add`, {
                    method: "POST",
                    headers: { 'Authorization': `Bearer ${newToken}` },
                    body: JSON.stringify(bookData)
                })

                const data = await retry.json()
                return retry.ok


            } else {
                logout()
            }

        }


        const data = await response.json()
        console.log(data)
        return response.ok

    }

    async function updateBook(bookId, bookData) {
        const response = await fetch(`${BASE_URL}/api/library/${bookId}/update/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(bookData)
        })


        if (response.status === 401) {
            const refreshed = await refreshAccessToken()
            if (refreshed) {
                const newToken = localStorage.getItem("token")
                const retry = await fetch(`${BASE_URL}/api/library/${bookId}/update/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${newToken}`
                    },
                    body: JSON.stringify(bookData)
                })

                return retry.ok

            } else {
                logout()
            }
        }
        return response.ok
    }



    async function deleteBook(bookId) {
        const response = await fetch(`${BASE_URL}/api/library/${bookId}/delete/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })

        if (response.status === 401) {
            const refreshed = await refreshAccessToken()
            if (refreshed) {
                const newToken = localStorage.getItem("token")
                const retry = await fetch(`${BASE_URL}/api/library/${bookId}/delete/`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${newToken}`
                    },
                })

                return retry.ok
            } else {
                logout()
            }
        }
        return response.ok
    }

    return { library, fetchLibrary, addBook, updateBook, deleteBook }
}