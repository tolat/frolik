import styles from "./styles/ErrorPage.module.scss";
import { useRouteError } from "react-router-dom";
import { useT } from "../../i18n";

const ErrorPage = (props) => {
    const error = useRouteError()
    const { t } = useT();

    console.log(error)
  return (
    <div className={styles.container}>
      <h1>{t("errors.title")}</h1>
      <p>{error.message}</p>
    </div>
  );
};

export default ErrorPage;
