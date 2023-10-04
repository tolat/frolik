import img1 from "../images/sampleUserImgs/acroyoga.png";
import img2 from "../images/sampleUserImgs/beerpong.png";
import img3 from "../images/sampleUserImgs/drawing.png";
import img4 from "../images/sampleUserImgs/football.png";
import img5 from "../images/sampleUserImgs/kayaking.png";
import img6 from "../images/sampleUserImgs/lawngame.png";
import img7 from "../images/sampleUserImgs/icecream.png";
import img8 from "../images/sampleUserImgs/tenniscourt.png";
import img9 from "../images/sampleUserImgs/beach.png";
import janePic from "../images/profilePic.png";

const photos = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

export const EdwardUser = {
  first_name: "Edward",
  last_name: "Daniels",
  username: "edward@gmail.com",
  tagline: "Something wicked this way cometh",
  status: "inactive",
  profile_picture: "",
  photos: [],
  friends: [],
};

export const MichaelUser = {
  first_name: "Michael",
  last_name: "Brown",
  username: "michael@gmail.com",
  tagline: "When I was a young boy, I played the silver ball",
  status: "inactive",
  profile_picture: "",
  photos: [],
  friends: [EdwardUser],
};


export const Activities = [
  {
    name: "Park Pong",
    description:
      "Casual or competitive, beer pong in the park is an all-time games favourite.",
    category: "Games",
    instructions: [
      {
        kind: "purchase",
        number: 1,
        title: "Get Beer",
        details: "Anything but IPA",
      },
      {
        kind: "communicate",
        number: 2,
        title: "Balls and Cups",
        details:
          "Organize bringing 2+ pingpong balls, and 12+ plastic party cups.",
      },
      {
        kind: "travel",
        number: 2,
        title: "Pick a Park",
        details: "Pick a spot and time to duke it out. Be there or be square.",
      },
    ],
    location: "Global",
    rating: 4.8,
    duration: 1,
    cost: 10,
    participants: 2,
  },
  {
    name: "Ice Cream Bang Bang",
    description: "Eat Ice cream once, shame on me. Eat ice cream twice..",
    category: "Food",
    instructions: [
      {
        kind: "communicate",
        number: 1,
        title: "Pick Your Poison",
        details:
          "Decide on two ice cream joints, a meeting time, and a meeting place.",
      },
      {
        kind: "purchase",
        number: 2,
        title: "First Scoop!",
        details: "Buy ice cream at first ice cream joint!",
      },
      {
        kind: "travel",
        number: 3,
        title: "Get Sugar High",
        details: "Make your way over to the second ice cream place.",
      },
      {
        kind: "purchase",
        number: 4,
        title: "Second Scoop",
        details: "Buy another ice cream at the second place! WOOOOO..",
      },
    ],
    location: "Global",
    rating: 4.8,
    duration: 1,
    cost: 10,
    participants: 2,
  },
  {
    name: "Portrait Swap",
    description: "Not everyone is an artist, but you are today.",
    category: "Art",
    instructions: [
      {
        kind: "communicate",
        number: 1,
        title: "Place, Pen, Paper",
        details:
          "Decide on a spot. Don't forget to bring a pen/bruch/pencil and paper!",
      },
      {
        kind: "travel",
        number: 2,
        title: "Doodle",
        details:
          "Take turns drawing a portrait of eachother. Exchange portraits as a gift! No judgement..",
      },
    ],
    location: "Global",
    rating: 4.8,
    duration: 1,
    cost: 0,
    participants: 2,
  },
];

export const JaneOutings = [
  {
    activity: Activities[0],
    date_created: new Date(),
    date_completed: new Date(),
    users: [EdwardUser],
    status: "Completed",
    chat: "",
  },
  {
    activity: Activities[1],
    date_created: new Date(),
    date_completed: new Date(),
    users: [MichaelUser],
    status: "Completed",
    chat: "",
  },
  {
    activity: Activities[2],
    date_created: new Date(),
    date_completed: new Date(),
    users: [EdwardUser, MichaelUser],
    status: "Completed",
    chat: "",
  },
];

export const categoryColorMap = {
  Games: "rgb(117, 204, 255)",
  Art: "rgb(186, 255, 169)",
  Sports: "rgb(255, 223, 141)",
  Food: "rgb(255, 194, 156)",
  Misc: "rgb(255, 158, 166)"
};

export const JaneUser = {
  first_name: "Jane",
  last_name: "Sullivan",
  username: "jane@gmail.com",
  tagline: "The early bird is way too motivated..",
  status: "inactive",
  profile_picture: janePic,
  photos: photos,
  friends: [EdwardUser, MichaelUser],
  outings: JaneOutings
};

