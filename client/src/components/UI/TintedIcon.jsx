// An icon painted in the primary colour (index.css --primary) through the
// PNG's shape, so re-theming the app needs no new coloured PNGs. Size it with
// the className like an <img> (height; width follows, square icons).
const TintedIcon = ({ src, className = "", style, color = "var(--primary)" }) => (
  <span
    aria-hidden="true"
    className={className}
    style={{
      display: "inline-block",
      aspectRatio: "1",
      backgroundColor: color,
      WebkitMaskImage: `url(${src})`,
      maskImage: `url(${src})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      ...style,
    }}
  />
);

export default TintedIcon;
