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
import Utility from "./components/Pages/Utility";

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
        path: "/outing",
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
        element: <Utility page={"email-verified"} />,
      },
      {
        path: "/send-reset-password-link",
        element: <Utility page={"send-reset-password-link"} />,
      },
      {
        path: "/reset-password-link-sent",
        element: <Utility page={"reset-password-link-sent"} />,
      },
      {
        path: "/reset-password/:userID",
        element: <Utility page={"reset-password"} />,
      },
      {
        path: "/password-reset-success",
        element: <Utility page={"password-reset-success"} />,
      },
    ],
  },
]);

export default router;
