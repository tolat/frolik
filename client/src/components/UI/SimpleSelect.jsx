import styles from "./styles/SimpleSelect.module.scss";

const SimpleSelect = (props) => {
  return (
    <div className={styles.container}>
      <label className={styles.label} for={`${props.name}-select`}>
        {props.label}
      </label>
      <select
        className={styles.select}
        name={props.name}
        id={`${props.name}-select`}
      >
        {props.options.map((o) => (
          <option value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
};

export default SimpleSelect;
