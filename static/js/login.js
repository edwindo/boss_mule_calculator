// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJOEtFOEHeionmu85cHbF7q45JoymzNuM",
  authDomain: "boss-mule-income-calculator.firebaseapp.com",
  databaseURL: "https://boss-mule-income-calculator-default-rtdb.firebaseio.com",
  projectId: "boss-mule-income-calculator",
  storageBucket: "boss-mule-income-calculator.appspot.com",
  messagingSenderId: "1018310468469",
  appId: "1:1018310468469:web:4b8fec4a07bdd95f39e93c"
};

firebase.initializeApp(firebaseConfig);


var loginForm = document.getElementById("loginForm")

const auth = firebase.auth();


// Attach a submit event listener to the form
loginForm.addEventListener("submit", function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Get the email and password values from the form
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;

      // Sign in the user with email and password
    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      localStorage.setItem('userIdToken', userCredential.user.uid)
      window.location.href = '/';
    })
    .catch((error) => {
      // Authentication failed, display error message
      alert(error.message);
    });

  });