import { RouterProvider } from "react-router-dom";
import router from "./router";
import { initializeUserPhotos } from "./store/data-actions";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const user = useSelector((state) => state.auth.user);

  // Move conditional load out of useEffect for this fn
  const conditionalPhotoLoader = (user) => {
    if (user) {
      initializeUserPhotos(user);
    }
  };

  // Load user photos on app laod
  useEffect(() => {
    conditionalPhotoLoader(user);
  }, [user]);

  return <RouterProvider router={router} />;
}

export default App;
