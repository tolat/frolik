import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/EditProfileModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useReducer, useRef, useState } from "react";
import { dataActions } from "../../store/data-slice";
import { uploadProfileData } from "../../utils/data-fetch";
import CustomSelect from "../UI/CustomSelect";
import balloonIcon from "../../images/balloon1.png";
import ProfileEditor from "./ProfileEditor";

const stagedDataReducer = (state, action) => {
  return action.type === "reset"
    ? {}
    : { ...state, [`${action.type}`]: action.value };
};

const EditProfileModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const modalState = useSelector((state) => state.modal);
  const dataState = useSelector((state) => state.data);
  const dispatch = useDispatch();
  const modalDisplay = modalState.selector === "edit-profile" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };
  const userData = dataState.users[user._id];
  const globals = useSelector((state) => state.auth.globals);
  const statusMap = globals?.statusMap;

  const [stagedData, dispatchStageData] = useReducer(stagedDataReducer, {});
  const [buttonText, setButtonText] = useState("Save");
  const [editingPhoto, setEditingPhoto] = useState(false);
  const buttonTextOnSubmit = "Saving..";
  const stagedCrop = stagedData.crop;
  const stagedZoom = stagedData.zoom;
  const stagedImage = stagedData.image;
  const defaultCrop = userData.crop;
  const defaultZoom = userData.zoom;
  const defaultImage = userData.profile_picture


  const formRefs = {
    first_name: useRef(),
    last_name: useRef(),
    tagline: useRef(),
    status: useRef(),
    location: useRef(),
  };

  const defaultValues = {
    location: user.location,
    first_name: user.first_name,
    last_name: user.last_name,
    tagline: user.tagline,
  };

  const resetData = () => {
    dispatchStageData({ type: "reset" });
    setButtonText("Save");
  };

  const onSubmit = (data) => {
    dispatch(dataActions.updateUserPhotoData({userID: user._id, data}));
    const fullData = { ...data, status: formRefs.status.current.innerHTML };
    uploadProfileData(user._id, fullData, resetData);
  };

  const statusOptions = Object.keys(statusMap).map((key) => {
    const selectable = key === "Ready" || key === "Busy";
    return {
      selectable,
      name: key,
      component: (
        <StatusOption
          unselectable={!selectable}
          name={key}
          details={statusMap[key]}
        />
      ),
    };
  });

  return (
    <ModalPortal>
      <div style={modalStyle} className={`${styles.container} noscroll`}>
        <ProfileEditor
          stagedData={stagedData}
          dispatchStageData={dispatchStageData}
          buttonText={buttonText}
          setButtonText={setButtonText}
          buttonTextOnSubmit={buttonTextOnSubmit}
          stagedCrop={stagedCrop}
          stagedZoom={stagedZoom}
          stagedimage={stagedImage}
          defaultCrop={defaultCrop}
          defaultZoom={defaultZoom}
          defaultImage={defaultImage}
          editingPhoto={editingPhoto}
          setEditingPhoto={setEditingPhoto}
          formRefs={formRefs}
          onSubmit={onSubmit}
          allowCrop={true}
          defaultValues={defaultValues}
        >
          <CustomSelect
            options={statusOptions}
            name={"Status"}
            label={"Status:"}
            ref={formRefs.status}
            defaultVal={user?.status?.status}
            className={styles.statusSelect}
            setDataChanged={(value) => {
              dispatchStageData({ type: "status", value });
            }}
          />
        </ProfileEditor>
      </div>
    </ModalPortal>
  );
};

const StatusOption = (props) => {
  const details =
    props.name !== "Searching" ? (
      props.details
    ) : (
      <div>
        Your status is set to Searching when you are on the{" "}
        <img style={{ height: "2rem" }} src={balloonIcon} alt={"balloonIcon"} />{" "}
        page.
      </div>
    );
  return (
    <div
      className={`${styles.statusOptionContainer} ${
        props.unselectable ? styles.unselectable : null
      }`}
    >
      <div className={styles.statusName}>{props.name}</div>
      <div className={styles.statusDetails}>{details}</div>
    </div>
  );
};

export default EditProfileModal;
