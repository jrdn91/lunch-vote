importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyD6W_OjdDb-z8fn438zWD4LKKtVveaYxKE",
  authDomain: "lunch-vote-e2266.firebaseapp.com",
  projectId: "lunch-vote-e2266",
  storageBucket: "lunch-vote-e2266.appspot.com",
  messagingSenderId: "626495872330",
  appId: "1:626495872330:web:ca897e081f42a514d075b3",
  measurementId: "G-Q23H6MTYMM",
});

const messaging = firebase.messaging();

// Not necessary, but if you want to handle clicks on notifications
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const pathname = event.notification?.data?.FCM_MSG?.notification?.data?.link;
  if (!pathname) return;
  const url = new URL(pathname, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        const hadWindowToFocus = clientsArr.some((windowClient) =>
          windowClient.url === url ? (windowClient.focus(), true) : false
        );

        if (!hadWindowToFocus)
          self.clients
            .openWindow(url)
            .then((windowClient) =>
              windowClient ? windowClient.focus() : null
            );
      })
  );
});
