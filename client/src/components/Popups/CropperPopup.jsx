import { useSelector } from "react-redux";
import SimpleButton from "../UI/SimpleButton";
import Popup from "./Popup";
import styles from "./styles/CropperPopup.module.scss";
import Cropper from "react-easy-crop";
import { useState } from "react";
import { getCroppedImageBase64 } from "../../utils/utils";
import LoaderSpinner from "../UI/LoaderSpinner";

const CropperPopup = (props) => {
  const popupState = useSelector((state) => state.popup);
  const showPopup = popupState.selector === props.selector;
  const popupDisplay = showPopup ? "flex" : "none";
  const [zoom1, setZoom1] = useState(props.defautlZoom || 1);
  const [crop1, setCrop1] = useState(props.defaultCrop || { x: 0, y: 0 });
  const [zoom2, setZoom2] = useState(1);
  const [crop2, setCrop2] = useState({ x: 0, y: 0 });
  const buttonLoader = (
    <div className={styles.loaderTextContainer}>
      Upload &nbsp; <LoaderSpinner width="1.5rem" height="1.5rem" />
    </div>
  );
  const [button1Text, setButton1Text] = useState(props.button1Text || "Upload");
  const [button2Text, setButton2Text] = useState("Upload");
  const [cropComplete1, setCropComplete1] = useState();
  const [cropComplete2, setCropComplete2] = useState();
  const cropCompletes = [cropComplete1, cropComplete2];
  const setCropCompletes = [setCropComplete1, setCropComplete2];
  const crops = [crop1, crop2];
  const setCrops = [setCrop1, setCrop2];
  const setZooms = [setZoom1, setZoom2];
  const zooms = [zoom1, zoom2];
  const buttonTexts = [button1Text, button2Text];
  const buttonSetters = [setButton1Text, setButton2Text];
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  const uploadingStates = [uploading1, uploading2];
  const uploadingStateSetters = [setUploading1, setUploading2];

  const onCrop1Change = (newCrop) => {
    setCrop1(newCrop);
  };

  const onZoom1Change = (newZoom) => {
    setZoom1(newZoom);
  };

  const onCrop2Change = (newCrop) => {
    setCrop2(newCrop);
  };

  const onZoom2Change = (newZoom) => {
    setZoom2(newZoom);
  };

  const cropChangers = [onCrop1Change, onCrop2Change];
  const zoomChangers = [onZoom1Change, onZoom2Change];

  const resetCropper = (index) => {
    setCrops[index]({ x: 0, y: 0 });
    setZooms[index](1);
    buttonSetters[index]("Upload");
    uploadingStateSetters[index](false);
  };

  const onUploadImage = async (img) => {
    const index = props.images.indexOf(img);
    if (uploadingStates[index]) {
      return;
    }

    uploadingStateSetters[index](true);
    buttonSetters[index](props.button1ActionText || buttonLoader);
    const croppedImage = await getCroppedImageBase64(
      img,
      cropCompletes[index].cap
    );

    props.onUpload(index, croppedImage, resetCropper);
  };

  return (
    <Popup style={{ display: popupDisplay }} showPopup={showPopup}>
      <div className={styles.outerContainer}>
        <div className={styles.cropperSpacer}>
          {" "}
          {props.images[0] ? null : "Loading.."}
        </div>
        {props.images &&
          props.images.map((img) => (
            <div
              key={`crop${props.images.indexOf(img)}`}
              onLoad={props.onLoad}
              id={props.id}
              className={styles.container}
            >
              <div className={styles.header}>
                Zoom & Crop{" "}
                <div className={styles.count}>
                  {props.images.length - props.images.indexOf(img)} /{" "}
                  {props.images.length}
                </div>
              </div>
              <div className={styles.cropperContainer}>
                {img && (
                  <Cropper
                    image={img}
                    crop={crops[props.images.indexOf(img)]}
                    zoom={zooms[props.images.indexOf(img)]}
                    rotation={0}
                    aspect={3 / 3}
                    cropShape={props.cropShape || "rect"}
                    onCropChange={cropChangers[props.images.indexOf(img)]}
                    onZoomChange={zoomChangers[props.images.indexOf(img)]}
                    objectFit={"cover"}
                    showGrid={true}
                    onCropComplete={(ca, cap) =>
                      setCropCompletes[props.images.indexOf(img)]({ ca, cap })
                    }
                    style={{
                      containerStyle: {
                        width: "100%",
                        height: "100%",
                        borderRadius: props.cropperRadius || "4px",
                      },
                    }}
                  />
                )}
              </div>
              <div className={styles.buttonsContainer}>
                <SimpleButton
                  noShadow={true}
                  onClick={(e) => onUploadImage(img)}
                  className={styles.saveButton}
                >
                  {buttonTexts[props.images.indexOf(img)]}
                </SimpleButton>
                <SimpleButton
                  noShadow={true}
                  onClick={() =>
                    props.onCancel(props.images.indexOf(img), resetCropper)
                  }
                  className={styles.cancelButton}
                >
                  Cancel
                </SimpleButton>
              </div>
            </div>
          ))}
      </div>
    </Popup>
  );
};

export default CropperPopup;
