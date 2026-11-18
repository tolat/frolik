import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import Cropper from "react-easy-crop";
import BrandLoader from "../UI/BrandLoader";
import { getCroppedImageBase64 } from "../../utils/utils";
import { useScrollLock } from "../../utils/scrollLock";
import styles from "./styles/CropperPopup.module.scss";

const CLOSE_MS = 280; // a little longer than the 0.24s slide-down
const MAX_ZOOM = 3;

// Zoom & crop, as a bottom drawer (same look and motion as the activity
// drawer): the photo to crop, a zoom slider, and Cancel / Done pinned to the
// bottom. Handles up to two queued photos (outing uploads), one at a time.
//
// Props: images (data URLs; the last one is shown first), selector,
// onUpload(index, croppedImage, resetCropper), onCancel(index, resetCropper),
// button1Text / button1ActionText, defaultCrop, defaultZoom, cropShape.
const CropperPopup = (props) => {
  const isOpen = useSelector((state) => state.popup.selector === props.selector);
  useScrollLock(isOpen);

  const images = props.images || [];
  const index = images.length - 1; // the photo on top of the queue
  const img = images[index];

  const [crop, setCrop] = useState(props.defaultCrop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(props.defaultZoom || 1);
  const [cropArea, setCropArea] = useState(null);
  const [busy, setBusy] = useState(false);

  const resetCropper = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setBusy(false);
  };

  // A new photo on top of the queue starts uncropped
  useEffect(() => {
    resetCropper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]);

  // Stay mounted while sliding out; add "open" a frame after mounting so the
  // slide-in runs. Keep showing the last photo while it slides away.
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const lastImg = useRef(null);
  if (img) lastImg.current = img;
  useEffect(() => {
    if (isOpen) {
      setShown(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setOpen(true))
      );
      return () => cancelAnimationFrame(raf);
    }
    setOpen(false);
    const t = setTimeout(() => setShown(false), CLOSE_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  const onDone = async () => {
    if (busy || !img || !cropArea) return;
    setBusy(true);
    const cropped = await getCroppedImageBase64(img, cropArea);
    props.onUpload(index, cropped, resetCropper);
  };

  const onCancel = () => {
    if (busy) return;
    props.onCancel(Math.max(0, index), resetCropper);
  };

  if (!shown && !isOpen) return null;

  const actionLabel = props.button1Text || "Upload";
  const showImg = img || lastImg.current;

  return createPortal(
    <div
      className={`${styles.root} ${open ? styles.open : ""}`}
      data-instant="true"
    >
      <div className={styles.backdrop} onClick={onCancel} />
      <div className={styles.sheet} data-drawer-sheet="true" role="dialog" aria-modal="true" aria-label="Zoom and crop">
        <div className={styles.handleArea}>
          <div className={styles.handle} />
        </div>
        {/* No heading; just "1 / 2" when two photos are queued */}
        {images.length > 1 ? (
          <div className={styles.header}>
            <span className={styles.count}>
              {images.length - index} / {images.length}
            </span>
          </div>
        ) : null}

        <div className={styles.cropArea}>
          {showImg ? (
            <Cropper
              image={showImg}
              crop={crop}
              zoom={zoom}
              rotation={0}
              aspect={1}
              cropShape={props.cropShape || "rect"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              objectFit="cover"
              showGrid={props.cropShape !== "round"}
              maxZoom={MAX_ZOOM}
              onCropComplete={(area, areaPixels) => setCropArea(areaPixels)}
              style={{ containerStyle: { width: "100%", height: "100%" } }}
            />
          ) : (
            <div className={styles.loading}>
              <BrandLoader size={3.6} />
            </div>
          )}
        </div>

        <label className={styles.zoomRow}>
          <span className={styles.zoomIcon} aria-hidden="true">−</span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className={styles.zoomSlider}
            disabled={!img}
          />
          <span className={styles.zoomIcon} aria-hidden="true">+</span>
        </label>

        <div className={styles.buttonBar}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.doneButton}
            onClick={onDone}
            disabled={busy || !img}
          >
            {busy && actionLabel !== "Done" ? (
              <>
                <BrandLoader inline plain noBalloon size={1.4} />
                Uploading…
              </>
            ) : (
              actionLabel
            )}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default CropperPopup;
