import { createBrowserRouter } from "react-router-dom";
import Go, { goLoader } from "./components/Pages/Go";
import Login, { loginLoader } from "./components/Pages/Login";
import Profile, { profileLoader } from "./components/Pages/Profile";
import Chat, { chatLoader } from "./components/Pages/Chat";
import { Outlet } from "react-router-dom";
import ErrorPage from "./components/Global/ErrorPage";
import Navbar from "./components/Global/Navbar";
import MainContainer from "./components/UI/MainContainer";
import Social, { socialLoader } from "./components/Pages/Social";
import EmailVerified from "./components/Pages/EmailVerified";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="app">
        <Navbar />
        <MainContainer>
          <Outlet />
        </MainContainer>
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
      {
        path: "/social",
        element: <Social />,
        loader: socialLoader,
      },
      {
        path: "/email-verified",
        element: <EmailVerified />,
      },
     
     
    ],
  },
]);

export default router;
