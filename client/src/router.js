import { createBrowserRouter } from "react-router-dom";
import Chat from "./components/Pages/Chat";
import Go from "./components/Pages/Go";
import Login from "./components/Pages/Login";
import Profile from "./components/Pages/Profile";
import { Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <Outlet />
      </div>
    ),
    errorElement: <div>ERROR</div>,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        index: true,
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
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
