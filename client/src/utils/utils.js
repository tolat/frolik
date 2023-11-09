import { redirect } from "react-router-dom";
import store from "../store";
import { fetchAuth } from "../store/auth-actions";
import { hideModal } from "../store/modal-actions";

export const calcAvgRating = (activity) => {
  if (!activity.ratings) {
    return 0;
  }
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
      return result.slice(0, result.length - 2).concat(".. 4+");
    } else if (i === memberNames.length - 1) {
      return result.concat(`${memberNames[i]}`);
    } else {
      result = result.concat(`${memberNames[i]}, `);
    }
  }
};

export const initialActivityFilter = {
  filter: {
    category: "Any",
    maxParticipants: "",
    minParticipants: "",
    minRating: "",
    maxCost: "",
    minCost: "",
    maxTime: "",
    newOnly: false,
    completedOnly: false,
    featuredOnly: false,
  },
  activities: [],
  initialActivities: [],
  active: false,
};

export const filterReducer = (state, action) => {
  const applyFilter = (activities, filter) => {
    const filteredActivities = [];
    const completedActivities = store
      .getState()
      .auth.user?.outings?.map((outing) => outing.activity._id);

    // Apply category filter
    for (let activity of activities) {
      if (
        // Category
        (filter?.category &&
          filter?.category !== "Any" &&
          activity?.category !== filter?.category) ||
        // Participant
        (filter?.minParticipants &&
          activity.participants < filter?.minParticipants) ||
        (filter?.maxParticipants &&
          activity.participants > filter?.maxParticipants) ||
        // Rating
        (filter?.minRating && calcAvgRating(activity) < filter?.minRating) ||
        // Cost
        (filter?.minCost && activity.cost < filter?.minCost) ||
        (filter?.maxCost && activity.cost > filter?.maxCost) ||
        // Time
        (filter?.maxTime && activity.duration > filter?.maxTime) ||
        // Fetured Only
        (filter?.featuredOnly && !activity.featured) ||
        // New Only
        (filter?.newOnly && completedActivities.includes(activity._id)) ||
        // Completed Only
        (filter?.completedOnly && !completedActivities.includes(activity._id))
      ) {
        continue;
      } else {
        filteredActivities.push(activity);
      }
    }

    return filteredActivities;
  };

  if (action.type === "set-initial") {
    return { ...state, initialActivities: action.activities };
  }

  if (action.type === "apply-filter") {
    const activities = applyFilter(state.initialActivities, action.filter);
    return {
      ...state,
      activities: activities,
      filter: action.filter,
      active: action.active,
    };
  }
};

export const filtersAreEqual = (f1, f2) => {
  for (let key in f1) {
    if (f1?.[key] !== f2?.[key]) {
      return false;
    }
  }

  return true;
};

export const toAppDate = (date) => {
  return `${new Date(date).toDateString().slice(4, 15)} - 
  ${new Date(date).toTimeString().slice(0, 5)}`;
};
