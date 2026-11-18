import { useSelector } from "react-redux";
import OutingCard from "./OutingCard";
import styles from "./styles/OutingList.module.scss";
import { outingIsCompleted, sortByDate, toSorted } from "../../utils/utils";
import SimpleSearch from "./SimpleSearch";
import { useMemo, useState } from "react";
import FeedCard from "./FeedCard";
import useIncrementalList from "../../utils/useIncrementalList";
import ListSentinel from "./ListSentinel";
import { useT } from "../../i18n";

const OutingList = (props) => {
  const { t } = useT();
  let user = useSelector((state) => state.auth.user);
  if (props.user) user = props.user;

  const [outingSearch, setOutingSearch] = useState("");

  const searchTerm = outingSearch.toLowerCase().trim();

  // Memoize filtered + sorted lists so they aren't recomputed on every render
  const { pending, nonPending } = useMemo(() => {
    const filterBySearch = (outings) => {
      if (!searchTerm) return outings;
      return outings.filter((o) =>
        o.name.toLowerCase().trim().includes(searchTerm) ||
        o.activity?.name.toLowerCase().trim().includes(searchTerm) ||
        o.users.find(
          (u) =>
            u.first_name?.toLowerCase().trim().includes(searchTerm) ||
            u.last_name?.toLowerCase().trim().includes(searchTerm)
        )
      );
    };

    const allOutings = user?.outings ?? [];
    const pendingRaw = allOutings.filter(
      (o) => !outingIsCompleted(o) && !o.flakes.find((id) => id === user._id)
    );
    const nonPendingRaw = allOutings.filter(
      (o) => outingIsCompleted(o) || o.flakes.find((id) => id === user._id)
    );

    return {
      pending: toSorted(filterBySearch(pendingRaw), (a, b) =>
        sortByDate(b.date_created, a.date_created)
      ),
      nonPending: toSorted(filterBySearch(nonPendingRaw), (a, b) =>
        sortByDate(b.date_created, a.date_created)
      ),
    };
  }, [user, searchTerm]);

  // Completed outings (photo-heavy) render 5 at a time as the user scrolls
  const {
    visible: visibleCompleted,
    hasMore,
    sentinelRef,
  } = useIncrementalList(nonPending, 5, searchTerm);

  return (
    <div className={styles.container}>
      <SimpleSearch
        defaultVal={""}
        setValue={setOutingSearch}
        style={{ marginTop: "1rem" }}
        placeholder={t("ui.outingList.searchPlaceholder")}
      />
      {pending[0] && (
        <div className={styles.pendingContainer}>
          <div className={styles.completedHeader}>
            {t("ui.outingList.pendingHeader")}
          </div>
          <div className={styles.headingBlurb}>
            <b>{t("ui.outingList.pendingLimit", { count: 5 })}</b>
            <br />
            <br />
          </div>
          {!props.noPending &&
            pending.map((o) => (
              <div key={o._id} className={styles.outingContainer}>
                <OutingCard outing={o} user={user} />
              </div>
            ))}
        </div>
      )}
      {nonPending[0] &&
        visibleCompleted.map((o) =>
          o.flakes.find((id) => id === user._id) ? (
            <div key={o._id} className={styles.outingContainer}>
              <OutingCard outing={o} user={user} />
            </div>
          ) : (
            <div key={o._id} className={styles.outingContainer}>
              <FeedCard outing={o} />
            </div>
          )
        )}
      <ListSentinel ref={sentinelRef} hasMore={hasMore} />
    </div>
  );
};

export default OutingList;
