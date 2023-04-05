const form = document.getElementById('bosses');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());

  // Add userIdToken to add character form
  const userIdToken = localStorage.getItem('userIdToken')
  formObject['userIdToken'] = userIdToken
  
  fetch('/characters', {
    method: 'POST',
    body: JSON.stringify(formObject),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    // Navigate to homepage after form submission
    window.location.href = "/";
  })
  .catch(error => {
    console.error(error);
  });
  
});



