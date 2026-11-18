import styles from "./styles/Footer.module.scss";
import { useT } from "../../i18n";

const Footer = () => {
  const { t } = useT();
  return (
  <div className={styles.footer}>
    {t("nav.footer")}
  </div>

)}

export default Footer;