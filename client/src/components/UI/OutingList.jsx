import { useSelector } from "react-redux";
import OutingCard from "./OutingCard";
import styles from "./styles/OutingList.module.scss";
import { outingIsCompleted, sortByDate } from "../../utils/utils";
import SimpleSearch from "./SimpleSearch";
import { useState } from "react";

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
          <h2>Pending Outings</h2>
          <div className={styles.headingBlurb}>
            <b>You can have up to 5 pending outings at a time.</b>
            <br />
            <br />
          </div>
          {pending
            .toSorted((a, b) => sortByDate(b.date_created, a.date_created))
            .map((o) => (
              <div key={Math.random()} className={styles.outingContainer}>
                <OutingCard outing={o} user={user} />
              </div>
            ))}
        </div>
      )}
      {nonPending[0] &&
        nonPending
          .toSorted((a, b) => sortByDate(b.date_created, a.date_created))
          .map((o) => (
            <div key={Math.random()} className={styles.outingContainer}>
              <OutingCard
                setModalOuting={props.setModalOuting}
                outing={o}
                user={user}
              />
            </div>
          ))}
    </div>
  );
};

export default OutingList;
