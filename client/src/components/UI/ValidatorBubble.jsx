import styles from "./styles/ValidatorBubble.module.scss";

const ValidatorBubble = (props) => {
  const targetElement = document.getElementById(props.elementID);
  const coordinates = getElementCoordinates(targetElement);
  const display = props.display;
  const containerStyle = {
    display: display,
    top: coordinates.y || 0,
    left: coordinates.x || 0,
  };

  function getElementCoordinates(element) {
    const rect = element?.getBoundingClientRect();
    const modalRect = document
      .getElementById("modal-container")
      .getBoundingClientRect();

    function remToPixels(rem) {
      const baseFontSize = parseInt(
        getComputedStyle(document.documentElement).fontSize,
        10
      );
      return rem * baseFontSize;
    }

    const x = rect?.left - modalRect.left + window.scrollX + 50;
    const y = rect?.top - modalRect.top + window.scrollY + remToPixels(6.5);

    return { x, y };
  }

  const handleBlur = () => {
    console.log("blur validator bubble");
    props.setDisplay("none");
  };

  return (
    <div
      tabIndex={0}
      onBlur={handleBlur}
      id={props.id}
      style={containerStyle}
      className={styles.container}
    >
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
  bubbleID
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
          setTimeout(() => {
            document.getElementById(bubbleID).scrollIntoView({
              behavior: "smooth",
            });
          }, 100);

          return false;
        }
      }
    }
  }

  return true;
};

export default ValidatorBubble;
