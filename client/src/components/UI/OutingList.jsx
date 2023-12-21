import { useSelector } from "react-redux";
import OutingCard from "./OutingCard";
import styles from "./styles/OutingList.module.scss";
import { outingIsCompleted, sortByDate, toSorted } from "../../utils/utils";
import SimpleSearch from "./SimpleSearch";
import { useState } from "react";
import FeedCard from "./FeedCard";

const OutingList = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [outingSearch, setOutingSearch] = useState("");
  const nonPending = applyOutingSearch(
    user?.outings.filter(
      (o) => outingIsCompleted(o) || o.flakes.find((id) => id === user._id)
    )
  );
  const pending = applyOutingSearch(
    user?.outings.filter(
      (o) => !outingIsCompleted(o) && !o.flakes.find((id) => id === user._id)
    )
  );

  function applyOutingSearch(outings) {
    return outingSearch || outingSearch !== ""
      ? outings.filter((o) => {
          return (
            o.name
              .toLowerCase()
              .trim()
              .includes(outingSearch.toLowerCase().trim()) ||
            o.users.find(
              (u) =>
                u.first_name
                  ?.toLowerCase()
                  .trim()
                  .includes(outingSearch.toLowerCase().trim()) ||
                u.last_name
                  ?.toLowerCase()
                  .trim()
                  .includes(outingSearch.toLowerCase().trim())
            ) ||
            o.activity?.name
              .toLowerCase()
              .trim()
              .includes(outingSearch.toLowerCase().trim())
          );
        })
      : outings;
  }

  return (
    <div className={styles.container}>
      <SimpleSearch
        defaultVal={""}
        setValue={setOutingSearch}
        style={{ marginTop: "1rem" }}
        placeholder={"Search Outings.."}
      />
      {pending[0] && (
        <div className={styles.pendingContainer}>
          <div className={styles.completedHeader}>Pending Outings</div>
          <div className={styles.headingBlurb}>
            <b>You can have up to 5 pending outings at a time.</b>
            <br />
            <br />
          </div>
          {toSorted(pending, (a, b) =>
            sortByDate(b.date_created, a.date_created)
          ).map((o) => (
            <div key={Math.random()} className={styles.outingContainer}>
              <OutingCard outing={o} user={user} />
            </div>
          ))}
        </div>
      )}
      <div className={styles.completedHeader}>Completed Outings</div>
      <div className={styles.headingBlurb}>
        <b>Your flaked outings show up in red.</b>
      </div>
      {nonPending[0] &&
        toSorted(nonPending, (a, b) =>
          sortByDate(b.date_created, a.date_created)
        ).map((o) =>
          o.flakes.find((id) => id === user._id) ? (
            <div key={Math.random()} className={styles.outingContainer}>
              <OutingCard outing={o} user={user} />
            </div>
          ) : (
            <div key={Math.random()} className={styles.outingContainer}>
              <FeedCard outing={o} />
            </div>
          )
        )}
    </div>
  );
};

export default OutingList;
