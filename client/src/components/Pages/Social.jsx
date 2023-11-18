import { useSelector } from "react-redux";
import { pageRouteLoader, sortByDate } from "../../utils/utils";
import styles from "./styles/Social.module.scss";
import { useEffect, useState } from "react";
import FeedCard from "../UI/FeedCard";
import { fetchFeedOutings } from "../../utils/data-fetch";
import PhotoPopup from "../Popups/PhotoPopup";

const Social = (props) => {
  const [outings, setOutings] = useState(false);
  const [popupImage, setPopupImage] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const sortedKeys = Object.keys(outings).toSorted((a, b) =>
    sortByDate(outings[b].date_created, outings[a].date_created)
  );

  useEffect(() => {
    const onComplete = (response) => {
      setOutings(response.outings);
    };
    fetchFeedOutings(user, onComplete);
  }, [user]);
  return (
    outings && (
      <div className={styles.container}>
        <PhotoPopup selector={"view-feed-image"} image={popupImage} />
        {sortedKeys.map((k) => (
          <FeedCard
            setPopupImage={setPopupImage}
            key={Math.random()}
            outing={outings[k]}
          />
        ))}
      </div>
    )
  );
};

export const socialLoader = async () => {
  const redirect = await pageRouteLoader();
  if (redirect) {
    return redirect;
  }

  return null;
};

export default Social;
