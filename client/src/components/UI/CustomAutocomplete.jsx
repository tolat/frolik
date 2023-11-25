import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/CustomAutocomplete.module.scss";

const CustomAutocomplete = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.defaultVal);
  const [showOptions, setShowOptions] = useState(false);


  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(e.target.value);
    props.setDataChanged && props.setDataChanged(newValue)
    setShowOptions(true);
  };

  const handleSelectCity = (o) => {
    const newValue = `${o.name}, ${o.country}`;
    setValue(newValue);
    props.setDataChanged && props.setDataChanged(newValue)
    setShowOptions(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
    }, 100);
  };

  useEffect(() => {
    setValue(props.defaultVal);
  }, [props.defaultVal]);

  return (
    <div id={props.id} className={`${styles.container} ${props.className}`}>
      <label className={styles.label} htmlFor={`${props.name}-autocomplete`}>
        {props.label}
      </label>
      <input
        onFocus={() => {
          setShowOptions(true);
        }}
        placeholder={props.placeholder}
        onBlur={handleInputBlur}
        name={props.name}
        id={`${props.name}-select`}
        ref={ref}
        value={value}
        onChange={handleChange}
        className={styles.input}
      />
      {!showOptions || !value || value.length < 2 ? null : (
        <div
          id="city-select-options-container"
          className={styles.optionsContainer}
        >
          {props.options &&
            props.options
              .filter((o) =>
                o.name
                  .toLowerCase()
                  .includes(
                    value.slice(0, value.indexOf(",") || "").toLowerCase()
                  )
              )
              .map((o) => (
                <div
                  key={Math.random()}
                  onClick={() => {
                    handleSelectCity(o);
                  }}
                  className={styles.optionContainer}
                >
                  {o.name}, {o.country}
                </div>
              ))}
        </div>
      )}
    </div>
  );
});

export default CustomAutocomplete;
