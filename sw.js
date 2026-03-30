/* Service Worker for Reminders PWA */
/* This file enables background push notifications on iOS */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* Fired when a push notification arrives */
self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Reminder", body: event.data.text() };
    }
  }

  const title = data.title || "Reminder";
  const options = {
    body: data.body || "You have a reminder",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: data
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/* When user taps the notification */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        if (clients.length > 0) {
          return clients[0].focus();
        }
        return self.clients.openWindow("/");
      })
  );
});
