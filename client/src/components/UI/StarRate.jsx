import styles from "./styles/StarRate.module.scss";
import starFullIcon from "../../images/star-full.png";
import starEmptyIcon from "../../images/star-empty.png";

const StarRate = (props) => {
  const click1 = (e) => {
    props.setTouched(true)
    props.setRating(1);
  };
  const click2 = (e) => {
    props.setTouched(true)
    props.setRating(2);
  };
  const click3 = (e) => {
    props.setTouched(true)
    props.setRating(3);
  };
  const click4 = (e) => {
    props.setTouched(true)
    props.setRating(4);
  };
  const click5 = (e) => {
    props.setTouched(true)
    props.setRating(5);
  };

  return (
    <div className={styles.container}>
      <img
        onClick={click1}
        className={styles.ratingStar}
        src={starFullIcon}
        alt="star-full"
      />
      {props.rating < 2 ? (
        <img
          onClick={click2}
          className={styles.ratingStar}
          src={starEmptyIcon}
          alt="star-mt"
        />
      ) : (
        <img
          onClick={click2}
          className={styles.ratingStar}
          src={starFullIcon}
          alt="star-full"
        />
      )}
      {props.rating < 3 ? (
        <img
          onClick={click3}
          className={styles.ratingStar}
          src={starEmptyIcon}
          alt="star-mt"
        />
      ) : (
        <img
          onClick={click3}
          className={styles.ratingStar}
          src={starFullIcon}
          alt="star-full"
        />
      )}
      {props.rating < 4 ? (
        <img
          onClick={click4}
          className={styles.ratingStar}
          src={starEmptyIcon}
          alt="star-mt"
        />
      ) : (
        <img
          onClick={click4}
          className={styles.ratingStar}
          src={starFullIcon}
          alt="star-full"
        />
      )}
      {props.rating < 5 ? (
        <img
          onClick={click5}
          className={styles.ratingStar}
          src={starEmptyIcon}
          alt="star-mt"
        />
      ) : (
        <img
          onClick={click5}
          className={styles.ratingStar}
          src={starFullIcon}
          alt="star-full"
        />
      )}
    </div>
  );
};

export default StarRate;
