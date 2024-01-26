const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname.includes('testapp') ||
   // [::1] is the IPv6 localhost address.
   window.location.hostname === '[::1]' ||
   // 127.0.0.1/8 is considered localhost for IPv4.
   window.location.hostname.match(
     /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
   )
);

const version = process.env.REACT_APP_APIVERSION.substring(0, process.env.REACT_APP_APIVERSION.indexOf('.'))
module.exports = {
  google: {
    // API_KEY: "",
    // CLIENT_ID: "",
    // SECRET: "",
    apiKey: "AIzaSyBo2wXtIkvvpa3EQsZ4_OFKltK2H4LQcWU",
 //   authDomain: "ticketing-ntf.firebaseapp.com",
    projectId: "ticketing-ntf",
  //  storageBucket: "ticketing-ntf.appspot.com",
    messagingSenderId: "857990037856",
    appId: "1:857990037856:web:e86f49a84b8796b7341e05",
    vapidkey: "BDq_Lxw1ysTLecWWul-KekJf45yELrIhfn444rchdG3KA3aPk2iRpzWfFTe1aqDJC6FQuktpt6VntMBeWtSlKs8"
  },
  facebook: {
    APP_ID: "",
  },
  baseURL:  isLocalhost ? 'https://localhost:5001/' : '/',
  apiURL: isLocalhost ? `https://localhost:5001/api/v${version}/`: `/api/v${version}/`,
  apiAdminURL:  isLocalhost ? `https://localhost:5001/api/v${version}/admin/`: `/api/v${version}/admin/`,
}
