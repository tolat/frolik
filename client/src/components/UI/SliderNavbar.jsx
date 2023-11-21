import styles from "./styles/SliderNavbar.module.scss";

const SliderNavber = (props) => {
  const handleIconClick = (key) => {
    props.setSelected(key);
  };

  return (
    <div className={styles.container}>
      {props.icons &&
        props.icons.map((i) => (
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
      {props.tabs &&
        props.tabs.map((t) => (
          <div
            key={t.key}
            onClick={() => handleIconClick(t.key)}
            className={`${styles.sliderIconContainer} ${
              t.key === props.selected ? styles.selectedSlider : ""
            }`}
          >
            {t.component}
            <div
              key={t.key}
              style={props.getHighlightStyle(t.key)}
              className={styles.sliderHighlight}
            ></div>
          </div>
        ))}
    </div>
  );
};

export default SliderNavber;
