const form = document.getElementById('bosses');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());
  
  fetch('/add_character', {
    method: 'POST',
    body: JSON.stringify(formObject),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
});



