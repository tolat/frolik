import { createBrowserRouter } from "react-router-dom";
import Go, { goLoader } from "./components/Pages/Go";
import Login, { loginLoader } from "./components/Pages/Login";
import Profile, { profileLoader } from "./components/Pages/Profile";
import Chat, { chatLoader } from "./components/Pages/Chat";
import { Outlet } from "react-router-dom";
import ErrorPage from "./components/Global/ErrorPage";
import Navbar from "./components/Global/Navbar";
import Footer from "./components/Global/Footer";
import SlideInModal from "./components/Modals/SlideInModal";
import MainContainer from "./components/UI/MainContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="app">
        <Navbar />
        <MainContainer>
          <Outlet />
        </MainContainer>
        {/*  <Footer /> */}
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
        path: "/login",
        element: <Login />,
        loader: loginLoader,
      },
      {
        path: "/profile",
        element: <Profile />,
        loader: profileLoader,
      },
      {
        path: "/go",
        element: <Go />,
        loader: goLoader,
      },
      {
        path: "/chat",
        element: <Chat />,
        loader: chatLoader,
      },
    ],
  },
]);

export default router;
