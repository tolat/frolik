// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  console.log("\n\n1\n\n", process.env.NODE_ENV, "serviceWorker" in navigator);

  if (process.env.NODE_ENV !== "development" && "serviceWorker" in navigator) {
    console.log("\n\n1.1\n\n");
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      console.log("\n\n1.2\n\n");
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }
    console.log("\n\n1.3\n\n");
    const swUrl = `./public/service-worker.js`;

    if (isLocalhost) {
      console.log("\n\n1.4\n\n");
      // This is running on localhost. Let's check if a service worker still exists or not.
      checkValidServiceWorker(swUrl, config);

      // Add some additional logging to localhost, pointing developers to the
      // service worker/PWA documentation.
      navigator.serviceWorker.ready.then(() => {
        console.log(
          "This web app is being served cache-first by a service " +
            "worker. To learn more, visit https://cra.link/PWA"
        );
      });
    } else {
      console.log("\n\n1.5\n\n");
      // Is not localhost. Just register service worker
      registerValidSW(swUrl, config);
    }

    console.log("\n\nEND\n\n");
  }
}

function registerValidSW(swUrl, config) {
  console.log("\n\n2\n\n");

  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Subscribe to push notifications
      subscribeToPushNotifications(registration, config.user);
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Updated precached content has been fetched,
              // execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }

              // Subscribe to push notifications
              subscribeToPushNotifications(registration, config.user);
            } else {
              // Content is precached for offline use,
              // execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }

              // Subscribe to push notifications
              subscribeToPushNotifications(registration, config.user);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

// Function to subscribe to push notifications
function subscribeToPushNotifications(registration, user) {
  console.log("\n\n3\n\n");

  registration.pushManager.getSubscription().then((subscription) => {
    if (subscription === null) {
      // Make an HTTP request to fetch the VAPID key from the server
      fetch("/notifications/vapid-public-key")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch VAPID key");
          }
          return response.json();
        })
        .then((data) => {
          const vapidKey = data.key;
          // User is not subscribed, subscribe now
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: vapidKey,
            })
            .then((newSubscription) => {
              console.log(
                "Push notification subscription successful:",
                newSubscription
              );
              sendSubscriptionToServer(newSubscription, user);
            })
            .catch((error) => {
              console.error("Error subscribing to push notifications:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching VAPID key:", error);
        });
    }
  });
}

// Function to send the subscription to the server
function sendSubscriptionToServer(subscription, user) {
  console.log("\n\n4\n\n");

  fetch("/notifications/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscription, user }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send subscription to server");
      }
    })
    .catch((error) => {
      console.error("Error sending subscription to server:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
