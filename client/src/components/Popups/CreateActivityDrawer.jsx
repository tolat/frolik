import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useScrollLock } from "../../utils/scrollLock";
import { scrollToElement } from "../../utils/scrollTo";
import drawerStyles from "./styles/ActivityDrawer.module.scss";
import styles from "./styles/CreateActivityDrawer.module.scss";
import SimpleInput from "../UI/SimpleInput";
import LocationAutocomplete from "../UI/LocationAutocomplete";
import CustomSelect from "../UI/CustomSelect";
import InstructionCard from "../UI/InstructionCard";
import LoaderSpinner from "../UI/LoaderSpinner";
import { fileToResizedDataURL } from "../../utils/imageResize";
import { createActivityValidators } from "../../utils/validators";
import { genRandomChars } from "../../utils/utils";
import { createActivity } from "../../utils/data-fetch";
import { goActions } from "../../store/go-slice";
import {
  ACTIVITY_NAME_MAX,
  ACTIVITY_DESCRIPTION_MAX,
} from "../../utils/limits";
import timeIcon from "../../images/clock.png";
import costIcon from "../../images/bill.png";
import groupIcon from "../../images/friends.png";
import { useT } from "../../i18n";
import { primaryShades } from "../../utils/theme";

const CLOSE_MS = 280; // a little longer than the 0.24s slide-down
const START_POSITION = { x: 50, y: 0 }; // cover shows its top, like the cards
const clamp = (v) => Math.min(100, Math.max(0, v));

