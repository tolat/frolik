import { useState } from "react";
import Cropper from "react-easy-crop";
import styles from "./styles/ImageCropper.module.scss";

const ImageCropper = (props) => {
  const [zoom, setZoom] = useState(props.zoom);
  const [crop, setCrop] = useState(props.crop);

  const onCropChange = (newCrop) => {
    newCrop !== props.crop
      ? props.setCropChange(newCrop)
      : props.setCropChange(false);
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom) => {
    newZoom !== props.zoom
      ? props.setZoomChange(newZoom)
      : props.setZoomChange(false);
    setZoom(newZoom);
  };

  return !props.image ? null : (
    <div
      style={props.containerStyle}
      className={`${styles.container} ${props.containerClassName}`}
    >
      <Cropper
        image={`data:image/png;base64,${props.image}`}
        crop={crop}
        zoom={zoom}
        aspect={3 / 3}
        cropShape={"round"}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        objectFit={"cover"}
        style={{ containerStyle: { width: "100%", height: "100%" } }}
      />
    </div>
  );
};

export default ImageCropper;
