import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/AutoLocationToggle.module.scss";
import { authActions } from "../../store/auth-slice";
import { confirmLocation, currentPlace, saveLocation } from "../../utils/location";
import { useT } from "../../i18n";

// Settings switch: "Keep my location up to date". Turning it on asks for
// location permission (from this tap) and sets the city right away; after
// that the app refreshes it on open (see autoUpdateLocation).
const AutoLocationToggle = () => {
  const { t } = useT();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const on = !!user?.auto_location;

  const toggle = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      let update;
      if (on) {
        update = await saveLocation(user._id, { auto_location: false });
      } else {
        const place = await currentPlace(); // permission prompt happens here
        confirmLocation(place.label, { lat: place.lat, lng: place.lng });
        update = await saveLocation(user._id, {
          auto_location: true,
          location: place.label,
          location_geo: { lat: place.lat, lng: place.lng },
        });
      }
      dispatch(authActions.setUser({ ...user, ...update }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={styles.row}
        onClick={toggle}
        disabled={busy}
      >
        <span className={styles.text}>
          <span className={styles.title}>{t("location.auto.title")}</span>
          <span className={styles.caption}>
            {busy
              ? on
                ? t("location.auto.turningOff")
                : t("location.finding")
              : t("location.auto.caption")}
          </span>
        </span>
        <span className={`${styles.switch} ${on ? styles.switchOn : ""}`}>
          <span className={styles.knob} />
        </span>
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default AutoLocationToggle;
