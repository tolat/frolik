module.exports.activitySeeds = [
  {
    name: "Park Pong",
    description:
      "Casual or competitive, beer pong in the park is an all-time games favourite.",
    category: "Games",
    goal: "Beat the other team in Beer Pong.",
    featured: true,
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
    name: "Twice Cream",
    description: "Eat Ice cream once, shame on me. Eat ice cream twice..",
    category: "Food",
    goal: "Eat Ice Cream at two different locations, one after the other.",
    featured: true,
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
    goal: "Draw portraits of eachother.",
    featured: true,
    instructions: [
      {
        kind: "communicate",
        number: 1,
        title: "Place, Pen, Paper",
        details:
          "Decide on a spot. Don't forget to bring a pen/brush/pencil and paper!",
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
  {
    name: "Paparazzi Battle",
    description: "May the sneakiest team win!",
    category: "Games",
    goal: "Post a photo of the other team bofore they one of you.",
    featured: false,
    instructions: [
      {
        kind: "communicate",
        number: 1,
        title: "Pick a Park",
        details:
          "Pick a local Park where the game will take place. Pick somewhere with some natural obstacles or places to hide. Agree upon a bright shirt colour for eveyone to wear so you can spot eachother.",
      },
      {
        kind: "travel",
        number: 2,
        title: "Don't be too late!",
        details:
          "Head to the park at an agreed upon time. Don't forget to wear the agreed upon clothing!",
      },
      {
        kind: "capture",
        number: 3,
        title: "Got em!",
        details:
          "The first team to take a picture of the other team and post it wins. The other team has to confirm is was the in the picture!",
      },
    ],
    location: "Toronto",
    rating: 4.4,
    duration: 2,
    cost: 0,
    participants: 4,
  },
  
];
