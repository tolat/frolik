import { redirect } from "react-router-dom";
import store from "../store";
import { hideModal } from "../store/modal-actions";
import { modalActions } from "../store/modal-slice";
import { fetchChats, updateChatLastRead } from "./data-fetch";

export const calcAvgRating = (activity) => {
  if (!activity.ratings) {
    return 0;
  }

  const ratingString = (
    activity.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
    activity.ratings.length
  ).toFixed(1);
  return isNaN(ratingString) ? "unrated" : `${ratingString}/5`;
};

export const pageRouteLoader = async (url) => {
  // Don't use previous modal
  store.dispatch(modalActions.setUsePrevious(false));

  // Blur everything
  const tmp = document.createElement("input");
  document.body.appendChild(tmp);
  setTimeout(() => {
    tmp.click();
    document.body.removeChild(tmp);
  }, 100);

  // Hide Modal if it is visible. await it to make sure visible modal
  // doesn't disappear until the modal is hidden
  if (store.getState().modal.marginLeft === "0%") {
    await hideModal();
  }

  // Redirect if user is not authenticated
  if (!store.getState().auth.isAuthenticated) {
    localStorage.setItem("previousUrl", url);
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
  const applyFilter = (activities, f) => {
    const filteredActivities = [];
    const completedActivities = store
      .getState()
      .auth.user?.outings?.map((outing) => outing.activity._id);

    // Apply category filter
    for (let a of activities) {
      if (
        // Category
        (f?.category && f?.category !== "Any" && a?.category !== f?.category) ||
        // Participant
        (f?.minParticipants && a.participants < f?.minParticipants) ||
        (f?.maxParticipants && a.participants > f?.maxParticipants) ||
        // Rating
        (f?.minRating && calcAvgRating(a) < f?.minRating) ||
        // Cost
        (f?.minCost && a.cost < f?.minCost) ||
        (f?.maxCost && a.cost > f?.maxCost) ||
        // Time
        (f?.maxTime && a.duration > f?.maxTime) ||
        // Featured Only
        (f?.featured && !a.featured) ||
        // Completed Only
        (f?.completed && !completedActivities.includes(a._id)) ||
        // Created Only
        (f?.created && !a.created_by)
      ) {
        continue;
      } else {
        filteredActivities.push(a);
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

  if (action.type === "add-activity") {
    const newActivities = [...state.initialActivities, action.payload];
    return {
      ...state,
      initialActivities: [...newActivities],
      activities: [...newActivities],
      filter: initialActivityFilter.filter,
    };
  }

  if (action.type === "remove-activity") {
    let newActivities = [...state.initialActivities].filter(
      (a) => a._id !== action.payload._id
    );
    return {
      ...state,
      initialActivities: [...newActivities],
      activities: [...newActivities],
      filter: initialActivityFilter.filter,
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

export const sortByDate = (a, b) => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export function getCroppedImageBase64(imageBase64, crop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const x = crop.x;
      const y = crop.y;
      const width = crop.width;
      const height = crop.height;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

      const croppedImageBase64 = canvas.toDataURL("image/jpeg");
      resolve(croppedImageBase64);
    };

    image.onerror = (error) => {
      console.error("Image load error:", error);
      reject(error);
    };

    image.src = imageBase64;
  });
}

export const outingIsCompleted = (outing) => {
  return (
    outing?.users[1] && outing?.users?.length === outing?.completions?.length
  );
};

export const userIsLastCompletion = (user, outing) => {
  return (
    !outing.completions.find((c) => c === user._id) &&
    outing.completions.length === outing.users.length - 1
  );
};

export const calculateFlakeRating = (user) => {
  const outingCount = user.outings.length;
  const flakeCount = user.outings.filter((o) =>
    o.flakes.find((id) => id === user._id)
  ).length;

  const rating = ((flakeCount / outingCount) * 5).toFixed(1);
  return isNaN(rating) ? 0.0 : rating;
};

export const dateSort = (a, b) => {
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  return aTime - bTime;
};

export const getTotalUnreadMessages = (user) => {
  return user?.chats
    ?.filter((c) =>
      c.outing ? !c.outing.flakes.find((uid) => uid === user._id) : true
    )
    .reduce((count, chat) => {
      return count + getUnreadChatMessages(user, chat);
    }, 0);
};

export const getUnreadChatMessages = (user, chat) => {
  const lastRead = chat?.last_read;
  if (!lastRead) {
    return 0;
  } else {
    if (lastRead[user._id] === "initialized") {
      return chat.messages.length;
    }
    const lastReadMessage = chat?.messages.find(
      (m) => m.id === lastRead[user._id]
    );
    const lastReadMessageIndex = chat?.messages.indexOf(lastReadMessage);
    if (!lastReadMessage) {
      return 0;
    } else {
      return lastReadMessageIndex;
    }
  }
};

export const setLastReadMessage = (message) => {
  if (message && store.getState().chat.updatingLastRead === message._id) {
    return;
  }
  const lastChat = store
    .getState()
    .chat.chats.find((c) => c._id === store.getState().modal.activeChat._id);
  // Set last read message if chat modal is being closed
  if (lastChat) {
    const lastMessage = message ? message : lastChat.messages[0];
    const user = store.getState().auth.user;
    const onComplete = () => {
      fetchChats(user);
    };

    if (lastMessage) {
      updateChatLastRead(user, lastChat, lastMessage.id, onComplete);
    }
  }
};

export function pixelsToRem(pixels) {
  // Get the root font size from the computed style of the document element
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  return pixels / rootFontSize;
}

export function remToPixels(rem) {
  // Get the root font size from the computed style of the document element
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  return rem * rootFontSize;
}

export function getElementOffsetTop(element) {
  // Get the bounding client rect of the element
  const rect = element.getBoundingClientRect();

  // Return the top offset relative to the document
  return rect.top + window.scrollY;
}

export function getElementOffsetToBottom(element) {
  // Get the bounding client rect of the element
  const rect = element.getBoundingClientRect();

  // Return the offset to the bottom relative to the document
  return rect.top + window.scrollY + element.offsetHeight;
}

export const objectsAreEqual = (obj1, obj2) => {
  console.log(obj1, obj2);
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const toSorted = (data, sortingFn) => {
  let newData = [...data];
  newData.sort((a, b) => sortingFn(a, b));
  return newData;
};

export const removeDuplicates = (array) => {
  let newarray = [];
  for (let item of array) {
    if (!newarray.includes(item)) {
      newarray.push(item);
    }
  }

  return newarray;
};

export const getCategoryPercentage = (category, user) => {
  const numCategory = user.outings?.filter(
    (o) => o.activity?.category === category
  ).length;

  return (100 * (numCategory / user?.outings?.length)).toFixed(2);
};

export const genBackgroundStr = (user, categoryColorMap) => {
  // Return grey border if user has no outings
  if (!user || !user.outings[0] || !categoryColorMap) {
    return "rgb(220,220,220)";
  }

  let backgroundString = "conic-gradient(";
  const keys = Object.keys(categoryColorMap);
  let percentageMap = {};

  // Build percentage map
  for (let i = 0; i < keys.length; i++) {
    const category = keys[i];
    const percentage = parseFloat(getCategoryPercentage(category, user));
    if (percentage !== 0) {
      percentageMap[category] = percentage;
    }
  }

  // Build color map for the icon circle based on percentage
  // of each activity category vs total number of that category for user
  const mapKeys = Object.keys(percentageMap);
  let cumulativePercentage = 0;
  for (let i = 0; i < mapKeys.length; i++) {
    const category = mapKeys[i];
    const nextCategory = mapKeys[(i + 1) % mapKeys.length];
    const percentage = percentageMap[category];

    backgroundString = backgroundString.concat(
      /* `${categoryColorMap[category]} ${cumulativePercentage}% ${
        percentage + cumulativePercentage
      }%` */

      `${categoryColorMap[category]} ${cumulativePercentage}%, 
         ${categoryColorMap[nextCategory]} ${
        cumulativePercentage + percentage
      }%`
    );

    if (i < mapKeys.length - 1) {
      backgroundString = backgroundString.concat(",");
    }

    cumulativePercentage = cumulativePercentage + percentage;
  }

  backgroundString = backgroundString.concat(")");
  return backgroundString;
};

export const genRandomChars = (length) => {
  const alphabet = "qwertyuiopasdfghjklzxcvbnm".split("");
  let string = "";
  for (let i = 0; i < length; i++) {
    const randIndex =
      ((Math.random() * 10000) % alphabet.length).toFixed(0) - 1;
    string = string.concat(alphabet[randIndex]);
  }

  return string;
};

export const capitalizeFirstLetter = (str) => {
  // Check if the string is not empty
  if (str && typeof str === "string") {
    // Capitalize the first letter and concatenate the rest of the string
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    // Handle empty or non-string input
    return str;
  }
};

export const showIosInstallModal = (localStorageKey) => {
  // detect if the device is on iOS
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  // check if the device is in standalone mode
  const isInStandaloneMode = () => {
    return "standalone" in window.navigator && window.navigator.standalone;
  };

  // check when modal has been shown last. show once every day.
  const localStorageKeyValue = localStorage.getItem(localStorageKey);
  const iosInstallModalShown = localStorageKeyValue
    ? Date.now() - parseInt(JSON.parse(localStorageKeyValue).time) < 10000
      ? true
      : false
    : false;

  const shouldShowModalResponse =
    isIos() && !isInStandaloneMode() && !iosInstallModalShown;

  if (shouldShowModalResponse) {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ time: new Date().getTime() })
    );
  }
  return shouldShowModalResponse;
};

export const showAndroidInstallModal = (localStorageKey) => {
  // detect if the device is on iOS
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  // check if the device is in standalone mode
  const isInStandaloneMode = () => {
    return "standalone" in window.navigator && window.navigator.standalone;
  };

  // check when modal has been shown last. show once every day.
  const localStorageKeyValue = localStorage.getItem(localStorageKey);
  const androidInstallModalShown = localStorageKeyValue
    ? Date.now() - parseInt(JSON.parse(localStorageKeyValue).time) < 86400000
      ? true
      : false
    : false;

  const shouldShowModalResponse =
    !isIos() && !isInStandaloneMode() && !androidInstallModalShown;

  if (shouldShowModalResponse) {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ time: new Date().getTime() })
    );
  }
  return shouldShowModalResponse;
};

export const alphabetSort = (a, b) => {
  if (a.first_name < b.first_name) {
    return -1;
  }
  if (a.first_name > b.first_name) {
    return 1;
  }
  return 0;
};
