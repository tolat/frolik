import { createBrowserRouter, Outlet } from "react-router-dom";
import { Suspense } from "react";
import ErrorPage from "./components/Global/ErrorPage";
import Navbar from "./components/Global/Navbar";
import MainContainer from "./components/UI/MainContainer";
import LoaderSpinner from "./components/UI/LoaderSpinner";

// Page-level fallback shown while a lazy chunk is loading
const PageFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", paddingTop: "6rem" }}>
    <LoaderSpinner width="3rem" height="3rem" />
  </div>
);

// React Router's route-level lazy loading: each page and its loader are
// bundled into a separate chunk that is only fetched when the route is visited.
// Navbar and MainContainer remain eagerly loaded since they are always visible.
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="app">
        <Navbar />
        <MainContainer>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </MainContainer>
      </div>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component, loginLoader: loader } = await import(
            "./components/Pages/Login"
          );
          return { Component, loader };
        },
      },
      {
        path: "/login",
        lazy: async () => {
          const { default: Component, loginLoader: loader } = await import(
            "./components/Pages/Login"
          );
          return { Component, loader };
        },
      },
      {
        path: "/profile",
        lazy: async () => {
          const { default: Component, profileLoader: loader } = await import(
            "./components/Pages/Profile"
          );
          return { Component, loader };
        },
      },
      {
        path: "/outing",
        lazy: async () => {
          const { default: Component, goLoader: loader } = await import(
            "./components/Pages/Go"
          );
          return { Component, loader };
        },
      },
      {
        path: "/chat",
        lazy: async () => {
          const { default: Component, chatLoader: loader } = await import(
            "./components/Pages/Chat"
          );
          return { Component, loader };
        },
      },
      {
        path: "/social",
        lazy: async () => {
          const { default: Component, socialLoader: loader } = await import(
            "./components/Pages/Social"
          );
          return { Component, loader };
        },
      },
      {
        path: "/email-verified",
        lazy: async () => {
          const { default: Utility } = await import("./components/Pages/Utility");
          return { Component: () => <Utility page="email-verified" /> };
        },
      },
      {
        path: "/send-reset-password-link",
        lazy: async () => {
          const { default: Utility } = await import("./components/Pages/Utility");
          return { Component: () => <Utility page="send-reset-password-link" /> };
        },
      },
      {
        path: "/reset-password-link-sent",
        lazy: async () => {
          const { default: Utility } = await import("./components/Pages/Utility");
          return { Component: () => <Utility page="reset-password-link-sent" /> };
        },
      },
      {
        path: "/reset-password/:userID",
        lazy: async () => {
          const { default: Utility } = await import("./components/Pages/Utility");
          return { Component: () => <Utility page="reset-password" /> };
        },
      },
      {
        path: "/password-reset-success",
        lazy: async () => {
          const { default: Utility } = await import("./components/Pages/Utility");
          return { Component: () => <Utility page="password-reset-success" /> };
        },
      },
    ],
  },
]);

export default router;
