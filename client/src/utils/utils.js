import { redirect } from "react-router-dom";
import store from "../store";
import { fetchAuth } from "../store/auth-actions";
import { hideModal } from "../store/modal-actions";

export const calcAvgRating = (activity) => {
  return (
    activity.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
    activity.ratings.length
  ).toFixed(1);
};

export const pageRouteLoader = async () => {
  // fetch session authentication in the background
  fetchAuth();

  // Hide Modal if it is visible. await it to make sure visible modal
  // doesn't disappear until the modal is hidden
  if (store.getState().modal.marginLeft === "0%") await hideModal();

  // Redirect if user is not authenticated
  if (!store.getState().auth.isAuthenticated) {
    return redirect("/login");
  } else {
   
    return false;
  }
};

export const arrayBufferToBase64 = (buffer) => {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const loadImageAsBase64 = async (imageUrl, setImage) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      const trimmedString = base64String.slice(base64String.indexOf(",") + 1);
      setImage(trimmedString);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Error loading image:", error);
  }
};


export const genMembersString = (memberNames) => {
  let result = "";
  for (let i = 0; i < memberNames.length; i++) {
    if (i > 3) {
      return result.slice(0,result.length - 2).concat(".. 4+");
    } else if (i === memberNames.length - 1) {
      return result.concat(`${memberNames[i]}`);
    } else {
      result = result.concat(`${memberNames[i]}, `);
    }
  }
};
