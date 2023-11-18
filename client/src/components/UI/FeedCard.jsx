import { useSelector } from "react-redux";
import UserIconCluster from "./UserIconCluster";
import styles from "./styles/FeedCard.module.scss";
import { useEffect, useState } from "react";
import { fetchOutingPhotos } from "../../utils/data-fetch";

const FeedCard = (props) => {
  const globals = useSelector((state) => state.auth.globals);
  const user = useSelector((state) => state.auth.user);
  const categoryColorMap = globals.categoryColorMap;
  const [outingPhotos, setOutingPhotos] = useState(false);
  const photoGridNumber = outingPhotos?.length > 6 ? 6 : outingPhotos?.length;
  const outing = props.outing;
  const activityColor = categoryColorMap[outing?.activity?.category];

  // Get Outing photos from server
  useEffect(() => {
    const onComplete = (response) => {
      setOutingPhotos(response.images);
    };
    fetchOutingPhotos(user, outing, onComplete);
  }, [user, outing]);

  return (
    outing && (
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div
            style={{ backgroundColor: activityColor }}
            className={styles.colorStripe}
          ></div>
          <div className={styles.topInnerContainer}>
            <UserIconCluster
              users={outing.users}
              sizeInRem={7}
              borderSizeInRem={0.8}
            />
            <div className={styles.activityName}>{outing.activity.name}</div>
          </div>
        </div>
        <div
          className={`${styles.photosContainer} ${
            styles[`container_${photoGridNumber}`]
          }`}
        ></div>
        {outingPhotos.map((img) => (
          <div>photo</div>
        ))}
      </div>
    )
  );
};

export default FeedCard;
