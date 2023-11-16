import styles from "./styles/SimpleButton.module.scss";

const SimpleButton = (props) => {
  const boxShadow =
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px";
  return (
    <button
      onBlur={props.onBlur}
      tabIndex={0}
      onChange={props.onChange}
      value={props.value}
      id={props.id}
      name={props.name}
      required={props.required}
      onClick={props.onClick}
      className={`${styles.container} ${props.className}`}
      style={{ ...props.style, boxShadow: props.noShadow ? "none" : boxShadow }}
    >
      {props.children}
    </button>
  );
};

export default SimpleButton;
