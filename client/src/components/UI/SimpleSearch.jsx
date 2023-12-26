import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/SimpleSearch.module.scss";
import searchIcon from "../../images/search.png";

const SimpleSearch = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);

  // Execute on changes to the input element
  const onChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.setValue && props.setValue(newValue);
  };

  // Set default value on component load and
  // run submit validators if submitting
  useEffect(() => {
    setValue(props.defaultVal);
  }, [props.defaultVal]);

  return (
    <div
      style={props.style}
      className={`${styles.container} ${props.className}`}
    >
      <input
        placeholder={props.placeholder}
        onChange={onChange}
        value={value}
        ref={ref || null}
        className={styles.input}
        onClick={props.onClick}
        id={props.id}
        name={props.name}
        required={props.required}
        type={props.type}
      ></input>
      <div className={styles.searchIconContainer}>
        <img
          className={styles.searchIcon}
          src={searchIcon}
          alt={"search-glass"}
        />
      </div>
    </div>
  );
});

export default SimpleSearch;
