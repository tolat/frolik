import { useEffect, useRef, useState } from "react";
import styles from "./styles/LocationAutocomplete.module.scss";
import { confirmLocation, currentPlace, searchPlaces } from "../../utils/location";
import LoaderSpinner from "./LoaderSpinner";

// City input backed by the server's geocoding search. Typing shows matching
// cities; picking one (or "Use my current location") confirms it with
// coordinates. Calls setDataChanged(label) on every change.
const LocationAutocomplete = (props) => {
  const [value, setValue] = useState(props.defaultVal || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);
  const timerRef = useRef(null);
  const inputID = `${props.name || "location"}-input`;

  useEffect(() => {
    setValue(props.defaultVal || "");
  }, [props.defaultVal]);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      abortRef.current?.abort();
    },
    []
  );

  const runSearch = (q) => {
    clearTimeout(timerRef.current);
    abortRef.current?.abort();
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Debounce keystrokes, and drop responses for older queries
    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const places = await searchPlaces(q.trim(), controller.signal);
        setResults(places);
        setActive(places.length ? 0 : -1);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") setError("Location search is unavailable right now.");
      } finally {
        if (abortRef.current === controller) setLoading(false);
      }
    }, 250);
  };

  const choose = (place) => {
    confirmLocation(place.label, { lat: place.lat, lng: place.lng });
    setValue(place.label);
    props.setDataChanged?.(place.label);
    setOpen(false);
    setResults([]);
    setError("");
  };

  const onChange = (e) => {
    setValue(e.target.value);
    props.setDataChanged?.(e.target.value);
    setOpen(true);
    runSearch(e.target.value);
  };

  const onKeyDown = (e) => {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const useCurrentLocation = async () => {
    setLocating(true);
    setError("");
    try {
      choose(await currentPlace());
    } catch (err) {
      setError(err.message);
    } finally {
      setLocating(false);
    }
  };

  const showList = open && value.trim().length >= 2;

  return (
    <div
      id={props.id}
      className={`${styles.container} ${props.locked ? styles.locked : ""} ${
        props.className || ""
      }`}
    >
      {props.label && (
        <label className={styles.label} htmlFor={inputID}>
          {props.label}
        </label>
      )}
      <div className={styles.inputRow}>
        <input
          id={inputID}
          name={props.name}
          className={styles.input}
          value={value}
          placeholder={props.placeholder || "Search for your city"}
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${inputID}-list`}
          aria-autocomplete="list"
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => !props.locked && setOpen(true)}
          readOnly={!!props.locked}
          aria-readonly={!!props.locked}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {props.locked && <span className={styles.autoPill}>Auto</span>}
        {loading && !props.locked && (
          <span className={styles.inputSpinner}>
            <LoaderSpinner width="1.6rem" height="1.6rem" color="#5b8def" />
          </span>
        )}
        {showList && (
          <ul id={`${inputID}-list`} className={styles.options} role="listbox">
            {results.map((p, i) => (
              <li
                key={`${p.label}|${p.detail}|${p.lat}`}
                role="option"
                aria-selected={i === active}
                className={`${styles.option} ${i === active ? styles.optionActive : ""}`}
                onMouseDown={(e) => e.preventDefault()} // keep input focus
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(p)}
              >
                <span className={styles.optionLabel}>{p.label.split(",")[0]}</span>
                <span className={styles.optionDetail}>{p.detail}</span>
              </li>
            ))}
            {!loading && !results.length && (
              <li className={styles.empty}>No matching cities</li>
            )}
          </ul>
        )}
      </div>

      {props.showCurrentLocation !== false && !props.locked && (
        <button
          type="button"
          className={styles.currentButton}
          onClick={useCurrentLocation}
          disabled={locating}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.currentIcon}>
            <path
              d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {locating ? "Finding your city…" : "Use my current location"}
        </button>
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default LocationAutocomplete;
