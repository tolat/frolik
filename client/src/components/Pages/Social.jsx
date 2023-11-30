import { useSelector } from "react-redux";
import { pageRouteLoader, sortByDate, toSorted } from "../../utils/utils";
import styles from "./styles/Social.module.scss";
import { Fragment, useEffect, useState } from "react";
import FeedCard from "../UI/FeedCard";
import { fetchFeedOutings } from "../../utils/data-fetch";
import SimpleButton from "../UI/SimpleButton";
import SimpleSearch from "../UI/SimpleSearch";

const Social = (props) => {
  const [outings, setOutings] = useState({});
  const [refreshText, setRefreshText] = useState("Refresh");
  const [feedSearch, setFeedSearch] = useState("");
  const user = useSelector((state) => state.auth.user);
  const fetchingFeedOutings = useSelector(
    (state) => state.data.fetchingFeedOutings
  );

  const sortedKeys = toSorted(Object.keys(outings), (a, b) =>
    sortByDate(outings[b].date_created, outings[a].date_created)
  );

  const validKeys = applyChatSearch(sortedKeys);
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

  function applyChatSearch(rawKeys) {
    return feedSearch || feedSearch !== ""
      ? rawKeys.filter((key) => {
          const postOuting = outings[key];
          const outingUsers = postOuting.users;

          return (
            (postOuting.name &&
              postOuting.name
                .toLowerCase()
                .trim()
                .includes(feedSearch.toLowerCase().trim())) ||
            outingUsers.find(
              (u) =>
                u.first_name
                  ?.toLowerCase()
                  .trim()
                  .includes(feedSearch.toLowerCase().trim()) ||
                u.last_name
                  ?.toLowerCase()
                  .trim()
                  .includes(feedSearch.toLowerCase().trim())
            ) ||
            postOuting.activity.name
              .toLowerCase()
              .trim()
              .includes(feedSearch.toLowerCase().trim())
          );
        })
      : rawKeys;
  }

  return (
    <Fragment>
      <SimpleButton className={styles.refreshButton} onClick={onRefresh}>
        {refreshText}
      </SimpleButton>
      <SimpleSearch
        setValue={setFeedSearch}
        defaultVal={""}
        placeholder={"Search Posts.."}
      />
      {outings ? (
        Object.keys(outings)[0] ? (
          <div className={styles.container}>
            {validKeys.map((k) => (
              <FeedCard key={Math.random()} outing={outings[k]} />
            ))}
          </div>
        ) : fetchingFeedOutings ? (
          <h2>Loading Posts..</h2>
        ) : (
          <div className={styles.noOutingsMessage}>
            <h2 className={styles.noOutingsMessageHeader}>
              Nothing to show yet!
            </h2>

            <div className={styles.noOutingsMessageText}>
              You'll see outings completed by people in your friends network
              here.
            </div>
          </div>
        )
      ) : (
        <h2>Loading Posts..</h2>
      )}
    </Fragment>
  );
};

export const socialLoader = async () => {
  const redirect = await pageRouteLoader('/social');
  if (redirect) {
    return redirect;
  }

  return null;
};

export default Social;
