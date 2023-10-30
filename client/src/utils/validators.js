export const createProfileValidators = (globals, defaultImage) => {
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
          return (
            !globals ||
            globals?.cityData.find(
              (city) => `${city.name}, ${city.country}` === value
            )
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
          return value.length < 30;
        },
        message: "Tagline must be less than 30 characters",
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

export const editProfileValidators = (globals) => {
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
          return (
            !globals ||
            globals?.cityData.find(
              (city) => `${city.name}, ${city.country}` === value
            )
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
          return value.length < 30;
        },
        message: "Tagline must be less than 30 characters",
      },
    ],
  };
};
