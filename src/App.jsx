import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import BookDetail from "./pages/BookDetail";
import Stats from "./pages/Stats";

export const API = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
export const BASE_URL = import.meta.env.VITE_API_URL


const routers = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/library", element: <Library /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },
  { path: "/book/:bookId", element: <BookDetail /> },
  { path: "/stats", element: <Stats /> },
])

export default function App() {
  return (
    <RouterProvider router={routers} />
  )
}
