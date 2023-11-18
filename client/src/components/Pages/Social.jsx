import { useSelector } from "react-redux";
import { pageRouteLoader } from "../../utils/utils";
import styles from "./styles/Social.module.scss";
import { useEffect, useState } from "react";
import FeedCard from "../UI/FeedCard";
import { fetchFeedOutings } from "../../utils/data-fetch";

const Social = (props) => {
  const [outings, setOutings] = useState(false);
  const user = useSelector((state) => state.auth.user);

  console.log(outings)

  useEffect(() => {
    const onComplete = (response) => {
      setOutings(response.outings);
    };
    fetchFeedOutings(user, onComplete);
  }, [user]);
  return (
    outings && (
      <div className={styles.container}>
       {/*  {outings.map((o) => (
          <FeedCard outing={o} />
        ))} */}
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
