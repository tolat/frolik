import MainContainer from "../UI/MainContainer";
import styles from "./styles/Go.module.scss";
import { fetchAuth } from "../../store/auth-actions";
import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";
import store from "../../store";

const Go = (props) => {

  return (
    <MainContainer>
      <div className={styles.container}>
        <div className={styles.userContainer}>
          <div className={styles.userIcon}></div>
          <button className={styles.addButton}>+</button>
        </div>
        <label htmlFor="categories">Choose Activity Category</label>
        <select name="categories" className={styles.select}>
          <option value="">--Choose Activity Category--</option>
          <option value="games">Games</option>
          <option value="food">Food</option>
        </select>
        <label htmlFor="activities">Choose Activity</label>
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
  await fetchAuth()();

  if (!store.getState().auth.isAuthenticated) {
    return redirect("/login");
  }
  return null;
};
