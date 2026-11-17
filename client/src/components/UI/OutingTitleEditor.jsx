import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/OutingTitleEditor.module.scss";
import { renameOuting } from "../../utils/data-fetch";
import { modalActions } from "../../store/modal-slice";
import { OUTING_NAME_MAX } from "../../utils/limits";

// "Outing: <name>" in the outing panel header, with a pencil to rename it
// in place (members only). Enter saves, Escape cancels.
const OutingTitleEditor = ({ outing, canEdit, className }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(outing?.name || "");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  // Opening another outing (or a rename from someone else) resets the field
  useEffect(() => {
    setEditing(false);
    setValue(outing?.name || "");
  }, [outing?._id, outing?.name]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const trimmed = value.trim();
  const canSave = !saving && trimmed && trimmed !== outing?.name;

  const save = () => {
    if (!canSave) {
      if (trimmed === outing?.name || !trimmed) cancel();
      return;
    }
    setSaving(true);
    renameOuting(user, outing._id, trimmed, (updated) => {
      setSaving(false);
      if (updated) {
        dispatch(modalActions.setActiveOuting(updated));
        setEditing(false);
      }
    });
  };

  const cancel = () => {
    setValue(outing?.name || "");
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className={`${styles.row} ${className || ""}`}>
        <span className={styles.name}>{outing?.name}</span>
        {canEdit ? (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setEditing(true)}
            aria-label="Rename outing"
            title="Rename outing"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4z" />
              <path d="M13.5 6.5l4 4" />
            </svg>
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className={`${styles.row} ${className || ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className={styles.field}>
        <input
          ref={inputRef}
          className={styles.input}
          value={value}
          maxLength={OUTING_NAME_MAX}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && cancel()}
          aria-label="Outing name"
          disabled={saving}
        />
        <span className={styles.counter}>
          {value.length}/{OUTING_NAME_MAX}
        </span>
      </div>
      <button
        type="submit"
        className={`${styles.iconButton} ${styles.save}`}
        aria-label="Save name"
        disabled={!trimmed || saving}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </button>
      <button
        type="button"
        className={styles.iconButton}
        onClick={cancel}
        aria-label="Cancel rename"
        disabled={saving}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </form>
  );
};

export default OutingTitleEditor;
