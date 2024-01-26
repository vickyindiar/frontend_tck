// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')
firebase.initializeApp({
    apiKey: "AIzaSyBo2wXtIkvvpa3EQsZ4_OFKltK2H4LQcWU",
    projectId: "ticketing-ntf",
    messagingSenderId: "857990037856",
    appId: "1:857990037856:web:e86f49a84b8796b7341e05"
});

// firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };
  // console.log('self',self)
  // console.log('client', self.clients)

  // self.clients.matchAll(options).then(function (clients) {
  //   // Let's see if we already have a chat window open:
  //   const url = new URL(client.url);
  //   if (url.pathname == "admin/ticket") {
  //     // Excellent, let's use it!
  //     client.focus();
  //   }

  //   // do something with your clients list
  // });

 // self.registration.showNotification(notificationTitle,notificationOptions);
  self.registration.hideNotification();
});

//purpose: use push notification with FCM
//move this file to public folder
// and uncomment on index file to register & init firebase