import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import { fetchAuth } from "./store/auth-actions";
import { hideModalFast } from "./store/modal-actions";
import { redirect } from "react-router-dom";
import { goActions } from "./store/go-slice";

const appLoader = async () => {
  await fetchAuth()();
  hideModalFast();

  if (!store.getState().auth.isAuthenticated) {
    return redirect("/login");
  } else {
    // Set authenticated user as default for go page
    const user = store.getState().auth.user;
    if (!store.getState().go.outing.users.find((u) => u._id !== user._id))
      store.dispatch(goActions.setUsers([user]));
  }

  return null;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
const render = async () => {
  await appLoader();
  root.render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  );
};

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
