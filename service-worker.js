// Momentum Command Center - Service Worker

const CACHE_NAME = "momentum-v1";

// Install Service Worker
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Receive notification requests from the Momentum app
self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "SHOW_NOTIFICATION") {
    event.waitUntil(
      self.registration.showNotification(
        data.title || "MOMENTUM",
        {
          body: data.body || "Momentum reminder",

          // Prevent duplicate notifications
          tag: data.tag || "momentum-notification",

          // Show notification again even if same tag exists
          renotify: true,

          // Extra data if needed later
          data: data.data || {}
        }
      )
    );
  }
});

// When user clicks notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then((clientsList) => {

        // Focus existing Momentum window
        for (const client of clientsList) {
          if ("focus" in client) {
            return client.focus();
          }
        }

        // Otherwise open Momentum website
        if (clients.openWindow) {
          return clients.openWindow("./");
        }
      })
  );
});
