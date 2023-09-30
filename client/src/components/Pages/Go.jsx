import MainContainer from "../UI/MainContainer";
import styles from "./styles/Go.module.scss";
import { checkAuth } from "../../store/auth-actions";

const Go = (props) => {
  return (
    <MainContainer>
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div className={styles.userIcon}></div>
          <button className={styles.addButton}>+</button>
        </div>
        <label for="categories">Choose Activity Category</label>
        <select name="categories" className={styles.select}>
          <option value="">--Choose Activity Category--</option>
          <option value="games">Games</option>
          <option value="food">Food</option>
        </select>
        <label for="activities">Choose Activity</label>
        <select name="activities" className={styles.select}>
          <option value="">--Choose Activity--</option>
          <option value="beerpong">Park Pong</option>
          <option value="icecream">Ice Cream Bang Bang</option>
        </select>
        <button className={styles.goButton}>Get off your a**!</button>
        <div className={styles.searchContainer}></div>
      </div>
    </MainContainer>
  );
};

export default Go;

export const goLoader = async () => {
  await checkAuth()()
  return null;
};
