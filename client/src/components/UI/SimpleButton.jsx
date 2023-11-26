import styles from "./styles/SimpleButton.module.scss";

const SimpleButton = (props) => {
  const boxShadow =
    "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px";
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
