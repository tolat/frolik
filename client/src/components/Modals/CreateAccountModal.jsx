import styles from "./styles/CreateAccountModal.module.scss";
import ModalPortal from "./ModalPortal";
import { useEffect, useReducer, useRef, useState } from "react";
import {  useSelector } from "react-redux";
import ProfileEditor from "./ProfileEditor";
import placeholderPhoto from "../../images/placeholder-user-photo.png";
import SimpleInput from "../UI/SimpleInput";

const stagedDataReducer = (state, action) => {
  return { ...state, [`${action.type}`]: action.value };
};

const CreateAccountModal = (props) => {
  const modalState = useSelector((state) => state.modal);
  const modalDisplay =
    modalState.selector === "create-account" ? "flex" : "none";
  const modalStyle = { display: modalDisplay };

  const [stagedData, dispatchStageData] = useReducer(stagedDataReducer, {});
  const [buttonText, setButtonText] = useState("Create Profile");
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [defaultImage, setDefaultImage] = useState(false);
  const [allowCrop, setAllowCrop] = useState(false);
  const buttonTextOnSubmit = "Creating Profile..";
  const stagedCrop = stagedData.crop;
  const stagedZoom = stagedData.zoom;
  const stagedImage = stagedData.image;
  const defaultCrop = {x:0,y:0};
  const defaultZoom = 1;

  // Load placeholder image as base64 string
  useEffect(() => {
    const loadImageAsBase64 = async () => {
      try {
        const response = await fetch(placeholderPhoto);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          const trimmedString = base64String.slice(
            base64String.indexOf(",") + 1
          );
          setDefaultImage(trimmedString);
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImageAsBase64();
  }, []);

  const formRefs = {
    first_name: useRef(),
    last_name: useRef(),
    tagline: useRef(),
    status: useRef(),
    location: useRef(),
    usename: useRef(),
    password: useRef(),
  };

  const defaultValues = {
    location: "",
    first_name: "",
    last_name: "",
    tagline: "",
  };

  const onPhotoChange = (newImage) => {
    newImage !== defaultImage ? setAllowCrop(true) : setAllowCrop(false);
  };

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <ModalPortal>
      <div className={styles.container} style={modalStyle}>
        <ProfileEditor
          stagedData={stagedData}
          dispatchStageData={dispatchStageData}
          buttonText={buttonText}
          setButtonText={setButtonText}
          buttonTextOnSubmit={buttonTextOnSubmit}
          stagedCrop={stagedCrop}
          stagedZoom={stagedZoom}
          stagedimage={stagedImage}
          defaultCrop = {defaultCrop}
          defaultZoom = {defaultZoom}
          defaultImage={defaultImage}
          editingPhoto={editingPhoto}
          setEditingPhoto={setEditingPhoto}
          formRefs={formRefs}
          onSubmit={onSubmit}
          onPhotoChange={onPhotoChange}
          allowCrop={allowCrop}
          defaultValues={defaultValues}
        >
          <SimpleInput
            type="text"
            id="creat-email"
            name="email"
            label="Email (username):"
            ref={formRefs.username}
            defaultVal={""}
            className={styles.simpleInput}
            setDataChanged={(value) => {
              dispatchStageData({ type: "username", value });
            }}
          />
          <SimpleInput
            type="password"
            id="create-password"
            name="password"
            label="Password:"
            ref={formRefs.password}
            defaultVal={""}
            className={styles.simpleInput}
            setDataChanged={(value) => {
              dispatchStageData({ type: "password", value });
            }}
          />
        </ProfileEditor>
      </div>
    </ModalPortal>
  );
};

export default CreateAccountModal;
