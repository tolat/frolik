import { createBrowserRouter } from "react-router-dom";
import Chat from "./components/Pages/Chat";
import Go from "./components/Pages/Go";
import Login, { loginLoader } from "./components/Pages/Login";
import Profile, { profileLoader } from "./components/Pages/Profile";
import { Outlet } from "react-router-dom";
import ErrorPage from "./components/Global/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <Outlet />
      </div>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Profile />,
        loader: profileLoader,
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
