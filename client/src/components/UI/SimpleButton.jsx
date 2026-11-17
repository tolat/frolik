import styles from "./styles/SimpleButton.module.scss";

const SimpleButton = (props) => {
  return (
    <button
      onBlur={props.onBlur}
      tabIndex={0}
      onChange={props.onChange}
      value={props.value}
      id={props.id}
      data-tour={props["data-tour"]}
      name={props.name}
      required={props.required}
      onClick={props.onClick}
      className={`${styles.container} ${props.className}`}
      style={{ borderRadius: props.square ? "0" : null, ...props.style }}
    >
      {props.children}
    </button>
  );
};

export default SimpleButton;
