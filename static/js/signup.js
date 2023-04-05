var loginForm = document.getElementById("signupForm")

// Attach a submit event listener to the form
loginForm.addEventListener("submit", function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Get the email and password values from the form
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    var confirmPassword = document.getElementById("inputPassword").value;
  
    // Pass the email and password values to your Flask backend using fetch()
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
      if (response.ok) {
        response.json().then(data => {
          localStorage.setItem('userIdToken', data.id_token);
          window.location.href = "/";
        })
      } else {
        // Authentication failed, display an error message
        var errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Invalid email or password.";
      }
    })
    .catch(error => {
      console.error(error);
    });
  });