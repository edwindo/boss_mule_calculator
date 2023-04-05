function editCharacter() {
    const urlParams = new URLSearchParams(window.location.search)
    const name = urlParams.get('name')

    const params = new URLSearchParams({ name: name})

    fetch('/characters?' + params, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response => response.json()))
      .then((data => data[0]))
      .then(data => {
        document.getElementById('characterName').textContent = "Currently Edting: " + data['characterName']
        document.getElementById('characterNameForm').value = data['characterName']

        const checkboxIds = ['hilla', 'pinkbean', 'cygnus', 'zakum', 'queen', 'pierre', 'vonbon', 'pno', 'magnus', 'vellum', 'pap', 'akechi', 'lotus', 'damien', 'slime'];
        checkboxIds.forEach((id) => {
          document.getElementById(id).checked = data[id];
        });
      })
      .catch(error => {
        console.error(error);
      });
}

const form = document.getElementById('bosses');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());

  // Add userIdToken to add character form
  const userIdToken = localStorage.getItem('userIdToken')
  formObject['userIdToken'] = userIdToken
  
  fetch('/characters', {
    method: 'PUT',
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