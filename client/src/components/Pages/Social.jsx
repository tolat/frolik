import { useSelector } from "react-redux";
import { pageRouteLoader, sortByDate, toSorted } from "../../utils/utils";
import styles from "./styles/Social.module.scss";
import { Fragment, useCallback, useEffect, useState } from "react";
import FeedCard from "../UI/FeedCard";
import { fetchFeedOutings } from "../../utils/data-fetch";
import SimpleSearch from "../UI/SimpleSearch";
import { usePageRefresh } from "../../utils/pageRefresh";
import useIncrementalList from "../../utils/useIncrementalList";
import ListSentinel from "../UI/ListSentinel";

const Social = (props) => {
  const [outings, setOutings] = useState({});
  const [feedSearch, setFeedSearch] = useState("");
  const user = useSelector((state) => state.auth.user);
  const fetchingFeedOutings = useSelector(
    (state) => state.data.fetchingFeedOutings
  );

  const sortedKeys = toSorted(Object.keys(outings), (a, b) =>
    sortByDate(outings[b].date_created, outings[a].date_created)
  );

  const validKeys = applyChatSearch(sortedKeys);
  // Render the feed 5 posts at a time as the user scrolls
  const { visible: visibleKeys, hasMore, sentinelRef } = useIncrementalList(
    validKeys,
    5,
    feedSearch
  );

  const getOutings = useCallback(
    (u) =>
      new Promise((resolve) => {
        fetchFeedOutings(u, (response) => {
          setOutings(response.outings);
          resolve();
        });
      }),
    []
  );

  useEffect(() => {
    getOutings(user);
  }, [user]);

  // Pull-to-refresh (app-wide) reloads the feed
  usePageRefresh(() => getOutings(user));

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
      <div className={styles.container}>
        <SimpleSearch
          setValue={setFeedSearch}
          defaultVal={""}
          placeholder={"Search Posts.."}
        />
        {outings ? (
          Object.keys(outings)[0] ? (
            <Fragment>
              {visibleKeys.map((k) => (
                <FeedCard key={k} outing={outings[k]} />
              ))}
              <ListSentinel ref={sentinelRef} hasMore={hasMore} />
            </Fragment>
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
      </div>
    </Fragment>
  );
};

export const socialLoader = async () => {
  const redirect = await pageRouteLoader("/social");
  if (redirect) {
    return redirect;
  }

  return null;
};

export default Social;
