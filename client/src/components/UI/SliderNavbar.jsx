import styles from "./styles/SliderNavbar.module.scss";

const SliderNavber = (props) => {

  const handleIconClick = ( key) => {
    props.setSelected(key);
  };

  return (
    <div className={styles.container}>
      {props.icons.map((i) => (
        <div
          key={i.key}
          onClick={() => handleIconClick(i.key)}
          className={`${styles.sliderIconContainer} ${
            i.key === props.selected ? styles.selectedSlider : ""
          }`}
        >
          <div
            className={styles.sliderIcon}
            style={{ backgroundImage: `url('${i.url}')` }}
          ></div>
          <div className={styles.sliderHighlight}></div>
        </div>
      ))}
    </div>
  );
};

export default SliderNavber;
