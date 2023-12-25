import cityData from "../utils/cities100000";

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
        message: "Please enter a valid email",
      },
    ],
    "create-password": [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a valid password",
      },
      {
        isValid(value) {
          const specialChars = "0123456789!@#$%^&*".split("");
          return specialChars
            .map((char) => value.includes(char))
            .find((val) => val);
        },
        message: "Password must contain one number or special carachter",
      },
    ],
    location: [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a valid location",
      },
      {
        isValid(value) {
          return cityData.find(
            (city) => `${city.name}, ${city.country}` === value
          );
        },
        message: "Please choose a city from the dropdown menu only",
      },
    ],
    first_name: [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a First Name",
      },
    ],
    tagline: [
      {
        isValid(value) {
          return value && value !== "";
        },
        message:
          "Please enter a Tagline. Something short and fun, that anyone viewing your profile will see!",
      },
      {
        isValid(value) {
          return value.length < 50;
        },
        message: "Tagline must be less than 50 characters",
      },
    ],
    profile_picture: [
      {
        isValid(value) {
          return value && value !== defaultImage;
        },
        message: "Please upload a profile picture!",
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
        message: "Please enter a valid status",
      },
    ],
    location: [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a valid location",
      },
      {
        isValid(value) {
          return cityData.find(
            (city) => `${city.name}, ${city.country}` === value
          );
        },
        message: "Please choose a city from the dropdown menu only",
      },
    ],
    first_name: [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a First Name",
      },
    ],
    tagline: [
      {
        isValid(value) {
          return value && value !== "";
        },
        message:
          "Please enter a Tagline. Something short and fun, that anyone viewing your profile will see!",
      },
      {
        isValid(value) {
          return value.length < 50;
        },
        message: "Tagline must be less than 50 characters",
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
        message: "Please enter an activity name",
      },
    ],
    "create-activity-location": [
      {
        isValid(value) {
          return isNotEmpty(value);
        },
        message: "Please enter a valid location.",
      },
      {
        isValid(value) {
          return cityData.find(
            (city) => `${city.name}, ${city.country}` === value
          );
        },
        message: "Please choose a city from the dropdown menu only.",
      },
    ],
    "create-activity-description": [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a description.",
      },
    ],
    "create-activity-category": [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a category.",
      },
    ],
    "create-activity-duration": [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a duration (hrs).",
      },
    ],
    "create-activity-cost": [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a cost.",
      },
    ],
    "create-activity-participants": [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a number of participants.",
      },
    ],
    "create-activity-goal": [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter a decription.",
      },
    ],
  };

  instructions.forEach((i) => {
    validators[`${i.instructionID}-kind`] = [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter instruction type.",
      },
    ];

    validators[`${i.instructionID}-title`] = [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter instruction title.",
      },
    ];

    validators[`${i.instructionID}-details`] = [
      {
        isValid(value) {
          return value && value !== "";
        },
        message: "Please enter instruction details.",
      },
    ];
  });

  return validators;
};
