import Cropper from "react-easy-crop";
import styles from "./styles/CroppedImage.module.scss";

const CroppedImage = (props) => {
  return (
    <div
      style={props.style}
      className={`${styles.container} ${props.className}`}
      id={props.id}
    >
      {!props.image ? null : (
        <Cropper
          image={`data:image/png;base64,${props.image}`}
          crop={props.crop}
          zoom={props.zoom}
          rotation={0}
          aspect={3 / 3}
          cropShape={"round"}
          onCropChange={() => {}}
          onZoomChange={() => {}}
          objectFit={"cover"}
          showGrid={false}
          style={{
            containerStyle: {
              width: "100%",
              height: "100%",
              borderRadius: "100rem",
            },
          }}
        />
      )}
    </div>
  );
};

export default CroppedImage;
