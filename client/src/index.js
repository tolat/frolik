import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import { pageLoader } from "./utils/utils";
import { fetchAuth } from "./store/auth-actions";

async function appLoader() {
  await fetchAuth()()
  const redirect = await pageLoader();
  if (redirect) {
    return redirect;
  }

  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
const render = async () => {
 await appLoader();
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
