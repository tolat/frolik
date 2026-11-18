import {
  ACTIVITY_NAME_MAX,
  ACTIVITY_DESCRIPTION_MAX,
  INSTRUCTION_TITLE_MAX,
} from "./limits";
import { isConfirmedLocation } from "./location";
import { t } from "../i18n";

// Messages are getters so they read in the current language when shown

const isNotEmpty = (value) => {
  return value && value !== "";
};

export const createProfileValidators = (defaultImage) => {
  return {
    "create-email": [
      {
        isValid(value) {
          return value && value !== "" && value.includes("@");
        },
        get message() {
          return t("validation.email");
        },
      },
    ],
    "create-password": [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.password");
        },
      },
      {
        isValid(value) {
          const specialChars = "0123456789!@#$%^&*".split("");
          return specialChars
            .map((char) => value.includes(char))
            .find((val) => val);
        },
        get message() {
          return t("validation.passwordSpecialChar");
        },
      },
    ],
    location: [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.location");
        },
      },
      {
        isValid(value) {
          return isConfirmedLocation(value);
        },
        get message() {
          return t("validation.locationConfirm");
        },
      },
    ],
    first_name: [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.firstName");
        },
      },
    ],
    tagline: [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.tagline");
        },
      },
      {
        isValid(value) {
          return value.length < 50;
        },
        get message() {
          return t("validation.taglineMax", { max: 50 });
        },
      },
    ],
    profile_picture: [
      {
        isValid(value) {
          return value && value !== defaultImage;
        },
        get message() {
          return t("validation.profilePicture");
        },
      },
    ],
  };
};

export const editProfileValidators = () => {
  return {
    status: [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.status");
        },
      },
    ],
    location: [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.location");
        },
      },
      {
        isValid(value) {
          return isConfirmedLocation(value);
        },
        get message() {
          return t("validation.locationConfirm");
        },
      },
    ],
    first_name: [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.firstName");
        },
      },
    ],
    tagline: [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.tagline");
        },
      },
      {
        isValid(value) {
          return value.length < 50;
        },
        get message() {
          return t("validation.taglineMax", { max: 50 });
        },
      },
    ],
  };
};

export const createActivityValidators = (instructions) => {
  let validators = {
    "create-activity-name": [
      {
        isValid(value) {
          return isNotEmpty(value);
        },
        get message() {
          return t("validation.activityName");
        },
      },
      {
        isValid(value) {
          return String(value || "").trim().length <= ACTIVITY_NAME_MAX;
        },
        get message() {
          return t("validation.activityNameMax", { max: ACTIVITY_NAME_MAX });
        },
      },
    ],
    "create-activity-location": [
      {
        isValid(value) {
          return isNotEmpty(value);
        },
        get message() {
          return t("validation.location");
        },
      },
      {
        isValid(value) {
          return isConfirmedLocation(value);
        },
        get message() {
          return t("validation.locationConfirm");
        },
      },
    ],
    "create-activity-description": [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.description");
        },
      },
      {
        isValid(value) {
          return String(value || "").trim().length <= ACTIVITY_DESCRIPTION_MAX;
        },
        get message() {
          return t("validation.descriptionMax", { max: ACTIVITY_DESCRIPTION_MAX });
        },
      },
    ],
    "create-activity-category": [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.category");
        },
      },
    ],
    "create-activity-duration": [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.duration");
        },
      },
    ],
    "create-activity-cost": [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.cost");
        },
      },
    ],
    "create-activity-participants": [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.participants");
        },
        position: "right"
      },
      
    ],
    "create-activity-goal": [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.goal");
        },
      },
    ],
  };

  instructions.forEach((i) => {
    validators[`${i.instructionID}-kind`] = [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.instructionType");
        },
      },
    ];

    validators[`${i.instructionID}-title`] = [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.instructionTitle");
        },
      },
      {
        isValid(value) {
          return String(value || "").trim().length <= INSTRUCTION_TITLE_MAX;
        },
        get message() {
          return t("validation.instructionTitleMax", { max: INSTRUCTION_TITLE_MAX });
        },
      },
    ];

    validators[`${i.instructionID}-details`] = [
      {
        isValid(value) {
          return value && value !== "";
        },
        get message() {
          return t("validation.instructionDetails");
        },
      },
    ];
  });

  return validators;
};
