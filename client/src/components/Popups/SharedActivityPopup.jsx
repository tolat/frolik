import { useSelector } from "react-redux";
import EmptyPopup from "./EmptyPopup";
import ActivityCard from "../UI/ActivityCard";

// An activity opened from a chat message: the same card as the social feed's
// activity popup, with Create Outing and Send.
const SharedActivityPopup = () => {
  const activity = useSelector((state) => state.popup.sharedActivity);
  return (
    <EmptyPopup selector="shared-activity" aboveNav={true}>
      {activity ? (
        <ActivityCard
          key={activity._id}
          showInstructions={true}
          activity={activity}
          hideSelect={true}
          socialActions={true}
          fitHeight={true}
        />
      ) : null}
    </EmptyPopup>
  );
};

export default SharedActivityPopup;
