// The in-app tour. Each step can switch page (`route`) and spotlight an
// element (`target`, a CSS selector). Steps without a target show centered.
const tourSteps = [
  {
    title: "Welcome to frolik 👋",
    body: "frolik helps you get out of the house and meet new people through real-life Outings. Let's start with how to plan an Outing — it takes about a minute.",
  },
  {
    route: "/outing",
    target: '[data-tour="outing-requirements"]',
    title: "Plan an Outing",
    body: "Every Outing needs two things: an activity, and at least one Daily Match — someone you haven't met yet. You get fresh matches every 24 hours, and you can invite friends too.",
  },
  {
    route: "/outing",
    target: '[data-tour="activities"] > :first-child',
    title: "Pick an activity",
    body: "Browse activities by category and tap Select. Once you've added a Daily Match, a Create Outing button appears. Invites go out and a group chat is created for the Outing.",
  },
  {
    route: "/outing",
    target: '[data-tour="activity-tools"]',
    title: "Filter or create",
    body: "Filter by cost, time, rating or group size, or show only completed, featured or community creations. Tap the blue + beside the categories to make a custom activity anyone in your city can use.",
  },
  {
    route: "/profile",
    target: '#profile-header [data-tour="stats"]',
    fitChildren: true,
    title: "Your stats",
    body: "❄️ is your flake rating: how often you've left Outings after joining, from 0 to 5. Lower is better, so stick with your plans! 🎈 counts the Outings you've completed.",
  },
  {
    route: "/profile",
    target: '#profile-header img[alt="settings"]',
    title: "Settings",
    body: "Edit your profile and set your status here. Set it to Ready to show up in other people's Daily Matches. You can replay this tour from here any time.",
  },
  {
    target: 'a[href="/alerts"]',
    title: "Alerts",
    body: "Outing invites, friend requests and updates land here. Accept an invite to join an Outing — you can have up to 5 pending Outings at a time.",
  },
  {
    target: 'a[href="/profile"]',
    title: "Finishing an Outing",
    body: "After an Outing, open it from your Profile to upload photos and mark it complete with a rating. Once it's complete, you can add the people you went with as friends. Leaving an Outing you've joined counts as a flake.",
  },
  {
    target: 'a[href="/social"]',
    title: "Social",
    body: "See your friends' completed Outings and like their photos.",
  },
  {
    route: "/chat",
    target: '[data-tour="new-chat"]',
    title: "Chats",
    body: "Every Outing gets its own group chat. Tap + to start a chat with friends.",
  },
  {
    finishRoute: "/outing",
    title: "You're all set! 🎈",
    body: "Replay this tour any time from Settings — the ⚙️ on your Profile.",
  },
];

export default tourSteps;
