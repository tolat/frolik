import { createBrowserRouter, redirect } from "react-router-dom";
import Go, { goLoader } from "./components/Pages/Go";
import Login, { loginLoader } from "./components/Pages/Login";
import Profile, { profileLoader } from "./components/Pages/Profile";
import Chat, { chatLoader } from "./components/Pages/Chat";
import { Outlet } from "react-router-dom";
import ErrorPage from "./components/Global/ErrorPage";
import Navbar from "./components/Global/Navbar";
import MainContainer from "./components/UI/MainContainer";
import { fetchAuth } from "./store/auth-actions";
import { hideModalFast } from "./store/modal-actions";
import store from "./store";
import { goActions } from "./store/go-slice";

const appLoader = async () => {
  await fetchAuth()();
  hideModalFast();

  if (!store.getState().auth.isAuthenticated) {
    return redirect("/login");
  } else {
    // Set authenticated user as default for go page
    store.dispatch(goActions.setUsers([store.getState().auth.user]));
  }

  return null;
};


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
   loader: appLoader,
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
