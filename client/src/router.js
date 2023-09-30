import { createBrowserRouter } from "react-router-dom";
import Chat from "./components/Pages/Chat";
import Go from "./components/Pages/Go";
import Login, { loginLoader } from "./components/Pages/Login";
import Profile, { profileLoader } from "./components/Pages/Profile";
import { Outlet } from "react-router-dom";
import ErrorPage from "./components/Global/ErrorPage";
import Navbar from "./components/Global/Navbar";
import Footer from "./components/Global/Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div class="app">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />,
        loader: loginLoader,
      },
      {
        path: "login",
        element: <Login />,
        loader: loginLoader,
      },
      {
        path: "profile",
        element: <Profile />,
        loader: profileLoader,
      },
      {
        path: "go",
        element: <Go />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
]);

export default router;
