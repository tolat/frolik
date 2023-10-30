import styles from "./styles/ValidatorBubble.module.scss";

const ValidatorBubble = (props) => {
  const targetElement = document.getElementById(props.elementID);
  const coordinates = getElementCoordinates(targetElement);
  const containerStyle = {
    display: props.display,
    top: coordinates.y || 0,
    left: coordinates.x || 0,
  };

  function getElementCoordinates(element) {
    const rect = element?.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;

    const x = rect?.left + window.scrollX;
    const y = rect?.top + scrollY;

    return { x, y };
  }

  return (
    <div style={containerStyle} className={styles.container}>
      <div className={styles.arrow}></div>
      <div className={styles.exclamation}>!</div>
      <div className={styles.message}>{props.message}</div>
    </div>
  );
};

// Takes a validator object containing an isValid method and a
// validation message and returns the validation message if
// value is invalid, otherwise returns false
export const runValidators = (
  validators,
  dataMap,
  setMessage,
  setDisplay,
  setID,
) => {
  // Set validator display to none initially
  setDisplay("none");

  if (validators) {
    // Run validators and set message and display if value fails
    for (let id in validators) {
      for (let validator of validators[id]) {
        if (!validator.isValid(dataMap[id])) {
          setMessage(validator.message);
          setDisplay("flex");
          setID(id);
          return false;
        }
      }
    }
  }

  return true;
};

export default ValidatorBubble;
