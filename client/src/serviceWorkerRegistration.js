// This optional code is used to register a service worker.
// register() is not called by default.

import { onUpdateUser } from "./store/socket-actions";
import { syncPush } from "./utils/push";

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
  if (process.env.NODE_ENV !== "development" && "serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }
    const swUrl = `/service-worker.js`;
    retireOldServiceWorker();

    if (isLocalhost) {
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
      // Is not localhost. Just register service worker
      registerValidSW(swUrl, config);
    }
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Subscribe to push notifications
      syncPush();
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
              syncPush();
            } else {
              // Content is precached for offline use,
              // execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }

              // Subscribe to push notifications
              syncPush();
            }
          }
        };
      };

      // add interval to check user updates cache
      const checkForUpdateFlag = () => {
        registration.active?.postMessage({
          action: "user-update-check",
        });
      };

      // Only start the poller / listener once per page load
      if (window.__frolikSWPolling) return;
      window.__frolikSWPolling = true;
      window.setInterval(checkForUpdateFlag, 2000);

      // Handle messages from the service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        // Notification tapped while the app was open: go to its page
        if (event.data?.action === "navigate" && event.data.url) {
          window.dispatchEvent(
            new CustomEvent("frolik:navigate", { detail: event.data.url })
          );
          return;
        }
        if (event.data.action === "frolik-user-update-response") {
          const dataFromServiceWorker = event.data;
          if(dataFromServiceWorker.data.update){
            onUpdateUser()
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

// Older builds registered the worker under /public/ (wrong scope). Remove it
// and its push subscription so users don't get every notification twice.
function retireOldServiceWorker() {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(
        registrations
          .filter((r) => new URL(r.scope).pathname.startsWith("/public/"))
          .map(async (r) => {
            try {
              const sub = await r.pushManager.getSubscription();
              if (sub) {
                await fetch("/notifications/push/unsubscribe", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ endpoint: sub.endpoint }),
                });
                await sub.unsubscribe();
              }
            } catch {}
            return r.unregister();
          })
      )
    )
    .catch(() => {});
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
