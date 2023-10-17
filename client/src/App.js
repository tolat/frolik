import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useDispatch, useSelector } from "react-redux";
import { goActions } from "./store/go-slice";
import { fetchAuth } from "./store/auth-actions";

function App() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(goActions.setUsers([authState.user._id]));
  }, [authState.user._id, dispatch]);

  return <RouterProvider router={router} />;
}

export default App;

export const appLoader = async () => {
  await fetchAuth()();

  return null;
};
