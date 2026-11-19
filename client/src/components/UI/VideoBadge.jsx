import styles from "./styles/VideoBadge.module.scss";
import { useT } from "../../i18n";

// Small play mark on a video tile, so a looping clip reads as a video
const VideoBadge = () => {
  const { t } = useT();
  return (
    <span className={styles.badge} aria-label={t("outing.video.label")} role="img">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </span>
  );
};

export default VideoBadge;