// Create Activity: a drawer laid out like the activity drawer (cover on top,
// the details underneath, the button pinned to the bottom), every part
// editable. The cover pane shows the photo exactly as the cards will, and
// the photo can be dragged to choose which part shows (saved as
// cover_position, a CSS object-position).
const CreateActivityDrawer = ({ open: isOpen, onClose, addActivity, defaultCategory }) => {
  const { t } = useT();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const globals = useSelector((state) => state.auth.globals);
  const categoryColorMap = globals?.categoryColorMap;
  const instructionTypes = globals?.instructionTypes;
  useScrollLock(!!isOpen);
  const sheetRef = useRef(null);
  const scrollRef = useRef(null);

  // ── Form state ────────────────────────────────────────────────────────────
  const firstCategory = categoryColorMap ? Object.keys(categoryColorMap)[0] : "";
  const [category, setCategory] = useState(defaultCategory || firstCategory);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState("");
  const [participants, setParticipants] = useState("");
  const [goal, setGoal] = useState("");
  const [instructions, setInstructions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null); // { id, message }
  // Remount the inputs (they keep their own value) after a reset
  const [formKey, setFormKey] = useState(0);

  // New drawer: start on the category tab the user is looking at
  useEffect(() => {
    if (isOpen && defaultCategory) setCategory(defaultCategory);
  }, [isOpen, defaultCategory]);

  // ── Cover photo + its position ───────────────────────────────────────────
  const [cover, setCover] = useState(null); // JPEG data URL, already shrunk
  const [coverError, setCoverError] = useState(false);
  const [position, setPosition] = useState(START_POSITION);
  const [dragging, setDragging] = useState(false);
  const coverInputRef = useRef(null);
  const paneRef = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);

  const onCoverPicked = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again
    if (!file) return;
    try {
      setCoverError(false);
      setCover(await fileToResizedDataURL(file));
      setPosition(START_POSITION);
    } catch {
      setCoverError(true);
    }
  };

  // How far the photo overflows the pane on each axis (object-fit: cover)
  const overflow = () => {
    const pane = paneRef.current;
    const img = imgRef.current;
    if (!pane || !img?.naturalWidth) return { x: 0, y: 0 };
    const pw = pane.clientWidth;
    const ph = pane.clientHeight;
    const scale = Math.max(pw / img.naturalWidth, ph / img.naturalHeight);
    return {
      x: img.naturalWidth * scale - pw,
      y: img.naturalHeight * scale - ph,
    };
  };

  const onPaneDown = (e) => {
    if (!cover || e.target.closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, start: position, over: overflow() };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
  };
  const onPaneMove = (e) => {
    const d = drag.current;
    if (!d) return;
    // Moving the finger right shows more of the left of the photo
    const nx = d.over.x > 1 ? clamp(d.start.x - ((e.clientX - d.x) / d.over.x) * 100) : d.start.x;
    const ny = d.over.y > 1 ? clamp(d.start.y - ((e.clientY - d.y) / d.over.y) * 100) : d.start.y;
    setPosition({ x: nx, y: ny });
  };
  const onPaneUp = () => {
    drag.current = null;
    setDragging(false);
  };
  const coverPosition = `${Math.round(position.x)}% ${Math.round(position.y)}%`;

  // ── Instructions ─────────────────────────────────────────────────────────
  const onAddInstruction = (e) => {
    e.preventDefault();
    const instructionID = `instruction-${genRandomChars(12)}`;
    const setData = (key, data) =>
      setInstructions((prev) =>
        prev.map((inst) =>
          inst.instructionID === instructionID ? { ...inst, [key]: data } : inst
        )
      );
    const deleteInstruction = (id) =>
      setInstructions((prev) => prev.filter((inst) => inst.instructionID !== id));
    setInstructions((prev) => [
      ...prev,
      {
        kind: (instructionTypes?.[0] || "communicate").toLowerCase(),
        instructionID,
        title: "",
        details: "",
        setData,
        deleteInstruction,
      },
    ]);
  };

  // ── Open / close (same motion as the activity drawer) ────────────────────
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isOpen) {
      if (sheetRef.current) {
        sheetRef.current.style.transform = "";
        sheetRef.current.style.transition = "";
      }
      setShown(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setOpen(true))
      );
      return () => cancelAnimationFrame(raf);
    }
    setOpen(false);
    const timer = setTimeout(() => setShown(false), CLOSE_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleDrag = useRef(null);
  const onHandleDown = (e) => {
    handleDrag.current = { y: e.clientY, dy: 0, raf: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    sheetRef.current?.setAttribute("data-dragging", "true");
  };
  const onHandleMove = (e) => {
    const d = handleDrag.current;
    if (!d || !sheetRef.current) return;
    d.dy = Math.max(0, e.clientY - d.y);
    if (d.raf) return;
    d.raf = requestAnimationFrame(() => {
      d.raf = 0;
      if (sheetRef.current)
        sheetRef.current.style.transform = `translate3d(0, ${d.dy}px, 0)`;
    });
  };
  const onHandleUp = () => {
    if (!handleDrag.current || !sheetRef.current) return;
    const { dy, raf } = handleDrag.current;
    if (raf) cancelAnimationFrame(raf);
    handleDrag.current = null;
    sheetRef.current.removeAttribute("data-dragging");
    sheetRef.current.style.transition = "";
    if (dy > 80) {
      sheetRef.current.style.transform = "translateY(100%)";
      onClose();
    } else {
      sheetRef.current.style.transform = "";
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setInstructions([]);
    setName("");
    setDescription("");
    setLocation("");
    setGoal("");
    setDuration("");
    setCost("");
    setParticipants("");
    setCover(null);
    setPosition(START_POSITION);
    setError(null);
    setFormKey((k) => k + 1);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const showError = (id, message) => {
    setError({ id, message });
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) scrollToElement(el, { block: "center" });
    }, 50);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (saving) return;
    const activity = {
      name,
      description,
      location,
      goal,
      duration,
      cost,
      participants,
      category,
      cover_position: cover ? coverPosition : undefined,
      instructions: [],
    };
    const idMap = {
      "create-activity-name": name,
      "create-activity-description": description,
      "create-activity-location": location,
      "create-activity-goal": goal,
      "create-activity-duration": duration,
      "create-activity-cost": cost,
      "create-activity-participants": participants,
      "create-activity-category": category,
    };
    instructions.forEach((inst, i) => {
      const id = inst.instructionID;
      const kind = (inst.kind || "communicate").toLowerCase();
      const title = document.querySelector(`#${id}-title input`)?.value || "";
      const details = document.querySelector(`#${id}-details`)?.value || "";
      activity.instructions.push({ kind, title, number: i, details });
      idMap[`${id}-kind`] = kind;
      idMap[`${id}-title`] = title;
      idMap[`${id}-details`] = details;
    });

    // The shared validators; the first failure shows under its field
    const validators = createActivityValidators(instructions);
    for (const id in validators) {
      const failed = validators[id].find((v) => !v.isValid(idMap[id]));
      if (failed) {
        showError(id, failed.message);
        return;
      }
    }
    setError(null);

    setSaving(true);
    createActivity(
      user,
      activity,
      (response) => {
        setSaving(false);
        if (!response?.activity) return; // the server's message pops up
        dispatch(goActions.setActivity(response.activity));
        addActivity?.(response.activity);
        onClose();
        setTimeout(resetForm, CLOSE_MS);
      },
      cover || undefined
    );
  };

  if ((!shown && !isOpen) || !categoryColorMap) return null;

  const categoryOptions = Object.keys(categoryColorMap).map((key) => ({
    selectable: true,
    name: key,
  }));
  const fieldError = (id) =>
    error?.id === id ? <div className={styles.fieldError}>{error.message}</div> : null;

  return createPortal(
    <div
      className={`${drawerStyles.root} ${open ? drawerStyles.open : ""}`}
      data-instant="true"
    >
      <div className={drawerStyles.backdrop} onClick={onClose} />
      <div
        ref={sheetRef}
        className={`${drawerStyles.sheet} ${styles.sheet}`}
        // The drawer takes the chosen category's colour (button, cover pane,
        // highlights): the app's primary colour variables, scoped to it
        style={primaryShades(categoryColorMap[category]) || undefined}
        data-drawer-sheet="true"
        role="dialog"
        aria-modal="true"
        aria-label={t("createActivity.header")}
      >
        <div
          className={drawerStyles.handleArea}
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
        >
          <div className={drawerStyles.handle} />
        </div>
        <form
          ref={scrollRef}
          key={formKey}
          id="create-activity-form"
          className={`${drawerStyles.scrollArea} ${styles.form}`}
          onSubmit={onSubmit}
        >
          {/* Cover pane: same shape as the cards; drag the photo to place it */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={onCoverPicked}
            style={{ display: "none" }}
          />
          <div
            ref={paneRef}
            className={`${styles.coverPane} ${cover ? styles.hasCover : ""} ${
              dragging ? styles.dragging : ""
            }`}
            onPointerDown={onPaneDown}
            onPointerMove={onPaneMove}
            onPointerUp={onPaneUp}
            onPointerCancel={onPaneUp}
          >
            {cover ? (
              <>
                <img
                  ref={imgRef}
                  src={cover}
                  alt={t("createActivity.cover.alt")}
                  draggable={false}
                  style={{ objectPosition: coverPosition }}
                />
                <span className={styles.dragHint}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" />
                  </svg>
                  {t("createActivity.cover.drag")}
                </span>
                <div className={styles.coverActions}>
                  <button type="button" onClick={() => coverInputRef.current?.click()}>
                    {t("createActivity.cover.change")}
                  </button>
                  <button type="button" onClick={() => setCover(null)}>
                    {t("createActivity.cover.remove")}
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className={styles.coverPicker}
                onClick={() => coverInputRef.current?.click()}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <circle cx="9" cy="10" r="1.8" />
                  <path d="M21 16l-5-5-8 8" />
                </svg>
                <span className={styles.coverPickerText}>
                  {t("createActivity.cover.add")}
                  <span>{t("createActivity.cover.optional")}</span>
                </span>
              </button>
            )}
          </div>
          {coverError ? (
            <div className={styles.coverError}>{t("createActivity.cover.readError")}</div>
          ) : null}

          <div className={styles.body}>
            <div className={styles.title}>{t("createActivity.header")}</div>
            <CustomSelect
              id="create-activity-category"
              className={styles.category}
              options={categoryOptions}
              defaultVal={category}
              setDataChanged={setCategory}
            />
            <SimpleInput
              id="create-activity-name"
              className={styles.field}
              defaultVal={name}
              placeholder={t("createActivity.placeholders.name", { max: ACTIVITY_NAME_MAX })}
              maxLength={ACTIVITY_NAME_MAX}
              suffix={name ? `${name.length}/${ACTIVITY_NAME_MAX}` : null}
              setDataChanged={setName}
            />
            {fieldError("create-activity-name")}
            <LocationAutocomplete
              id="create-activity-location"
              name="Activity Location"
              className={styles.field}
              defaultVal={location}
              placeholder={t("createActivity.placeholders.city")}
              setDataChanged={setLocation}
            />
            {fieldError("create-activity-location")}
            <SimpleInput
              id="create-activity-description"
              className={styles.field}
              defaultVal={description}
              placeholder={t("createActivity.placeholders.description", {
                max: ACTIVITY_DESCRIPTION_MAX,
              })}
              maxLength={ACTIVITY_DESCRIPTION_MAX}
              suffix={description ? `${description.length}/${ACTIVITY_DESCRIPTION_MAX}` : null}
              setDataChanged={setDescription}
            />
            {fieldError("create-activity-description")}

            {/* Time / cost / group, like the chips on the cards */}
            <div className={styles.stats}>
              <SimpleInput
                id="create-activity-duration"
                className={styles.stat}
                inputStyle={{ paddingInlineStart: "3.4rem" }}
                prefix={<img src={timeIcon} alt="" />}
                type="number"
                inputMode="decimal"
                defaultVal={duration}
                placeholder={t("createActivity.placeholders.hours")}
                setDataChanged={setDuration}
              />
              <SimpleInput
                id="create-activity-cost"
                className={styles.stat}
                inputStyle={{ paddingInlineStart: "3.4rem" }}
                prefix={<img src={costIcon} alt="" />}
                type="number"
                inputMode="decimal"
                defaultVal={cost}
                placeholder={t("createActivity.placeholders.cost")}
                setDataChanged={setCost}
              />
              <SimpleInput
                id="create-activity-participants"
                className={styles.stat}
                inputStyle={{ paddingInlineStart: "3.4rem" }}
                prefix={<img src={groupIcon} alt="" />}
                type="number"
                inputMode="numeric"
                defaultVal={participants}
                placeholder={t("createActivity.placeholders.people")}
                setDataChanged={setParticipants}
              />
            </div>
            {fieldError("create-activity-duration")}
            {fieldError("create-activity-cost")}
            {fieldError("create-activity-participants")}

            {/* Goal, in the same soft panel the activity drawer shows it in */}
            <div className={styles.goalPanel}>
              <div className={styles.label}>{t("activity.goalHeader")}</div>
              <SimpleInput
                id="create-activity-goal"
                className={styles.goalInput}
                defaultVal={goal}
                placeholder={t("createActivity.placeholders.goal")}
                setDataChanged={setGoal}
              />
            </div>
            {fieldError("create-activity-goal")}

            <div className={styles.label}>{t("activity.instructionsHeader")}</div>
            {instructions.map((inst) => (
              <div key={inst.instructionID}>
                <InstructionCard creatingActivity instruction={inst} />
                {fieldError(`${inst.instructionID}-title`)}
                {fieldError(`${inst.instructionID}-details`)}
                {fieldError(`${inst.instructionID}-kind`)}
              </div>
            ))}
            {fieldError("instructions")}
            <button type="button" className={styles.addInstruction} onClick={onAddInstruction}>
              {t("activity.addInstruction")}
            </button>
          </div>

          {/* Pinned to the bottom of the drawer */}
          <div className={styles.bottomBar}>
            {error && !document.getElementById(error.id) ? (
              <div className={styles.fieldError}>{error.message}</div>
            ) : null}
            <button type="submit" className={styles.createButton} disabled={saving}>
              {saving ? (
                <>
                  {t("createActivity.saving")}
                  <LoaderSpinner width="1.5rem" height="1.5rem" />
                </>
              ) : (
                t("createActivity.create")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("popup")
  );
};

export default CreateActivityDrawer;
