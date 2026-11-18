// The in-app tour. Each step can switch page (`route`) and spotlight an
// element (`target`, a CSS selector). Steps without a target show centered.
// Copy lives in the i18n packs: tour.steps.<id>.title / .body
const tourSteps = [
  {
    id: "welcome",
  },
  {
    route: "/outing",
    target: '[data-tour="outing-requirements"]',
    id: "planOuting",
  },
  {
    route: "/outing",
    target: '[data-tour="activities"] > :first-child',
    id: "pickActivity",
  },
  {
    route: "/outing",
    target: '[data-tour="activity-tools"]',
    id: "filterOrCreate",
  },
  {
    route: "/profile",
    target: '#profile-header [data-tour="stats"]',
    fitChildren: true,
    id: "stats",
  },
  {
    route: "/profile",
    target: '#profile-header [data-tour="settings"]',
    id: "settings",
  },
  {
    target: 'a[href="/alerts"]',
    id: "alerts",
  },
  {
    target: 'a[href="/profile"]',
    id: "finishing",
  },
  {
    target: 'a[href="/social"]',
    id: "social",
  },
  {
    route: "/chat",
    target: '[data-tour="new-chat"]',
    id: "chats",
  },
  {
    finishRoute: "/outing",
    id: "allSet",
  },
];

export default tourSteps;
