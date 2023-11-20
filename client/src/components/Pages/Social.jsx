import { useSelector } from "react-redux";
import { pageRouteLoader, sortByDate } from "../../utils/utils";
import styles from "./styles/Social.module.scss";
import { Fragment, useEffect, useState } from "react";
import FeedCard from "../UI/FeedCard";
import { fetchFeedOutings } from "../../utils/data-fetch";
import SimpleButton from "../UI/SimpleButton";

const Social = (props) => {
  const [outings, setOutings] = useState(false);
  const [refreshText, setRefreshText] = useState("Refresh");
  const user = useSelector((state) => state.auth.user);

  const sortedKeys = Object.keys(outings).toSorted((a, b) =>
    sortByDate(outings[b].date_created, outings[a].date_created)
  );

  const getOutings = (user) => {
    const onComplete = (response) => {
      setRefreshText("Refresh");
      setOutings(response.outings);
    };
    setRefreshText("Loading..");
    fetchFeedOutings(user, onComplete);
  };

  useEffect(() => {
    getOutings(user);
  }, [user]);

  const onRefresh = () => {
    getOutings(user);
  };
  return (
    <Fragment>
      <SimpleButton className={styles.refreshButton} onClick={onRefresh}>
        {refreshText}
      </SimpleButton>
      {outings ? (
        <div className={styles.container}>
          {sortedKeys.map((k) => (
            <FeedCard key={Math.random()} outing={outings[k]} />
          ))}
        </div>
      ) : (
        <h2>Loading Feed..</h2>
      )}
    </Fragment>
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
