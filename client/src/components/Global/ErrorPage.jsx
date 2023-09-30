import styles from "./styles/ErrorPage.module.scss";
import { useRouteError } from "react-router-dom";

const ErrorPage = (props) => {
    const error = useRouteError()

    console.log(error)
  return (
    <div className={styles.container}>
      <h1>An Error Occured!</h1>
    </div>
  );
};

export default ErrorPage;
